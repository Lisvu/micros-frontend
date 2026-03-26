import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Spin, Alert, List, Tag, Divider } from 'antd';
import { ArrowLeftOutlined, HistoryOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { getQuizHistory } from '../api/course';

const { Item } = List;

export default function QuizHistoryPage() {
  const { courseId, moduleId, contentId } = useParams();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 滚动到页面顶部
    window.scrollTo(0, 0);

    const fetchHistory = async () => {
      try {
        setLoading(true);
        const response = await getQuizHistory(courseId, moduleId, contentId);
        setHistory(response.data.history || []);
      } catch (err) {
        console.error('获取quiz历史记录失败:', err);
        setError('获取历史记录失败');
      } finally {
        setLoading(false);
      }
    };

    if (courseId && moduleId && contentId) {
      fetchHistory();
    }
  }, [courseId, moduleId, contentId]);

  if (loading) {
    return <div style={{ padding: '60px 20px', textAlign: 'center', minHeight: '100vh' }}><Spin size="large" tip="加载历史记录..." /></div>;
  }

  if (error) {
    return (
      <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        <Card style={{ background: '#fee2e2', border: '1px solid #fecaca', borderRadius: '12px', textAlign: 'center', padding: '40px 20px' }}>
          <Alert message="错误" description={error} type="error" showIcon />
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', minHeight: '100vh', background: 'linear-gradient(135deg, #e6f7ff 0%, #b3d9ff 100%)' }}>
      {/* 导航栏 */}
      <div style={{ marginBottom: '24px' }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(`/course/${courseId}/module/${moduleId}`)}
          style={{ borderRadius: '16px', padding: '8px 16px', height: 'auto', background: 'white', border: '2px solid #91d5ff', boxShadow: '0 2px 8px rgba(64, 169, 255, 0.2)', transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(64, 169, 255, 0.3)' } }}
        >
          返回
        </Button>
      </div>

      {/* 标题 */}
      <Card style={{ borderRadius: '20px', border: 'none', boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)', marginBottom: '32px', overflow: 'hidden', background: 'white', border: '2px solid #f0f9ff' }}>
        <div style={{ padding: '32px', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
            <HistoryOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
            <h1 style={{ margin: '0', fontSize: '28px', fontWeight: '700', color: '#1890ff' }}>Quiz历史答题记录</h1>
          </div>
          <p style={{ margin: '0', fontSize: '16px', color: '#666' }}>查看你的所有答题记录和详细解析</p>
        </div>
      </Card>

      {/* 历史记录列表 */}
      {history.length > 0 ? (
        <List itemLayout="vertical" dataSource={history} renderItem={(record, index) => (
          <Item key={record.id} style={{ background: 'white', borderRadius: '16px', marginBottom: '24px', padding: '24px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', border: '2px solid #f0f9ff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #1890ff, #40a9ff)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: '600' }}>{history.length - index}</div>
                <h3 style={{ margin: '0', fontSize: '18px', fontWeight: '600', color: '#333' }}>答题记录 #{history.length - index}</h3>
              </div>
              <Tag color={record.grades >= record.total_points * 0.6 ? 'green' : 'orange'} style={{ borderRadius: '12px', padding: '8px 16px', fontSize: '14px', fontWeight: '600' }}>{record.grades}/{record.total_points} 分</Tag>
            </div>

            <Divider style={{ margin: '16px 0' }} />

            {/* 答题详情 */}
            {record.question_record && (
              <div style={{ marginTop: '16px' }}>
                <h4 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600', color: '#1890ff' }}>答题详情:</h4>
                {JSON.parse(record.question_record).map((question, qIndex) => (
                  <div key={question.question_id} style={{ marginBottom: '20px', padding: '16px', background: '#f9f9f9', borderRadius: '12px', borderLeft: `4px solid ${question.is_correct ? '#10b981' : '#ef4444'}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '16px', fontWeight: '500', color: '#333', marginBottom: '8px' }}>{qIndex + 1}. {question.question_text}</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#666' }}>
                            <span style={{ fontWeight: '500', color: '#333' }}>你的答案:</span>
                            <span>{Array.isArray(question.user_answer) ? question.user_answer.join(', ') : question.user_answer}</span>
                          </div>
                          {!question.is_correct && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#10b981' }}>
                              <span style={{ fontWeight: '500' }}>正确答案:</span>
                              <span>{Array.isArray(question.correct_answer) ? question.correct_answer.join(', ') : question.correct_answer}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: question.is_correct ? '#dcfce7' : '#fee2e2', color: question.is_correct ? '#10b981' : '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                        {question.is_correct ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                      </div>
                    </div>
                    <div style={{ marginTop: '12px', fontSize: '14px', fontWeight: '600', color: question.is_correct ? '#10b981' : '#ef4444' }}>
                      {question.is_correct ? '✓ 回答正确' : '✗ 回答错误'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Item>
        )} />
      ) : (
        <Card style={{ borderRadius: '16px', textAlign: 'center', padding: '60px 20px', border: '2px dashed #e5e7eb', background: '#fafbfc' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }}>📝</div>
          <h3 style={{ color: '#6b7280', marginBottom: '8px' }}>暂无答题记录</h3>
          <p style={{ color: '#9ca3af' }}>开始测验后，这里会显示你的答题记录</p>
        </Card>
      )}
    </div>
  );
}