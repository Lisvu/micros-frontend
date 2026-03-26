import { useState, useEffect } from "react";
import { Card, Typography, Table, Spin, Tag, Progress, Space, message, Button, Modal } from "antd";
import { TrophyOutlined, BookOutlined, FileTextOutlined, CheckCircleOutlined, CloseCircleOutlined, EyeOutlined, StarOutlined, HeartOutlined, SmileOutlined, GiftOutlined } from "@ant-design/icons";
import request from '../api/request';

const { Title, Paragraph } = Typography;

export default function GradesPage() {
  const [loading, setLoading] = useState(true);
  const [courseScores, setCourseScores] = useState([]);
  const [moduleScores, setModuleScores] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [moduleModalVisible, setModuleModalVisible] = useState(false);
  
  // 蓝色系颜色方案
  const colors = {
    primary: '#ff4a18',
    secondary: '#40a9ff',
    accent: '#69c0ff',
    success: '#0ac953',
    warning: '#fac423',
    background: '#f0f8ff',
    card: '#ffffff',
    text: '#2d3436',
    textLight: '#636e72'
  };

  useEffect(() => {
    fetchCourseScores();
  }, []);

  const fetchCourseScores = async () => {
    console.log('fetchCourseScores 函数开始执行');
    try {
      setLoading(true);
      console.log('设置 loading 为 true');
      console.log('开始获取课程成绩...');
      
      // 使用新的 API 端点获取用户课程成绩
      console.log('开始发送 API 请求到 /course/scores');
      const courseScoresResponse = await request.get('/course/scores');
      console.log('API 请求成功，响应数据:', courseScoresResponse);
      
      const courseScores = courseScoresResponse.data;
      console.log('课程成绩:', courseScores);
      console.log('课程成绩类型:', typeof courseScores);
      console.log('课程成绩是否为数组:', Array.isArray(courseScores));

      // 确保 courseScores 是一个数组
      let finalCourseScores = [];
      if (Array.isArray(courseScores)) {
        finalCourseScores = courseScores;
      } else if (typeof courseScores === 'object' && courseScores !== null) {
        // 将对象转换为数组
        finalCourseScores = Object.values(courseScores);
      }
      console.log('最终课程成绩:', finalCourseScores);
      setCourseScores(finalCourseScores);
    } catch (error) {
      console.log('进入错误处理');
      message.error('获取课程成绩失败');
      console.error('获取课程成绩失败:', error);
      console.error('错误状态:', error.response?.status);
      console.error('错误数据:', error.response?.data);
      console.error('错误消息:', error.message);
      setCourseScores([]);
    } finally {
      console.log('进入 finally 块');
      setLoading(false);
      console.log('设置 loading 为 false');
    }
  };
  
  const fetchModuleScores = async (courseId) => {
    try {
      setLoading(true);
      console.log('开始获取模块成绩...');
      
      // 使用新的 API 端点获取课程模块成绩
      const moduleScoresResponse = await request.get(`/course/${courseId}/module/scores`);
      const moduleScores = moduleScoresResponse.data;
      console.log('模块成绩:', moduleScores);

      // 确保 moduleScores 是一个数组
      setModuleScores(Array.isArray(moduleScores) ? moduleScores : []);
    } catch (error) {
      message.error('获取模块成绩失败');
      console.error('获取模块成绩失败:', error);
      console.error('错误状态:', error.response?.status);
      console.error('错误数据:', error.response?.data);
      console.error('错误消息:', error.message);
      console.error('获取模块成绩失败:', error);
      setModuleScores([]);
    } finally {
      setLoading(false);
    }
  };
  
  const handleViewModules = (course) => {
    setSelectedCourse(course);
    fetchModuleScores(course.course_id);
    setModuleModalVisible(true);
  };

  if (loading) {
    return (
      <div style={{ 
        padding: "60px 20px", 
        textAlign: "center",
        background: colors.background,
        minHeight: "100vh"
      }}>
        <div style={{ 
          display: "inline-block",
          padding: "30px",
          borderRadius: "20px",
          background: colors.card,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)"
        }}>
          <Spin 
            size="large" 
            tip="加载成绩列表..." 
            tipStyle={{ 
              fontSize: "16px", 
              color: colors.text,
              fontWeight: "500"
            }} 
          />
        </div>
      </div>
    );
  }

  const courseColumns = [
    {
      title: "课程",
      dataIndex: "course_title",
      key: "course_title",
      render: (text) => (
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <BookOutlined style={{ color: colors.primary, fontSize: "20px" }} />
          <span style={{ fontSize: "16px", fontWeight: "500", color: colors.text }}>{text}</span>
        </div>
      )
    },
    {
      title: "课程成绩",
      dataIndex: "course_score",
      key: "course_score",
      width: 120,
      align: "left",
      render: (course_score) => {
        const score = parseFloat(course_score);
        let scoreColor = colors.primary;
        if (score >= 90) scoreColor = colors.success;
        else if (score >= 70) scoreColor = colors.accent;
        else if (score >= 60) scoreColor = colors.warning;
        
        return (
          <div style={{ 
            textAlign: "left",
            padding: "8px 0"
          }}>
            <div style={{ 
              fontSize: "16px", 
              fontWeight: "600", 
              color: scoreColor
            }}>
              {score} (50%)
            </div>
          </div>
        );
      }
    },
    {
      title: "考试成绩",
      dataIndex: "exam_score",
      key: "exam_score",
      width: 120,
      align: "left",
      render: (exam_score) => {
        const score = parseFloat(exam_score);
        let scoreColor = colors.primary;
        if (score >= 90) scoreColor = colors.success;
        else if (score >= 70) scoreColor = colors.accent;
        else if (score >= 60) scoreColor = colors.warning;
        
        return (
          <div style={{ 
            textAlign: "left",
            padding: "8px 0"
          }}>
            <div style={{ 
              fontSize: "16px", 
              fontWeight: "600", 
              color: scoreColor
            }}>
              {score} (50%)
            </div>
          </div>
        );
      }
    },
    {
      title: "最终成绩",
      dataIndex: "final_score",
      key: "final_score",
      width: 150,
      align: "left",
      render: (final_score) => {
        const score = parseFloat(final_score);
        let scoreColor = colors.primary;
        if (score >= 90) scoreColor = colors.success;
        else if (score >= 70) scoreColor = colors.accent;
        else if (score >= 60) scoreColor = colors.warning;
        
        return (
          <div style={{ 
            textAlign: "left",
            padding: "8px 0"
          }}>
            <div style={{ 
              fontSize: "20px", 
              fontWeight: "700", 
              color: scoreColor,
              display: "inline-flex",
              alignItems: "center",
              gap: "8px"
            }}>
              {score}
              {score >= 90 && <TrophyOutlined style={{ fontSize: "18px" }} />}
            </div>
          </div>
        );
      }
    },
    {
      title: "更新时间",
      dataIndex: "updated_at",
      key: "updated_at",
      render: (updated_at) => {
        if (!updated_at) return '-';
        return (
          <div style={{ color: colors.textLight, fontSize: "14px" }}>
            {new Date(updated_at).toLocaleString('zh-CN', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        );
      }
    },
    {
      title: "操作",
      key: "action",
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => handleViewModules(record)}
          style={{
            borderRadius: "20px",
            background: colors.secondary,
            border: "none",
            boxShadow: "0 4px 12px rgba(107, 129, 255, 0.3)",
            padding: "8px 16px",
            fontSize: "14px",
            fontWeight: "500",
            transition: "all 0.3s ease"
          }}
          hoverStyle={{
            background: "#ff5252",
            boxShadow: "0 6px 16px rgba(255, 107, 107, 0.4)"
          }}
        >
          查看模块成绩
        </Button>
      )
    }
  ];
  
  const moduleColumns = [
    {
      title: "模块",
      dataIndex: "module_title",
      key: "module_title",
      render: (text) => (
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <FileTextOutlined style={{ color: colors.secondary, fontSize: "20px" }} />
          <span style={{ fontSize: "16px", fontWeight: "500", color: colors.text }}>{text}</span>
        </div>
      )
    },
    {
      title: "模块最高成绩",
      dataIndex: "highest_score",
      key: "highest_score",
      width: 150,
      align: "left",
      render: (highest_score) => {
        const score = parseFloat(highest_score);
        let scoreColor = colors.primary;
        if (score >= 90) scoreColor = colors.success;
        else if (score >= 70) scoreColor = colors.accent;
        else if (score >= 60) scoreColor = colors.warning;
        
        return (
          <div style={{ 
            textAlign: "left",
            padding: "8px 0"
          }}>
            <div style={{ 
              fontSize: "20px", 
              fontWeight: "700", 
              color: scoreColor,
              display: "inline-flex",
              alignItems: "center",
              gap: "8px"
            }}>
              {score}
              {score >= 90 && <StarOutlined style={{ fontSize: "18px" }} />}
            </div>
          </div>
        );
      }
    },
    {
      title: "更新时间",
      dataIndex: "updated_at",
      key: "updated_at",
      render: (updated_at) => {
        if (!updated_at) return '-';
        return (
          <div style={{ color: colors.textLight, fontSize: "14px" }}>
            {new Date(updated_at).toLocaleString('zh-CN', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        );
      }
    }
  ];

  return (
    <div style={{ 
      padding: "24px", 
      minHeight: "100vh",
      background: colors.background,
      backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\"100\" height=\"100\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cpath d=\"M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\" fill=\"%23ff6b6b\" fill-opacity=\"0.05\" fill-rule=\"evenodd\"/%3E%3C/svg%3E")' 
    }}>
      {/* 顶部卡片 */}
      <Card
        style={{
          borderRadius: "24px",
          border: "none",
          boxShadow: "0 12px 32px rgba(0, 0, 0, 0.15)",
          marginBottom: "32px",
          overflow: "hidden",
          background: `linear-gradient(135deg, ${colors.card} 0%, ${colors.accent} 100%)`,
          position: "relative"
        }}
      >
  
        
        <div style={{ padding: "40px", position: "relative", zIndex: 1 }}>
          <Title level={1} style={{ 
            margin: "0 0 24px 0", 
            color: colors.text, 
            display: "flex", 
            alignItems: "center", 
            gap: "16px",
            fontSize: "32px",
            fontWeight: "700"
          }}>
            <TrophyOutlined style={{ 
              fontSize: "40px", 
              color: colors.primary,
              filter: "drop-shadow(0 2px 4px rgba(255, 107, 107, 0.3))"
            }} />
            成绩中心
          </Title>
          <Paragraph style={{ 
            fontSize: "16px", 
            color: colors.textLight, 
            lineHeight: "1.6",
            marginBottom: "24px"
          }}>
            查看您的课程成绩，了解您的学习进度和水平。未完成的课程成绩将不会显示。
          </Paragraph>

        </div>
      </Card>

      {/* 课程成绩卡片 */}
      <Card
        style={{
          borderRadius: "24px",
          border: "none",
          boxShadow: "0 12px 32px rgba(0, 0, 0, 0.15)",
          background: colors.card,
          position: "relative",
          overflow: "hidden"
        }}
      >
        {/* 装饰元素 */}
        <div style={{
          position: "absolute",
          top: "0",
          left: "0",
          right: "0",
          height: "8px",
          background: `linear-gradient(90deg, ${colors.secondary}, ${colors.secondary}, ${colors.accent})`
        }} />
        
        <div style={{ padding: "32px" }}>
          <Title level={2} style={{ 
            margin: "0 0 32px 0", 
            color: colors.text,
            display: "flex",
            alignItems: "center",
            gap: "12px"
          }}>
            <BookOutlined style={{ color: colors.primary }} />
            课程总分
          </Title>
          
          <Table
            columns={courseColumns}
            dataSource={courseScores}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            style={{ borderRadius: "16px", overflow: "hidden" }}
            rowStyle={{
              borderBottom: "1px solid #f0f0f0",
              '&:hover': {
                background: "#f9f9f9",
                transform: "translateY(-2px)",
                transition: "all 0.3s ease"
              }
            }}
            headerStyle={{
              background: colors.background,
              borderRadius: "16px 16px 0 0",
              padding: "16px 24px"
            }}
            bodyStyle={{
              padding: "0"
            }}
          />
          
          {/* 模块成绩模态框 */}
          <Modal
            title={`${selectedCourse?.course_title} - 模块成绩`}
            open={moduleModalVisible}
            onCancel={() => setModuleModalVisible(false)}
            width={800}
            style={{
              borderRadius: "24px",
              overflow: "hidden"
            }}
            footer={[
              <Button 
                key="close" 
                type="primary" 
                onClick={() => setModuleModalVisible(false)}
                style={{
                  borderRadius: "20px",
                  background: colors.primary,
                  border: "none",
                  boxShadow: "0 4px 12px rgba(255, 107, 107, 0.3)",
                  padding: "8px 24px",
                  fontSize: "14px",
                  fontWeight: "500"
                }}
              >
                关闭
              </Button>
            ]}
            modalRender={(children) => (
              <div style={{
                borderRadius: "24px",
                overflow: "hidden",
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)"
              }}>
                {children}
              </div>
            )}
            headerStyle={{
              background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
              color: "white",
              padding: "24px"
            }}
            bodyStyle={{
              padding: "32px"
            }}
          >
            <Table
              columns={moduleColumns}
              dataSource={moduleScores}
              rowKey="id"
              pagination={{ pageSize: 10 }}
              style={{ borderRadius: "16px", overflow: "hidden" }}
              rowStyle={{
                borderBottom: "1px solid #f0f0f0",
                '&:hover': {
                  background: "#f9f9f9",
                  transform: "translateY(-2px)",
                  transition: "all 0.3s ease"
                }
              }}
              headerStyle={{
                background: colors.background,
                borderRadius: "16px 16px 0 0",
                padding: "16px 24px"
              }}
              bodyStyle={{
                padding: "0"
              }}
            />
          </Modal>
        </div>
      </Card>
    </div>
  );
}