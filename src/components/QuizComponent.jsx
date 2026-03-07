import { useState, useEffect } from "react";
import { Card, Button, Radio, Checkbox, Form, Spin, Alert, Progress, message, Input, Typography, Space, Divider, Tag } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined, QuestionCircleOutlined, CheckOutlined, ClockCircleOutlined, BarChartOutlined, EditOutlined } from "@ant-design/icons";
import { generateQuiz, submitQuiz } from "../api/course";
import { useNavigate } from "react-router-dom";

const { Title, Paragraph, Text } = Typography;

export default function QuizComponent({ courseId, moduleId, contentId, onProgressUpdate }) {
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const generateNewQuiz = async () => {
    try {
      setLoading(true);
      const response = await generateQuiz(courseId, moduleId, contentId);
      console.log('Quiz Response:', response);
      
      if (response.data.error) {
        const errorMsg = response.data.error === 'NO_TOPICS_FOUND' 
          ? '该内容暂无题目数据'
          : `生成Quiz失败: ${response.data.error}`;
        message.error(errorMsg);
        return;
      }
      
      if (!response.data.questions || response.data.questions.length === 0) {
        message.error('该内容暂无题目数据');
        return;
      }
      
      setQuiz(response.data);
      setAnswers({});
      setResult(null);
      setShowResult(false);
    } catch (err) {
      console.error('生成Quiz错误:', err);
      const errorMsg = err.response?.data?.message || err.message || '生成Quiz失败,请检查网络连接';
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateNewQuiz();
  }, [courseId, moduleId, contentId]);

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  // 获取选项ID映射（将字母转换为选项ID）
  const getOptionIdFromLetter = (question, letterAnswer) => {
    if (!question.options || question.options.length === 0) return letterAnswer;
    
    const letterIndex = letterAnswer.charCodeAt(0) - 65; // 获取A=0, B=1等
    if (letterIndex >= 0 && letterIndex < question.options.length) {
      return question.options[letterIndex].id;
    }
    return letterAnswer;
  };

  const getOptionIdsFromLetters = (question, letterAnswers) => {
    if (!Array.isArray(letterAnswers)) return [];
    return letterAnswers.map(letter => getOptionIdFromLetter(question, letter));
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => {
        const question = quiz.questions.find(q => q.id === parseInt(questionId));
        if (!question) {
          return {
            question_id: parseInt(questionId),
            answer: answer
          };
        }

        // 转换答案格式
        let convertedAnswer = answer;
        if (question.question_type === 'multiple_choice') {
          // 单选题：转换单个字母为选项ID
          convertedAnswer = getOptionIdFromLetter(question, answer);
        } else if (question.question_type === 'multiple_select') {
          // 多选题：转换字母数组为选项ID数组
          const optionIds = getOptionIdsFromLetters(question, answer);
          convertedAnswer = optionIds.join(',');
        }
        // fill_blank不需要转换，直接发送文本

        return {
          question_id: parseInt(questionId),
          answer: convertedAnswer
        };
      });

      console.log('提交的答案:', formattedAnswers);
      const response = await submitQuiz(courseId, moduleId, contentId, formattedAnswers);
      console.log('提交响应:', response);
      
      if (response.data.error) {
        message.error(`提交失败: ${response.data.error}`);
        return;
      }
      
      setResult(response.data);
      setShowResult(true);
      message.success('提交成功！');
      if (onProgressUpdate) onProgressUpdate();
      // 延迟导航，让用户看到结果
      setTimeout(() => {
        navigate(`/course/${courseId}/module/${moduleId}`);
      }, 3000);
    } catch (err) {
      console.error('提交错误:', err);
      const errorMsg = err.response?.data?.message || err.message || '提交失败,请检查网络连接';
      message.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '60px 20px',
        minHeight: '50vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Spin size="large" tip="正在加载Quiz题目..." />
        <Text style={{ marginTop: 16, color: '#666' }}>准备题目中，请稍候...</Text>
      </div>
    );
  }

  if (!quiz || !quiz.questions) {
    return (
      <Card 
        style={{
          maxWidth: 800,
          margin: '0 auto',
          borderRadius: 12,
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
        }}
      >
        <Alert 
          message="无法加载Quiz" 
          description="该内容暂无题目数据或加载失败,请检查浏览器控制台查看详细错误信息" 
          type="error" 
          showIcon
          action={
            <Button size="small" type="primary" onClick={generateNewQuiz}>
              重试
            </Button>
          }
        />
      </Card>
    );
  }

  // 计算答题进度
  const progress = quiz.questions.length > 0 
    ? Math.round((Object.keys(answers).length / quiz.questions.length) * 100) 
    : 0;

  // 获取题目类型的显示文本和图标
  const getQuestionTypeInfo = (type) => {
    switch (type) {
      case 'multiple_choice':
        return { text: '单选题', icon: <QuestionCircleOutlined /> };
      case 'multiple_select':
        return { text: '多选题', icon: <QuestionCircleOutlined /> };
      case 'fill_blank':
        return { text: '填空题', icon: <EditOutlined /> };
      default:
        return { text: '题目', icon: <QuestionCircleOutlined /> };
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '20px', backgroundColor: '#d6e9fe69' }}>
      {/* 顶部信息卡 */}
      <Card 
        style={{
          marginBottom: 24,
          borderRadius: 12,
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
          border: 'none'
        }}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Title level={4} style={{ margin: 0, color: '#2c3e50' }}>Quiz 测试</Title>
            <Button 
              onClick={generateNewQuiz}
              style={{ borderRadius: 6 }}
            >
              重新生成
            </Button>
          </div>
          
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ClockCircleOutlined style={{ color: '#4a90e2' }} />
              <Text>共 {quiz.questions.length} 道题目</Text>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <BarChartOutlined style={{ color: '#4a90e2' }} />
              <Text>总分: {quiz.questions.reduce((sum, q) => sum + (q.points || 1), 0)} 分</Text>
            </div>
          </div>
          
          {/* 答题进度条 */}
          <div style={{ marginTop: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <Text size="small">答题进度</Text>
              <Text size="small">{Object.keys(answers).length}/{quiz.questions.length}</Text>
            </div>
            <Progress 
              percent={progress} 
              strokeColor="#4a90e2" 
              size="small"
              status={progress === 100 ? "success" : "active"}
            />
          </div>
        </Space>
      </Card>

      {/* 题目列表 */}
      <div style={{ marginBottom: 32 }}>
        {quiz.questions.map((question, index) => {
          const typeInfo = getQuestionTypeInfo(question.question_type);
          return (
            <Card 
              key={question.id} 
              style={{
                marginBottom: 20,
                borderRadius: 12,
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                border: 'none',
                transition: 'all 0.3s ease',
                backgroundColor: '#fff'
              }}
              hoverable
            >
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <div style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: '#4a90e2',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 14,
                    fontWeight: 600
                  }}>
                    {index + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <Text strong style={{ fontSize: 16, color: '#2c3e50' }}>{question.question_text}</Text>
                      <Tag 
                        size="small" 
                        style={{
                          background: '#ffffff',
                          color: '#4a90e2',
                          border: '1px solid #d6e4ff'
                        }}
                      >
                        {typeInfo.icon}
                        {typeInfo.text}
                      </Tag>
                    </div>
                    {question.topic && (
                      <Text type="secondary" style={{ fontSize: 12 }}>主题: {question.topic}</Text>
                    )}
                  </div>
                  <Tag size="small" color="blue">
                    {question.points || 1} 分
                  </Tag>
                </div>

                {/* 选项 */}
                {question.question_type === 'multiple_choice' && question.options && question.options.length > 0 && (
                  <Radio.Group
                    value={answers[question.id] || ''}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    disabled={showResult}
                    style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}
                  >
                    {question.options.map((option, optIndex) => {
                      const letter = String.fromCharCode(65 + optIndex);
                      return (
                        <Radio 
                          key={option.id || optIndex} 
                          value={letter}
                          style={{
                            padding: 12,
                            borderRadius: 8,
                            border: '1px solid #e7e6e6',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{
                              width: 24,
                              height: 24,
                              borderRadius: '50%',
                              border: '1px solid #d9d9d9',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: 14,
                              fontWeight: 600
                            }}>
                              {letter}
                            </div>
                            <Text>{option.text}</Text>
                          </div>
                        </Radio>
                      );
                    })}
                  </Radio.Group>
                )}

                {question.question_type === 'multiple_select' && question.options && question.options.length > 0 && (
                  <Checkbox.Group
                    value={answers[question.id] || []}
                    onChange={(values) => handleAnswerChange(question.id, values)}
                    disabled={showResult}
                    style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}
                  >
                    {question.options.map((option, optIndex) => {
                      const letter = String.fromCharCode(65 + optIndex);
                      return (
                        <Checkbox 
                          key={option.id || optIndex} 
                          value={letter}
                          style={{
                            padding: 12,
                            borderRadius: 8,
                            border: '1px solid #e8e8e8',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{
                              width: 24,
                              height: 24,
                              borderRadius: 4,
                              border: '1px solid #d9d9d9',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: 14,
                              fontWeight: 600
                            }}>
                              {letter}
                            </div>
                            <Text>{option.text}</Text>
                          </div>
                        </Checkbox>
                      );
                    })}
                  </Checkbox.Group>
                )}

                {question.question_type === 'fill_blank' && (
                  <div style={{ marginTop: 4 }}>
                    <Input
                      placeholder="请输入你的答案"
                      value={answers[question.id] || ''}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      disabled={showResult}
                      style={{
                        padding: '12px 16px',
                        borderRadius: 8,
                        fontSize: 16,
                        border: '1px solid #d9d9d9',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  </div>
                )}

                {(!question.options || question.options.length === 0) && !['fill_blank'].includes(question.question_type) && (
                  <Alert 
                    message="该题目没有选项数据" 
                    type="warning" 
                    style={{ marginTop: 8 }}
                  />
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* 提交区域 */}
      {!showResult && (
        <div style={{ 
          position: 'sticky', 
          bottom: 0, 
          backgroundColor: 'white',
          padding: 20,
          borderRadius: 12,
          boxShadow: '0 -2px 10px rgba(0,0,0,0.05)',
          marginBottom: 20
        }}>
          <Space style={{ width: '100%', justifyContent: 'space-between' }}>
            <Text>
              已完成 {Object.keys(answers).length}/{quiz.questions.length} 道题目
            </Text>
            <Button
              type="primary"
              onClick={handleSubmit}
              loading={submitting}
              disabled={Object.keys(answers).length !== quiz.questions.length}
              size="large"
              style={{
                padding: '0 32px',
                height: 48,
                borderRadius: 8,
                fontSize: 16,
                fontWeight: 600
              }}
            >
              提交答案
            </Button>
          </Space>
        </div>
      )}

      {/* 结果显示 */}
      {showResult && result && (
        <Card 
          style={{
            marginBottom: 20,
            borderRadius: 12,
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
            border: 'none',
            textAlign: 'center'
          }}
        >
          <div style={{ padding: 40 }}>
            <div style={{ marginBottom: 24 }}>
              <Progress
                type="circle"
                percent={Math.round((result.grades / result.total_points) * 100)}
                format={(percent) => `${percent}%`}
                size={160}
                strokeColor={{
                  from: '#4a90e2',
                  to: '#52c41a'
                }}
              />
            </div>
            <Title level={4} style={{ margin: '0 0 16px 0' }}>
              {result.grades >= result.total_points * 0.6 ? '测试通过！' : '测试未通过'}
            </Title>
            <Paragraph style={{ marginBottom: 24 }}>
              得分: <Text strong style={{ fontSize: 20, color: '#4a90e2' }}>{result.grades}/{result.total_points}</Text>
              <br />
              正确率: <Text strong style={{ fontSize: 16, color: '#4a90e2' }}>{Math.round((result.grades / result.total_points) * 100)}%</Text>
            </Paragraph>
            {result.wrong_questions && result.wrong_questions.length > 0 && (
              <Alert 
                message={`有 ${result.wrong_questions.length} 道题目回答错误`} 
                type="info" 
                showIcon
                style={{ marginBottom: 24 }}
              />
            )}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <Button 
                type="primary" 
                size="large"
                onClick={generateNewQuiz}
                style={{ borderRadius: 8 }}
              >
                重新测试
              </Button>
              <Button 
                size="large"
                onClick={() => navigate(`/course/${courseId}/module/${moduleId}`)}
                style={{ borderRadius: 8 }}
              >
                返回模块
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}