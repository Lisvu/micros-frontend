import { Layout, Menu, Dropdown } from "antd";
import {
  HomeOutlined,
  BookOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { getUser } from "../api/auth";

const { Header } = Layout;

export default function Navbar() {
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
    if (location.pathname === "/dashboard") return "dashboard";
    if (location.pathname === "/courses") return "courses";
    if (location.pathname === "/my-courses") return "my-courses";
    if (location.pathname === "/discover-courses") return "discover-courses";
    if (location.pathname === "/online-learning") return "online-learning";
    return "dashboard";
  };

  const menuItems = [
    {
      key: "dashboard",
      icon: <HomeOutlined />,
      label: "学习首页",
      onClick: () => navigate("/dashboard"),
    },
    {
      key: "online-learning",
      icon: <BookOutlined />,
      label: "在线学习",
      onClick: () => navigate("/online-learning"),
    },
    {
      key: "courses",
      icon: <BookOutlined />,
      label: "课程中心",
      children: [
        {
          key: "my-courses",
          label: "我的课程",
          onClick: () => navigate("/my-courses"),
        },
        {
          key: "discover-courses",
          label: "发现课程",
          onClick: () => navigate("/discover-courses"),
        },
      ],
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
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
        background: "#cee7ff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 40px",
      }}
    >
      {/* 左侧 Logo */}
      <div
        style={{
          color: "black",
          fontSize: "20px",
          fontWeight: "bold",
          cursor: "pointer",
        }}
        onClick={() => navigate("/dashboard")}
      >
        微专业平台
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
        }}
      />

      {/* 右侧用户 */}
      <Dropdown
        menu={{ items: userMenuItems }}
        placement="bottomRight"
        trigger={["click"]}
      >
        <div
          style={{
            color: "black",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <UserOutlined />
          {userName}
        </div>
      </Dropdown>
    </Header>
  );
}