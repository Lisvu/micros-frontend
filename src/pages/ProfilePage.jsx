import { Card, Form, Input, Button, Row, Col, Avatar, Divider, Space, message, Typography } from "antd";
import { UserOutlined, MailOutlined, PhoneOutlined, SmileOutlined, CalendarOutlined, CheckCircleOutlined, KeyOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { getUser } from "../api/auth";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

export default function ProfilePage() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await getUser();
        setUserData(res.data.user);
        form.setFieldsValue({
          name: res.data.user?.name,
          email: res.data.user?.email,
          phone: res.data.user?.phone || "",
        });
      } catch (err) {
        console.error("获取用户信息失败:", err);
        message.error("获取用户信息失败");
      }
    };
    fetchUserData();
  }, [form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // 这里应该调用更新用户信息的 API
      // await updateUser(values);
      message.success("个人信息更新成功");
    } catch (err) {
      message.error("更新失败，请重试");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "linear-gradient(135deg, #fff9c4 0%, #f9efcb88 100%)",
      padding: "24px"
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <Title level={2} style={{ 
            color: "#333", 
            fontSize: "28px",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px"
          }}>
            <SmileOutlined style={{ color: "#ff8f00", fontSize: "32px" }} />
            个人中心
          </Title>
          <Text style={{ color: "#666", fontSize: "16px" }}>管理你的个人信息</Text>
        </div>

        <Row gutter={[24, 24]}>
          {/* 用户头像和基本信息 */}
          <Col xs={24} md={8}>
            <Card 
              style={{
                borderRadius: "20px",
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                border: "none",
                background: "white",
                overflow: "hidden",
                transition: "all 0.3s ease"
              }}
              hoverable
            >
              <div style={{ 
                textAlign: "center",
                padding: "32px 24px",
                background: "linear-gradient(135deg, #fff3e0 0%, #ffcc80 100%)",
                margin: "-24px -24px 24px -24px"
              }}>
                <div style={{ 
                  width: 120, 
                  height: 120, 
                  borderRadius: "50%", 
                  background: "linear-gradient(135deg, #ffb300 0%, #ff8f00 100%)",
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  margin: "0 auto 16px auto",
                  boxShadow: "0 4px 12px rgba(255, 179, 0, 0.3)"
                }}>
                  <SmileOutlined style={{ fontSize: 60, color: "white" }} />
                </div>
                <Title level={4} style={{ 
                  margin: "0 0 8px 0", 
                  color: "#333",
                  fontWeight: "600"
                }}>
                  {userData?.name || "用户"}
                </Title>
                <Text style={{ color: "#666" }}>{userData?.email}</Text>
              </div>
              
              <Divider style={{ margin: "16px 0" }} />
              
              <Space direction="vertical" style={{ width: "100%" }}>
                <div style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "12px",
                  padding: "12px 0"
                }}>
                  <CalendarOutlined style={{ color: "#ff8f00", fontSize: "20px" }} />
                  <div>
                    <Text style={{ color: "#999", fontSize: "14px" }}>加入时间：</Text>
                    <br />
                    <Text style={{ color: "#333" }}>
                      {userData?.created_at ? new Date(userData.created_at).toLocaleDateString() : "未知"}
                    </Text>
                  </div>
                </div>
                <div style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "12px",
                  padding: "12px 0"
                }}>
                  <CheckCircleOutlined style={{ color: "#ff8f00", fontSize: "20px" }} />
                  <div>
                    <Text style={{ color: "#999", fontSize: "14px" }}>用户状态：</Text>
                    <br />
                    <Text style={{ color: "#52c41a", fontWeight: "500" }}>正常</Text>
                  </div>
                </div>
              </Space>
              
              <Button
                type="primary"
                block
                style={{
                  marginTop: "24px",
                  height: "48px",
                  fontSize: "16px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #ffb300 0%, #ff8f00 100%)",
                  border: "none",
                  fontWeight: "600",
                  boxShadow: "0 4px 12px rgba(255, 179, 0, 0.3)",
                  transition: "all 0.3s ease",
                  '&:hover': {
                    background: "linear-gradient(135deg, #ffc107 0%, #ff9800 100%)",
                    boxShadow: "0 6px 16px rgba(255, 179, 0, 0.4)"
                  }
                }}
                onClick={() => navigate("/change-password")}
                icon={<KeyOutlined />}
              >
                修改密码
              </Button>
            </Card>
          </Col>

          {/* 用户信息编辑 */}
          <Col xs={24} md={16}>
            <Card 
              title={
                <div style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "8px",
                  color: "#333",
                  fontSize: "20px",
                  fontWeight: "600"
                }}>
                  <UserOutlined style={{ color: "#ff8f00" }} />
                  个人信息
                </div>
              }
              style={{
                borderRadius: "20px",
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                border: "none",
                background: "white"
              }}
            >
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                autoComplete="off"
              >
                <Form.Item
                  label={<div style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "6px",
                    color: "#555",
                    fontWeight: "500"
                  }}>
                    <UserOutlined style={{ color: "#ff8f00" }} />
                    姓名
                  </div>}
                  name="name"
                  rules={[{ required: true, message: "请输入姓名" }]}
                >
                  <Input 
                    prefix={<UserOutlined style={{ color: "#ff8f00" }} />} 
                    placeholder="请输入姓名"
                    style={{
                      borderRadius: "12px",
                      height: "48px",
                      fontSize: "14px",
                      border: "2px solid #f0f0f0",
                      transition: "all 0.3s ease",
                      '&:focus': {
                        borderColor: '#ff8f00',
                        boxShadow: '0 0 0 2px rgba(255, 143, 0, 0.1)'
                      }
                    }}
                  />
                </Form.Item>

                <Form.Item
                  label={<div style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "6px",
                    color: "#555",
                    fontWeight: "500"
                  }}>
                    <MailOutlined style={{ color: "#ff8f00" }} />
                    邮箱
                  </div>}
                  name="email"
                  rules={[
                    { required: true, message: "请输入邮箱" },
                    { type: "email", message: "邮箱格式不正确" },
                  ]}
                >
                  <Input
                    prefix={<MailOutlined style={{ color: "#ff8f00" }} />}
                    placeholder="请输入邮箱"
                    disabled
                    style={{
                      borderRadius: "12px",
                      height: "48px",
                      fontSize: "14px",
                      border: "2px solid #f0f0f0",
                      backgroundColor: "#f9f9f9"
                    }}
                  />
                </Form.Item>

                <Form.Item
                  label={<div style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "6px",
                    color: "#555",
                    fontWeight: "500"
                  }}>
                    <PhoneOutlined style={{ color: "#ff8f00" }} />
                    手机号
                  </div>}
                  name="phone"
                  rules={[
                    {
                      pattern: /^1[3-9]\d{9}$/,
                      message: "请输入正确的手机号",
                    },
                  ]}
                >
                  <Input
                    prefix={<PhoneOutlined style={{ color: "#ff8f00" }} />}
                    placeholder="请输入手机号"
                    style={{
                      borderRadius: "12px",
                      height: "48px",
                      fontSize: "14px",
                      border: "2px solid #f0f0f0",
                      transition: "all 0.3s ease",
                      '&:focus': {
                        borderColor: '#ff8f00',
                        boxShadow: '0 0 0 2px rgba(255, 143, 0, 0.1)'
                      }
                    }}
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    loading={loading}
                    block
                    style={{
                      height: "48px",
                      fontSize: "16px",
                      borderRadius: "12px",
                      background: "linear-gradient(135deg, #ffb300 0%, #ff8f00 100%)",
                      border: "none",
                      fontWeight: "600",
                      boxShadow: "0 4px 12px rgba(255, 179, 0, 0.3)",
                      transition: "all 0.3s ease",
                      '&:hover': {
                        background: "linear-gradient(135deg, #ffc107 0%, #ff9800 100%)",
                        boxShadow: "0 6px 16px rgba(255, 179, 0, 0.4)"
                      }
                    }}
                  >
                    保存修改
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}