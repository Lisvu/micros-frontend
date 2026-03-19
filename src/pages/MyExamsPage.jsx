import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Typography, List, Empty, Spin, Tag, Space, message, Popconfirm } from "antd";
import { CalendarOutlined, ClockCircleOutlined, BookOutlined, CheckCircleOutlined, CloseCircleOutlined, ArrowLeftOutlined, DeleteOutlined } from "@ant-design/icons";
import { getExams, cancelExamRegistration } from "../api/course";

const { Title, Paragraph } = Typography;

export default function MyExamsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [exams, setExams] = useState([]);
  const [registeredExams, setRegisteredExams] = useState([]);

  // 取消报名
  const handleCancelRegistration = async (examId) => {
    try {
      const response = await cancelExamRegistration(examId);
      if (response.data.message) {
        message.success('取消报名成功');
        // 重新获取考试列表
        fetchExams();
      }
    } catch (error) {
      console.error('取消报名失败:', error);
      message.error(error.response?.data?.error || '取消报名失败');
    }
  };

  // 获取考试列表
  const fetchExams = async () => {
    try {
      const response = await getExams();
      const exams = response.data;
      
      // 筛选出用户已经报名的考试
      const registeredExams = exams.filter(exam => exam.registered);
      
      // 格式化考试数据
      const formattedRegisteredExams = registeredExams.map((exam) => {
        // 提取考试时间和日期
        const examDate = new Date(exam.exam_time);
        const dateStr = examDate.toISOString().split('T')[0];
        const timeStr = examDate.toTimeString().split(' ')[0];
        
        // 计算考试时长（默认90分钟）
        const duration = 90;
        
        // 检查是否在报名期间
        const now = new Date();
        const registrationStart = new Date(exam.registration_start);
        const registrationEnd = new Date(exam.registration_end);
        const isRegistrationOpen = now >= registrationStart && now <= registrationEnd;
        
        // 确定考试状态
        let status = exam.status;
        if (status === 'upcoming' && !isRegistrationOpen) {
          status = 'not_open';
        }
        
        return {
          id: exam.id,
          courseId: exam.course_id,
          title: exam.name,
          description: `测试对${exam.course_title}课程内容的掌握程度`,
          startTime: `${dateStr} ${timeStr}`,
          duration: duration,
          status: status,
          registered: exam.registered,
          registrationStart: exam.registration_start,
          registrationEnd: exam.registration_end
        };
      });
      
      setRegisteredExams(formattedRegisteredExams);
    } catch (error) {
      console.error('获取考试列表失败:', error);
      console.error('错误详情:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: error.config
      });
      setRegisteredExams([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 获取真实的考试列表
    fetchExams();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "60px 20px", textAlign: "center" }}>
        <Spin size="large" tip="加载考试列表..." />
      </div>
    );
  }

  return (
    <div style={{ padding: "24px", minHeight: "100vh" }}>
      <Button 
        icon={<ArrowLeftOutlined />} 
        onClick={() => navigate(-1)} 
        style={{ marginBottom: "24px" }}
      >
        返回考试中心
      </Button>

      <Card
        style={{
          borderRadius: "20px",
          border: "none",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
          marginBottom: "32px",
          overflow: "hidden",
          background: "white"
        }}
      >
        <div style={{ padding: "32px" }}>
          <Title level={1} style={{ margin: "0 0 24px 0", color: "#1890ff", display: "flex", alignItems: "center", gap: "12px" }}>
            <CalendarOutlined style={{ fontSize: "32px" }} />
            我的考试
          </Title>
          <Paragraph style={{ fontSize: "16px", color: "#666", lineHeight: "1.6" }}>
            查看您已经报名的考试信息。
          </Paragraph>
        </div>
      </Card>

      <Card
        style={{
          borderRadius: "20px",
          border: "none",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
          background: "white"
        }}
      >
        <div style={{ padding: "24px" }}>
          <Title level={2} style={{ margin: "0 0 24px 0", color: "#333" }}>
            已报名考试
          </Title>
          
          {registeredExams.length > 0 ? (
            <List
              itemLayout="vertical"
              dataSource={registeredExams}
              renderItem={(exam) => (
                <List.Item
                  style={{
                    padding: "20px",
                    borderBottom: "1px solid #f0f0f0",
                    borderRadius: "12px",
                    marginBottom: "12px",
                    background: "#f9f9f9"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                        <Typography.Title level={4} style={{ margin: "0", color: "#1890ff" }}>
                          {exam.title}
                        </Typography.Title>
                        <Tag
                          color={exam.status === "upcoming" ? "blue" : exam.status === "not_open" ? "default" : "green"}
                          style={{
                            borderRadius: "16px",
                            padding: "4px 12px",
                            fontWeight: 500,
                            fontSize: "12px"
                          }}
                        >
                          {exam.status === "upcoming" ? "即将考试" : exam.status === "not_open" ? "暂未开放" : "已完成"}
                        </Tag>
                        <Tag
                          color="green"
                          style={{
                            borderRadius: "16px",
                            padding: "4px 12px",
                            fontWeight: 500,
                            fontSize: "12px"
                          }}
                        >
                          已报名
                        </Tag>
                      </div>
                      <Paragraph style={{ margin: "0 0 12px 0", color: "#666" }}>
                        {exam.description}
                      </Paragraph>
                      <div style={{ display: "flex", gap: "16px", fontSize: "14px", color: "#999" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <CalendarOutlined />
                          {exam.startTime}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <ClockCircleOutlined />
                          {exam.duration} 分钟
                        </div>
                      </div>
                    </div>
                                    <Space>
                        <Button
                          type="default"
                          size="middle"
                          disabled={exam.status !== "upcoming"}
                          onClick={() => {
                            if (exam.status === "upcoming") {
                              navigate(`/exams/${exam.id}/register`);
                            }
                          }}
                          style={{
                            borderRadius: "12px",
                            padding: "8px 24px",
                            fontSize: "16px",
                            minWidth: "100px",
                            textAlign: "center"
                          }}
                        >
                          {exam.status === "upcoming" ? "查看详情" : "已完成"}
                        </Button>
                        {exam.status === "upcoming" && (
                          <Popconfirm
                            title="确定要取消报名吗？"
                            description="取消报名后，您将无法参加该考试。"
                            onConfirm={() => handleCancelRegistration(exam.id)}
                            okText="确定"
                            cancelText="取消"
                          >
                            <Button
                              danger
                              size="middle"
                              icon={<DeleteOutlined />}
                              style={{
                                borderRadius: "12px",
                                padding: "8px 24px",
                                fontSize: "16px",
                                minWidth: "100px",
                                textAlign: "center"
                              }}
                            >
                              取消报名
                            </Button>
                          </Popconfirm>
                        )}
                      </Space>
                  </div>
                </List.Item>
              )}
            />
          ) : (
            <Empty
              description="暂无已报名的考试"
              style={{ padding: "60px 0" }}
            />
          )}
        </div>
      </Card>
    </div>
  );
}