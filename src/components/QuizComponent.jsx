import { useState, useEffect } from "react";
import { Card, Button, Radio, Checkbox, Form, Spin, Alert, Progress, message, Input } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { generateQuiz, submitQuiz } from "../api/course";

export default function QuizComponent({ courseId, moduleId, contentId }) {
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
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <Spin tip="正在加载Quiz题目..." />
      </div>
    );
  }

  if (!quiz || !quiz.questions) {
    return (
      <Alert 
        message="无法加载Quiz" 
        description="该内容暂无题目数据或加载失败,请检查浏览器控制台查看详细错误信息" 
        type="error" 
        showIcon
      />
    );
  }

  return (
    <div>
      <Card title="Quiz" extra={<Button onClick={generateNewQuiz}>重新生成</Button>}>
        {quiz.questions && quiz.questions.length > 0 ? (
          quiz.questions.map((question, index) => (
            <Card key={question.id} size="small" style={{ marginBottom: '16px' }}>
              <div style={{ marginBottom: '8px' }}>
                <strong>{index + 1}. {question.question_text}</strong>
              </div>
              {question.topic && <p style={{ color: '#999', fontSize: '12px' }}>主题: {question.topic}</p>}

              {question.question_type === 'multiple_choice' && question.options && question.options.length > 0 && (
                <Radio.Group
                  value={answers[question.id] || ''}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  disabled={showResult}
                  style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
                >
                  {question.options.map((option, optIndex) => (
                    <Radio key={option.id || optIndex} value={String.fromCharCode(65 + optIndex)}>
                      {String.fromCharCode(65 + optIndex)}. {option.text}
                    </Radio>
                  ))}
                </Radio.Group>
              )}

              {question.question_type === 'multiple_select' && question.options && question.options.length > 0 && (
                <Checkbox.Group
                  value={answers[question.id] || []}
                  onChange={(values) => handleAnswerChange(question.id, values)}
                  disabled={showResult}
                  style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
                >
                  {question.options.map((option, optIndex) => (
                    <Checkbox key={option.id || optIndex} value={String.fromCharCode(65 + optIndex)}>
                      {String.fromCharCode(65 + optIndex)}. {option.text}
                    </Checkbox>
                  ))}
                </Checkbox.Group>
              )}

              {question.question_type === 'fill_blank' && (
                <Input
                  placeholder="请输入你的答案"
                  value={answers[question.id] || ''}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  disabled={showResult}
                  autoFocus
                />
              )}

              {(!question.options || question.options.length === 0) && !['fill_blank'].includes(question.question_type) && (
                <Alert message="该题目没有选项数据" type="warning" />
              )}
            </Card>
          ))
        ) : (
          <Alert message="未找到题目数据" type="warning" />
        )}

        {!showResult && (
          <Button
            type="primary"
            onClick={handleSubmit}
            loading={submitting}
            disabled={Object.keys(answers).length !== quiz.questions.length}
          >
            提交答案
          </Button>
        )}

        {showResult && result && (
          <div style={{ marginTop: '16px' }}>
            <Progress
              type="circle"
              percent={Math.round((result.grades / result.total_points) * 100)}
              format={(percent) => `${percent}%`}
            />
            <p style={{ marginTop: '8px' }}>得分: {result.grades}/{result.total_points} ({Math.round((result.grades / result.total_points) * 100)}%)</p>
            {result.wrong_questions && result.wrong_questions.length > 0 && (
              <p>错误题目数量: {result.wrong_questions.length}</p>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}