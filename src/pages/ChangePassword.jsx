import { useState } from "react";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { LockOutlined, SmileOutlined, KeyOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { changePassword } from "../api/auth";

const { Title } = Typography;

export default function ChangePassword() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    try {
      await form.validateFields();
      const formData = form.getFieldsValue();

      if (formData.newPassword !== formData.confirmPassword) {
        setError("两次密码输入不一致");
        return;
      }

      setLoading(true);
      await changePassword(formData.oldPassword, formData.newPassword);

      message.success("密码修改成功");
      form.resetFields();
    } catch (err) {
      setLoading(false);
      const code = err.response?.data?.code;
      const errorMap = {
        OLD_PASSWORD_INVALID: "原密码不正确",
        PASSWORD_WEAK: "新密码需包含大小写字母、数字和特殊字符",
        PASSWORD_TOO_SHORT: "新密码太短，至少6位",
      };
      setError(errorMap[code] || err.response?.data?.message || "密码修改失败");
    }
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center", 
      background: "linear-gradient(135deg, #fff9c4 0%, #fdf2cd90 100%)",
      padding: "20px"
    }}>
      <Card
        title={
          <div style={{ 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center", 
            gap: "8px",
            marginBottom: "10px"
          }}>
            <div style={{ 
              width: 80, 
              height: 80, 
              borderRadius: "50%", 
              background: "linear-gradient(135deg, #ffb300 0%, #ff8f00 100%)",
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(255, 179, 0, 0.3)"
            }}>
              <SmileOutlined style={{ fontSize: 40, color: "white" }} />
            </div>
            <Title level={3} style={{ 
              margin: 0, 
              display: "flex", 
              alignItems: "center", 
              gap: "8px",
              color: "#333",
              fontSize: "24px"
            }}>
              <KeyOutlined style={{ color: "#ff8f00" }} /> 更改密码
            </Title>
            <p style={{ 
              margin: 0, 
              color: "#666", 
              fontSize: "14px",
              textAlign: "center"
            }}>设置一个新的安全密码吧！</p>
          </div>
        }
        style={{ 
          width: 420, 
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          borderRadius: "20px",
          border: "none",
          overflow: "hidden",
          background: "white",
          transition: "all 0.3s ease"
        }}
        hoverable
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ oldPassword: "", newPassword: "", confirmPassword: "" }}
        >
          <Form.Item
            name="oldPassword"
            label={<div style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "6px",
              color: "#555",
              fontWeight: "500"
            }}>
              <LockOutlined style={{ color: "#ff8f00" }} />
              原密码
            </div>}
            rules={[{ required: true, message: "请输入原密码" }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: "#ff8f00" }} />}
              placeholder="请输入您的原密码"
              autoComplete="current-password"
              visibilityToggle
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
            name="newPassword"
            label={<div style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "6px",
              color: "#555",
              fontWeight: "500"
            }}>
              <KeyOutlined style={{ color: "#ff8f00" }} />
              新密码
            </div>}
            rules={[
              { required: true, message: "请输入新密码" },
              { min: 6, message: "密码至少6位" },
            ]}
          >
            <Input.Password
              prefix={<KeyOutlined style={{ color: "#ff8f00" }} />}
              placeholder="密码需包含大小写字母、数字和特殊字符"
              autoComplete="new-password"
              visibilityToggle
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
            name="confirmPassword"
            label={<div style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "6px",
              color: "#555",
              fontWeight: "500"
            }}>
              <CheckCircleOutlined style={{ color: "#ff8f00" }} />
              确认密码
            </div>}
            rules={[
              { required: true, message: "请确认密码" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("两次密码输入不一致"));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<CheckCircleOutlined style={{ color: "#ff8f00" }} />}
              placeholder="请再次输入新密码"
              autoComplete="new-password"
              visibilityToggle
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

          {error && (
            <div style={{ 
              color: "#ff4d4f", 
              marginBottom: 16, 
              fontSize: 14,
              padding: "12px",
              borderRadius: "8px",
              background: "#fff2f0",
              border: "1px solid #ffccc7",
              textAlign: "center"
            }}>
              {error}
            </div>
          )}

          <Form.Item>
            <Button
              type="primary"
              block
              size="large"
              loading={loading}
              onClick={handleSubmit}
              style={{
                height: 48, 
                fontSize: 16,
                borderRadius: "12px",
                background: "linear-gradient(135deg, #ffb300 0%, #ff8f00 100%)",
                border: "none",
                fontWeight: "600",
                boxShadow: "0 4px 12px rgba(255, 179, 0, 0.3)",
                transition: "all 0.3s ease",
                '&:hover': {
                  background: "linear-gradient(135deg, #ffc107 0%, #ff9800 100%)",
                  boxShadow: "0 6px 16px rgba(255, 179, 0, 0.4)"
                },
                '&:active': {
                  transform: "translateY(1px)"
                }
              }}
            >
              确认修改
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}