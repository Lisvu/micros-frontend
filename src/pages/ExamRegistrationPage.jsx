import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Typography, Spin, Alert, Tag, Divider, message, Popconfirm } from "antd";
import { CalendarOutlined, ClockCircleOutlined, BookOutlined, CheckCircleOutlined, ArrowLeftOutlined, DeleteOutlined } from "@ant-design/icons";
import { getExamDetail, registerExam, getExamRegistrationStatus, cancelExamRegistration } from "../api/course";

const { Title, Paragraph } = Typography;

export default function ExamRegistrationPage() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [exam, setExam] = useState(null);
  const [error, setError] = useState(null);
  const [registered, setRegistered] = useState(false);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    // 获取考试详情
    const fetchExamDetail = async () => {
      try {
        setLoading(true);
        // 获取考试详情
        const examResponse = await getExamDetail(examId);
        setExam(examResponse.data);
        
        // 检查报名状态
        const statusResponse = await getExamRegistrationStatus(examId);
        setRegistered(statusResponse.data.registered);
        
        // 调试信息
        console.log('Exam data:', examResponse.data);
        console.log('Current time:', new Date());
        console.log('Registration start:', new Date(examResponse.data.registration_start));
        console.log('Registration end:', new Date(examResponse.data.registration_end));
      } catch (err) {
        console.error('获取考试详情失败:', err);
        setError('获取考试详情失败');
      } finally {
        setLoading(false);
      }
    };

    if (examId) {
      fetchExamDetail();
    }
  }, [examId]);

  const handleRegister = async () => {
    try {
      setRegistering(true);
      const response = await registerExam(examId);
      if (response.data.message) {
        message.success('报名成功！');
        setRegistered(true);
      }
    } catch (err) {
      console.error('报名失败:', err);
      console.error('Error response:', err.response);
      message.error(err.response?.data?.error || '报名失败');
    } finally {
      setRegistering(false);
    }
  };

  const handleCancelRegistration = async () => {
    try {
      const response = await cancelExamRegistration(examId);
      if (response.data.message) {
        message.success('取消报名成功');
        setRegistered(false);
      }
    } catch (err) {
      console.error('取消报名失败:', err);
      message.error(err.response?.data?.error || '取消报名失败');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "60px 20px", textAlign: "center" }}>
        <Spin size="large" tip="加载考试信息..." />
      </div>
    );
  }

  if (error || !exam) {
    return (
      <div style={{ padding: "24px" }}>
        <Alert message="错误" description={error || "考试信息不存在"} type="error" showIcon />
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate(-1)} 
          style={{ marginTop: "16px" }}
        >
          返回
        </Button>
      </div>
    );
  }

  // 检查是否在报名期间
  const now = new Date();
  const registrationStart = new Date(exam.registration_start);
  const registrationEnd = new Date(exam.registration_end);
  const isRegistrationOpen = now >= registrationStart && now <= registrationEnd;

  return (
    <div style={{ padding: "24px", minHeight: "100vh" }}>
      <Button 
        icon={<ArrowLeftOutlined />} 
        onClick={() => navigate(-1)} 
        style={{ marginBottom: "24px" }}
      >
        返回考试列表
      </Button>

      <Card
        style={{
          borderRadius: "20px",
          border: "none",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
          marginBottom: "32px",
          background: "white"
        }}
      >
        <div style={{ padding: "32px" }}>
          <Title level={1} style={{ margin: "0 0 24px 0", color: "#1890ff", display: "flex", alignItems: "center", gap: "12px" }}>
            <CalendarOutlined style={{ fontSize: "32px" }} />
            考试报名
          </Title>
          <Paragraph style={{ fontSize: "16px", color: "#666", lineHeight: "1.6" }}>
            请确认考试信息并完成报名
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
            考试信息
          </Title>

          <div style={{ marginBottom: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
              <Typography.Title level={4} style={{ margin: "0", color: "#1890ff" }}>
                {exam.name}
              </Typography.Title>
              <Tag color="blue" style={{ borderRadius: "16px", padding: "4px 12px" }}>
                {exam.course.title}
              </Tag>
            </div>
            <Paragraph style={{ margin: "0 0 16px 0", color: "#666" }}>
              测试对{exam.course.title}课程内容的掌握程度
            </Paragraph>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "14px", color: "#333" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <CalendarOutlined style={{ color: "#1890ff" }} />
                <span><strong>考试时间:</strong> {new Date(exam.exam_time).toLocaleString()}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <ClockCircleOutlined style={{ color: "#1890ff" }} />
                <span><strong>报名开始:</strong> {new Date(exam.registration_start).toLocaleString()}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <ClockCircleOutlined style={{ color: "#1890ff" }} />
                <span><strong>报名结束:</strong> {new Date(exam.registration_end).toLocaleString()}</span>
              </div>
            </div>
          </div>

          <Divider />

          <div style={{ marginTop: "24px" }}>
            <Title level={3} style={{ margin: "0 0 16px 0", color: "#333" }}>
              报名状态
            </Title>

            {registered ? (
              <Alert
                message="已报名"
                description="您已经成功报名参加此考试"
                type="success"
                showIcon
                style={{ marginBottom: "24px" }}
              />
            ) : (
              <>
                {isRegistrationOpen ? (
                  <Alert
                    message="可以报名"
                    description="当前处于报名期间，您可以报名参加此考试"
                    type="info"
                    showIcon
                    style={{ marginBottom: "24px" }}
                  />
                ) : (
                  <Alert
                    message="报名未开放"
                    description="当前不在报名期间，请在规定时间内报名"
                    type="warning"
                    showIcon
                    style={{ marginBottom: "24px" }}
                  />
                )}
              </>
            )}

            <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
              {!registered && (
                <>
                  <Button 
                    type="primary" 
                    size="large"
                    loading={registering}
                    disabled={!isRegistrationOpen}
                    onClick={handleRegister}
                    style={{ 
                      flex: 1, 
                      borderRadius: "12px", 
                      height: "48px",
                      fontSize: "16px"
                    }}
                  >
                    {isRegistrationOpen ? "确认报名" : "报名未开放"}
                  </Button>
                  <Button 
                    size="large"
                    onClick={() => navigate(-1)}
                    style={{ 
                      flex: 1, 
                      borderRadius: "12px", 
                      height: "48px",
                      fontSize: "16px"
                    }}
                  >
                    取消
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}