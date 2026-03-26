import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, List, Badge, Spin, Button, Alert, Typography } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { getProgrammingHistory } from "../api/course";

const { Title, Paragraph } = Typography;

export default function ProgrammingHistoryPage() {
  const { courseId, moduleId, contentId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [historyData, setHistoryData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProgrammingHistory();
  }, [courseId, moduleId, contentId]);

  const fetchProgrammingHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getProgrammingHistory(courseId, moduleId, contentId);
      if (res.data.error) {
        setError(res.data.error);
        return;
      }
      setHistoryData(res.data.history || []);
    } catch (err) {
      console.error('获取编程题提交历史错误:', err);
      setError('获取提交历史失败');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 40 }}>
        <Spin />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 40 }}>
        <Alert message={error} type="error" />
        <Button type="primary" onClick={handleBack} style={{ marginTop: 16 }}>
          <ArrowLeftOutlined /> 返回
        </Button>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <Button type="primary" onClick={handleBack} style={{ marginBottom: 24 }}>
        <ArrowLeftOutlined /> 返回
      </Button>

      <Card title={<Title level={3}>编程题提交历史</Title>}>
        {historyData.length > 0 ? (
          <List
            dataSource={historyData}
            locale={{ emptyText: '暂无提交记录' }}
            renderItem={(item, index) => (
              <List.Item
                style={{
                  marginBottom: 16,
                  padding: 16,
                  border: '1px solid #e8e8e8',
                  borderRadius: 8,
                  backgroundColor: '#f9f9f9'
                }}
              >
                <List.Item.Meta
                  title={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '18px', fontWeight: '600' }}>提交 #{historyData.length - index}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <Badge 
                          status={item.status === 'AC' ? 'success' : item.status === 'WA' ? 'warning' : 'processing'} 
                          text={item.status === 'AC' ? '答案正确' : item.status === 'WA' ? '错误' : '正在判题中'}
                          style={{ fontSize: '16px' }}
                        />
                        <span style={{ fontSize: '16px', color: '#666' }}>分数: {item.score}</span>
                        <span style={{ fontSize: '16px', color: '#666' }}>语言: {item.language}</span>
                      </div>
                    </div>
                  }
                  description={
                    <div>
                      <div style={{ marginBottom: 12, fontSize: '14px', color: '#6b7280' }}>
                        提交时间: {new Date(item.created_at).toLocaleString()}
                      </div>
                      {item.failed_case && (
                        <div style={{
                          marginTop: 16,
                          padding: 16,
                          backgroundColor: '#fff5f5',
                          borderRadius: 10,
                          border: '2px solid #fed7d7',
                          boxShadow: '0 2px 6px rgba(220, 38, 38, 0.1)'
                        }}>
                          <div style={{
                            marginBottom: 12,
                            paddingBottom: 8,
                            borderBottom: '1px solid #fed7d7'
                          }}>
                            <h5 style={{ 
                              margin: 0, 
                              color: '#c53030',
                              fontSize: '16px',
                              fontWeight: 600
                            }}>
                              错误测试用例
                            </h5>
                          </div>
                          <div style={{ marginBottom: 12 }}>
                            <div style={{
                              display: 'inline-block',
                              padding: '4px 12px',
                              backgroundColor: '#fee2e2',
                              borderRadius: '16px',
                              fontSize: '14px',
                              color: '#b91c1c',
                              fontWeight: 500
                            }}>
                              测试用例 ID: {item.failed_case.id}
                            </div>
                          </div>
                          <div style={{ marginBottom: 12 }}>
                            <div style={{
                              marginBottom: 6,
                              fontSize: '14px',
                              fontWeight: 600,
                              color: '#1f2937'
                            }}>
                              输入
                            </div>
                            <div style={{
                              backgroundColor: '#1e1e1e',
                              padding: 12,
                              borderRadius: 6,
                              border: '1px solid #333',
                              fontFamily: 'monospace',
                              fontSize: '16px',
                              fontWeight: 'bold',
                              whiteSpace: 'pre-wrap',
                              wordBreak: 'break-all',
                              lineHeight: '1.4',
                              color: '#d4d4d4'
                            }}>
                              {item.failed_case.input}
                            </div>
                          </div>
                          <div style={{ marginBottom: 12 }}>
                            <div style={{
                              marginBottom: 6,
                              fontSize: '14px',
                              fontWeight: 600,
                              color: '#1f2937'
                            }}>
                              预期输出
                            </div>
                            <div style={{
                              backgroundColor: '#1e1e1e',
                              padding: 12,
                              borderRadius: 6,
                              border: '1px solid #333',
                              fontFamily: 'monospace',
                              fontSize: '16px',
                              fontWeight: 'bold',
                              whiteSpace: 'pre-wrap',
                              wordBreak: 'break-all',
                              lineHeight: '1.4',
                              color: '#98d982'
                            }}>
                              {item.failed_case.expected_output}
                            </div>
                          </div>
                          <div style={{ marginBottom: 6 }}>
                            <div style={{
                              marginBottom: 6,
                              fontSize: '14px',
                              fontWeight: 600,
                              color: '#1f2937'
                            }}>
                              实际输出
                            </div>
                            <div style={{
                              backgroundColor: '#1e1e1e',
                              padding: 12,
                              borderRadius: 6,
                              border: '1px solid #333',
                              fontFamily: 'monospace',
                              fontSize: '16px',
                              fontWeight: 'bold',
                              whiteSpace: 'pre-wrap',
                              wordBreak: 'break-all',
                              lineHeight: '1.4',
                              color: '#f87171'
                            }}>
                              {item.failed_case.actual_output || '无输出'}
                            </div>
                          </div>
                        </div>
                      )}
                      <div style={{ 
                        marginTop: 16,
                        padding: 16,
                        backgroundColor: '#1e1e1e', 
                        borderRadius: 8, 
                        fontFamily: 'monospace', 
                        fontSize: '16px', 
                        whiteSpace: 'pre-wrap', 
                        maxHeight: '300px', 
                        overflowY: 'auto', 
                        color: '#d4d4d4',
                        border: '1px solid #333'
                      }}>
                        {item.code}
                      </div>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        ) : (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <Alert message="暂无提交记录" type="info" />
          </div>
        )}
      </Card>
    </div>
  );
}