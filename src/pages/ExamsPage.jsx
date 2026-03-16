import { useState, useEffect } from "react";
import { Card, Button, Typography, List, Empty, Spin, Tag, Space } from "antd";
import { CalendarOutlined, ClockCircleOutlined, BookOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { getUserCourses } from "../api/course";

const { Title, Paragraph } = Typography;

export default function ExamsPage() {
  const [loading, setLoading] = useState(true);
  const [exams, setExams] = useState([]);

  useEffect(() => {
    // 获取用户已选课程并生成考试列表
    const fetchCoursesAndGenerateExams = async () => {
      try {
        const response = await getUserCourses();
        const courses = response.data;
        
        // 根据课程生成考试列表
        const generatedExams = courses.map((course, index) => {
          // 为每门课程生成一个考试
          const examDate = new Date();
          examDate.setDate(examDate.getDate() + index * 5); // 每门课程的考试日期间隔5天
          
          // 随机设置考试时间
          const hour = 9 + Math.floor(Math.random() * 6); // 9-14点之间
          const minute = Math.floor(Math.random() * 60);
          const formattedTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
          
          // 随机设置考试时长
          const duration = 60 + Math.floor(Math.random() * 60); // 60-120分钟
          
          // 随机设置考试状态
          const statuses = ['upcoming', 'completed'];
          const status = index % 2 === 0 ? 'upcoming' : 'completed';
          
          return {
            id: course.id,
            courseId: course.id,
            title: `${course.title} - 考试`,
            description: `测试对${course.title}课程内容的掌握程度`,
            startTime: `${examDate.toISOString().split('T')[0]} ${formattedTime}`,
            duration: duration,
            status: status
          };
        });
        
        setExams(generatedExams);
      } catch (error) {
        console.error('获取课程列表失败:', error);
        setExams([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCoursesAndGenerateExams();
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
                          color={exam.status === "upcoming" ? "blue" : "green"}
                          style={{
                            borderRadius: "16px",
                            padding: "4px 12px",
                            fontWeight: 500,
                            fontSize: "12px"
                          }}
                        >
                          {exam.status === "upcoming" ? "即将考试" : "已完成"}
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
                    <Button
                        type={exam.status === "upcoming" ? "primary" : "default"}
                        size="middle"
                        disabled={exam.status === "completed"}
                        style={{
                          borderRadius: "12px",
                          padding: "8px 24px",
                          fontSize: "16px"
                        }}
                      >
                        {exam.status === "upcoming" ? "参加考试" : "查看结果"}
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