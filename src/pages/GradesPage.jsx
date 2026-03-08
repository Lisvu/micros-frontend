import { useState, useEffect } from "react";
import { Card, Typography, Table, Spin, Tag, Progress, Space, message } from "antd";
import { TrophyOutlined, BookOutlined, FileTextOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import request from '../api/request';

const { Title, Paragraph } = Typography;

export default function GradesPage() {
  const [loading, setLoading] = useState(true);
  const [grades, setGrades] = useState([]);

  useEffect(() => {
    fetchGrades();
  }, []);

  const fetchGrades = async () => {
    try {
      setLoading(true);
      console.log('开始获取成绩...');
      
      // 使用新的 API 端点获取所有小测的最高成绩
      console.log('获取所有小测的最高成绩...');
      const highestScoresResponse = await request.get('/course/quiz/highest-scores');
      const highestScores = highestScoresResponse.data;
      console.log('所有小测的最高成绩:', highestScores);

      // 格式化成绩数据
      const allGrades = highestScores.map(score => ({
        id: score.id,
        course: score.course_title,
        module: score.module_title,
        quiz: score.quiz_title,
        highestScore: score.highest_score,
        totalPoints: score.total_points,
        date: new Date().toISOString().split('T')[0],
        status: 'completed'
      }));
      
      console.log('格式化后的成绩记录:', allGrades);
      setGrades(allGrades);
    } catch (error) {
      message.error('获取成绩失败');
      console.error('获取成绩失败:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "60px 20px", textAlign: "center" }}>
        <Spin size="large" tip="加载成绩列表..." />
      </div>
    );
  }

  const columns = [
    {
      title: "课程",
      dataIndex: "course",
      key: "course",
      render: (text) => (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <BookOutlined style={{ color: "#1890ff" }} />
          {text}
        </div>
      )
    },
    {
      title: "模块",
      dataIndex: "module",
      key: "module",
      render: (text) => (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <FileTextOutlined style={{ color: "#52c41a" }} />
          {text}
        </div>
      )
    },
    {
      title: "小测",
      dataIndex: "quiz",
      key: "quiz"
    },
    {
      title: "最高成绩",
      dataIndex: "highestScore",
      key: "highestScore",
      render: (highestScore, record) => (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "18px", fontWeight: "600", color: "#1890ff" }}>
            {highestScore}/{record.totalPoints}
          </div>
          <Progress 
            percent={(highestScore / record.totalPoints) * 100} 
            size="small" 
            strokeColor="#1890ff" 
          />
        </div>
      )
    },
    {
      title: "完成日期",
      dataIndex: "date",
      key: "date"
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          color={status === "completed" ? "green" : "red"}
          style={{ borderRadius: "12px", padding: "4px 12px", fontWeight: "500" }}
        >
          <Space size="small">
            <CheckCircleOutlined />
            已完成
          </Space>
        </Tag>
      )
    }
  ];

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
            <TrophyOutlined style={{ fontSize: "32px" }} />
            成绩中心
          </Title>
          <Paragraph style={{ fontSize: "16px", color: "#666", lineHeight: "1.6" }}>
            查看您的课程模块小测最高成绩，了解您的学习进度和水平。未参加的测试将不会显示。
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
            课程模块小测最高成绩
          </Title>
          
          <Table
            columns={columns}
            dataSource={grades}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            style={{ borderRadius: "12px", overflow: "hidden" }}
            rowStyle={{
              borderBottom: "1px solid #f0f0f0",
              '&:hover': {
                background: "#f9f9f9"
              }
            }}
          />
        </div>
      </Card>
    </div>
  );
}