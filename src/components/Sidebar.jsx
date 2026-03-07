import { Layout, Menu, Dropdown } from "antd";
import {
  BookOutlined,
  UserOutlined,
  LogoutOutlined,
  CalendarOutlined,
  TrophyOutlined,
  SmileOutlined,
  StarFilled,
  HeartOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { getUser } from "../api/auth";

const { Header } = Layout;

export default function Navbar({ onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getUser();
        setUserName(res.data.user?.name || "用户");
      } catch (err) {
        console.error("获取用户失败", err);
      }
    };
    fetchUser();
  }, []);

  const getSelectedKey = () => {
    if (location.pathname === "/online-learning") return "online-learning";
    if (location.pathname === "/exams") return "exams";
    if (location.pathname === "/grades") return "grades";
    return "online-learning";
  };

  const menuItems = [
    {
      key: "online-learning",
      icon: <BookOutlined />,
      label: "在线学习",
      onClick: () => navigate("/online-learning"),
    },
    {
      key: "exams",
      icon: <CalendarOutlined />,
      label: "考试",
      onClick: () => navigate("/exams"),
    },
    {
      key: "grades",
      icon: <TrophyOutlined />,
      label: "查看成绩",
      onClick: () => navigate("/grades"),
    },
  ];


  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // 通知父组件更新认证状态
    if (onLogout) {
      onLogout();
    }
    navigate("/");
  };

  const userMenuItems = [
    {
      key: "1",
      label: "个人中心",
      onClick: () => navigate("/profile"),
    },
    {
      key: "2",
      label: "修改密码",
      onClick: () => navigate("/change-password"),
    },
    {
      key: "3",
      label: "退出登录",
      icon: <LogoutOutlined />,
      onClick: handleLogout,
      danger: true,
    },
  ];

  return (
    <Header
      style={{
        background: "linear-gradient(135deg, #e6f7ff 0%, #91d5ff 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 40px",
        borderRadius: "0 0 20px 20px",
        boxShadow: "0 4px 16px rgba(64, 169, 255, 0.2)",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* 装饰元素 */}
      <div style={{
        position: "absolute",
        top: "10px",
        left: "20px",
        width: "60px",
        height: "60px",
        borderRadius: "50%",
        background: "linear-gradient(135deg, #40a9ff 0%, #1890ff 100%)",
        opacity: 0.3,
        zIndex: 0
      }} />
      <div style={{
        position: "absolute",
        bottom: "10px",
        right: "40px",
        width: "80px",
        height: "80px",
        borderRadius: "50%",
        background: "linear-gradient(135deg, #91d5ff 0%, #40a9ff 100%)",
        opacity: 0.2,
        zIndex: 0
      }} />

      {/* 左侧 Logo */}
      <div
        style={{
          color: "#1890ff",
          fontSize: "24px",
          fontWeight: "bold",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          position: "relative",
          zIndex: 1,
          textShadow: "2px 2px 4px rgba(64, 169, 255, 0.2)"
        }}
        onClick={() => navigate("/online-learning")}
      >
        <StarFilled style={{ color: "#ffd666", fontSize: "28px" }} />
        软件设计与开发微专业平台
        <SmileOutlined style={{ color: "#40a9ff", fontSize: "20px" }} />
      </div>

      {/* 中间菜单 */}
      <Menu
        theme="light"
        mode="horizontal"
        selectedKeys={[getSelectedKey()]}
        items={menuItems}
        style={{
          flex: 1,
          marginLeft: 40,
          minWidth: 500,
          position: "relative",
          zIndex: 1
        }}
        itemStyle={{
          borderRadius: "20px",
          margin: "0 8px",
          transition: "all 0.3s ease"
        }}
        menuItemSelectedIcon={<SmileOutlined style={{ color: "#ff6b6b" }} />}
      />

      {/* 右侧用户 */}
      <Dropdown
        menu={{ items: userMenuItems }}
        placement="bottomRight"
        trigger={["click"]}
      >
        <div
          style={{
            color: "#1890ff",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 12,
            background: "rgba(255, 255, 255, 0.8)",
            padding: "8px 16px",
            borderRadius: "20px",
            boxShadow: "0 2px 8px rgba(64, 169, 255, 0.2)",
            transition: "all 0.3s ease",
            position: "relative",
            zIndex: 1,
            '&:hover': {
              transform: "translateY(-2px)",
              boxShadow: "0 4px 12px rgba(64, 169, 255, 0.3)"
            }
          }}
        >
          <div style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #40a9ff 0%, #1890ff 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            boxShadow: "0 2px 4px rgba(64, 169, 255, 0.3)"
          }}>
            <UserOutlined />
          </div>
          <span style={{ fontWeight: "500" }}>{userName}</span>
        </div>
      </Dropdown>
    </Header>
  );
}