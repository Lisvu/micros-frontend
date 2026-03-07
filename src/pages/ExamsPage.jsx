import { useState, useEffect } from "react";
import { Card, Button, Typography, List, Empty, Spin, Tag, Space } from "antd";
import { CalendarOutlined, ClockCircleOutlined, BookOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

export default function ExamsPage() {
  const [loading, setLoading] = useState(true);
  const [exams, setExams] = useState([]);

  useEffect(() => {
    // 模拟获取考试列表
    setTimeout(() => {
      setExams([
        {
          id: 1,
          title: "C语言基础知识测试",
          description: "测试C语言的基本概念和语法",
          startTime: "2026-03-15 14:00",
          duration: 60,
          status: "upcoming"
        },
        {
          id: 2,
          title: "数据结构与算法测试",
          description: "测试数据结构和算法的理解",
          startTime: "2026-03-20 10:00",
          duration: 90,
          status: "upcoming"
        },
        {
          id: 3,
          title: "Python编程基础测试",
          description: "测试Python语言的基本概念和语法",
          startTime: "2026-03-10 09:00",
          duration: 60,
          status: "completed"
        }
      ]);
      setLoading(false);
    }, 1000);
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
                      <Typography.Title level={4} style={{ margin: "0 0 8px 0", color: "#1890ff" }}>
                        {exam.title}
                      </Typography.Title>
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
                    <Space direction="vertical" align="end">
                      <Tag
                        color={exam.status === "upcoming" ? "blue" : "green"}
                        style={{
                          borderRadius: "16px",
                          padding: "6px 16px",
                          fontWeight: 500,
                          fontSize: "14px"
                        }}
                      >
                        {exam.status === "upcoming" ? "即将开始" : "已完成"}
                      </Tag>
                      <Button
                        type={exam.status === "upcoming" ? "primary" : "default"}
                        size="small"
                        disabled={exam.status === "completed"}
                        style={{
                          borderRadius: "12px",
                          marginTop: "8px"
                        }}
                      >
                        {exam.status === "upcoming" ? "参加考试" : "查看结果"}
                      </Button>
                    </Space>
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