import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Typography, List, Empty, Spin, Tag, Space, message } from "antd";
import { CalendarOutlined, ClockCircleOutlined, BookOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { getExams } from "../api/course";

const { Title, Paragraph } = Typography;

export default function ExamsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [exams, setExams] = useState([]);

  useEffect(() => {
    // 获取真实的考试列表
    const fetchExams = async () => {
      try {
        const response = await getExams();
        const exams = response.data;
        
        // 格式化考试数据
        const formattedExams = exams.map((exam) => {
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
            registrationStart: exam.registration_start,
            registrationEnd: exam.registration_end
          };
        });
        
        setExams(formattedExams);
      } catch (error) {
        console.error('获取考试列表失败:', error);
        console.error('错误详情:', {
          message: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          config: error.config
        });
        setExams([]);
      } finally {
        setLoading(false);
      }
    };
    
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
            考试中心
          </Title>
          <Paragraph style={{ fontSize: "16px", color: "#666", lineHeight: "1.6" }}>
            查看和参加您的课程考试，获取学习成果的评估。
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
            考试列表
          </Title>
          
          {exams.length > 0 ? (
            <List
              itemLayout="vertical"
              dataSource={exams}
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
                        {exam.status === "not_open" && (
                          <div style={{ fontSize: "12px", color: "#666" }}>
                            报名时间: {new Date(exam.registrationStart).toLocaleDateString()} 至 {new Date(exam.registrationEnd).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                    <Button
                        type={exam.status === "upcoming" ? "primary" : "default"}
                        size="middle"
                        disabled={exam.status === "completed" || exam.status === "not_open"}
                        onClick={() => {
                          if (exam.status === "not_open") {
                            message.info("该考试暂未开始报名");
                          } else if (exam.status === "upcoming") {
                            navigate(`/exams/${exam.id}/register`);
                          }
                        }}
                        style={{
                          borderRadius: "12px",
                          padding: "8px 24px",
                          fontSize: "16px"
                        }}
                      >
                        {exam.status === "upcoming" ? "参加考试" : exam.status === "not_open" ? "暂未开放" : "查看结果"}
                      </Button>
                  </div>
                </List.Item>
              )}
            />
          ) : (
            <Empty
              description="暂无考试安排"
              style={{ padding: "60px 0" }}
            />
          )}
        </div>
      </Card>
    </div>
  );
}