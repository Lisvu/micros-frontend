import { useState, useEffect } from "react";
import { Card, Typography, Table, Spin, Tag, Progress, Space } from "antd";
import { TrophyOutlined, BookOutlined, FileTextOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

export default function GradesPage() {
  const [loading, setLoading] = useState(true);
  const [grades, setGrades] = useState([]);

  useEffect(() => {
    // 模拟获取成绩列表
    setTimeout(() => {
      setGrades([
        {
          id: 1,
          course: "C语言编程基础",
          exam: "C语言基础知识测试",
          score: 85,
          grade: "A",
          date: "2026-03-10",
          status: "passed"
        },
        {
          id: 2,
          course: "数据结构与算法",
          exam: "数据结构与算法测试",
          score: 78,
          grade: "B+",
          date: "2026-03-05",
          status: "passed"
        },
        {
          id: 3,
          course: "Python编程基础",
          exam: "Python基础知识测试",
          score: 65,
          grade: "C",
          date: "2026-03-01",
          status: "passed"
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

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
      title: "考试",
      dataIndex: "exam",
      key: "exam",
      render: (text) => (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <FileTextOutlined style={{ color: "#52c41a" }} />
          {text}
        </div>
      )
    },
    {
      title: "成绩",
      dataIndex: "score",
      key: "score",
      render: (score) => (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "18px", fontWeight: "600", color: "#1890ff" }}>
            {score}
          </div>
          <Progress percent={score} size="small" strokeColor="#1890ff" />
        </div>
      )
    },
    {
      title: "等级",
      dataIndex: "grade",
      key: "grade",
      render: (grade) => (
        <Tag
          color={
            grade === "A" ? "green" :
            grade === "B+" ? "blue" :
            grade === "B" ? "cyan" :
            grade === "C" ? "orange" : "red"
          }
          style={{ borderRadius: "12px", padding: "4px 12px", fontWeight: "500" }}
        >
          {grade}
        </Tag>
      )
    },
    {
      title: "考试日期",
      dataIndex: "date",
      key: "date"
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          color={status === "passed" ? "green" : "red"}
          style={{ borderRadius: "12px", padding: "4px 12px", fontWeight: "500" }}
        >
          <Space size="small">
            {status === "passed" ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
            {status === "passed" ? "通过" : "未通过"}
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
            查看您的考试成绩和学习成果，了解您的学习进度和水平。
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
            我的成绩
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