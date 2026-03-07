import {
  Card,
  Empty,
  Button,
  Row,
  Col,
  Input,
  Select,
  Space,
  Tag,
  Divider,
  Progress,
  Spin,
  message,
  Typography
} from "antd";

import {
  BookOutlined,
  UserOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  PlayCircleOutlined,
  SearchOutlined,
  SortAscendingOutlined,
  StarOutlined,
  CalendarOutlined,
  CloudOutlined,
  SunOutlined,
  MoonOutlined,
  HeartOutlined,
  StarFilled
} from "@ant-design/icons";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import {
  getCourses,
  enrollCourse,
  getUserCourses,
  getCourseProgress
} from "../api/course";

const { Title, Text } = Typography;

// 课程封面图片映射 - 使用更可靠的图片来源
const courseCovers = {
  1: "https://picsum.photos/seed/cs1/800/450",
  2: "https://picsum.photos/seed/programming2/800/450",
  3: "https://picsum.photos/seed/software3/800/450",
  4: "https://picsum.photos/seed/app4/800/450",
  5: "https://picsum.photos/seed/ai5/800/450",
};

// 默认封面图片
const defaultCover = "https://picsum.photos/seed/course/800/450";



export default function OnlineLearningPage() {

  const navigate = useNavigate();

  const [allCourses, setAllCourses] = useState([]);
  const [myCourses, setMyCourses] = useState([]);

  const [courseProgress, setCourseProgress] = useState({});

  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(null);



  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const courseRes = await getCourses();
      const userCourseRes = await getUserCourses();

      const courses = courseRes.data;
      const userCourses = userCourseRes.data;

      // 为课程添加封面和难度信息
      const coursesWithInfo = courses.map(course => ({
        ...course,
        cover: courseCovers[course.id] || defaultCover,
        difficulty: Math.floor(Math.random() * 3) + 1, // 模拟难度等级
        rating: (Math.random() * 2 + 3).toFixed(1), // 模拟评分
        studentCount: Math.floor(Math.random() * 1000) + 100, // 模拟学生数
      }));

      setAllCourses(coursesWithInfo);
      setMyCourses(userCourses);

      const progressMap = {};

      await Promise.all(
        userCourses.map(async (course) => {
          try {
            const res = await getCourseProgress(course.id);
            progressMap[course.id] = res.data.progress;
          } catch {
            progressMap[course.id] = 0;
          }
        })
      );

      setCourseProgress(progressMap);

    } catch (err) {
      console.error(err);
      message.error("加载课程失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleEnroll = async (courseId) => {
    try {
      setEnrolling(courseId);
      await enrollCourse(courseId);
      message.success("选课成功！");
      await fetchData();
    } catch (err) {
      message.error("选课失败，请稍后重试");
    } finally {
      setEnrolling(null);
    }
  };

  // 直接使用所有课程，不需要过滤
  const filteredCourses = allCourses;

  if (loading) {
    return (
      <div style={{ 
        textAlign: "center", 
        padding: "80px",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)"
      }}>
        <Spin size="large" tip="加载课程..." />
      </div>
    );
  }

  return (

    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e6f7ff 0%, #b3d9ff 100%)",
        padding: "24px 0"
      }}
    >

      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 24px" }}>

        {/* 页面标题 */}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: "32px",
            padding: "32px 24px",
            background: "white",
            borderRadius: "20px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            position: "relative",
            overflow: "hidden"
          }}
        >
          {/* 装饰元素 */}
          <div style={{ 
            position: "absolute", 
            top: 10, 
            left: 10, 
            width: 60, 
            height: 60, 
            borderRadius: "50%", 
            background: "linear-gradient(135deg, #91d5ff 0%, #40a9ff 100%)",
            opacity: 0.3
          }} />
          <div style={{ 
            position: "absolute", 
            bottom: 10, 
            right: 10, 
            width: 80, 
            height: 80, 
            borderRadius: "50%", 
            background: "linear-gradient(135deg, #91d5ff 0%, #40a9ff 100%)",
            opacity: 0.2
          }} />
          
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
            <div style={{ 
              width: 80, 
              height: 80, 
              borderRadius: "50%", 
              background: "linear-gradient(135deg, #40a9ff 0%, #1890ff 100%)",
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(64, 169, 255, 0.4)"
            }}>
              <BookOutlined style={{ fontSize: 40, color: "white" }} />
            </div>
            <div style={{ textAlign: "center" }}>
              <Title level={2} style={{ 
                color: "#1890ff", 
                fontSize: "32px", 
                margin: 0, 
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                justifyContent: "center"
              }}>
                <StarFilled style={{ color: "#ffd666" }} />
                在线学习
                <StarFilled style={{ color: "#ffd666" }} />
              </Title>
              <Text style={{ color: "#666", fontSize: "16px" }}>
                发现有趣的课程，开启你的学习之旅！
              </Text>
            </div>
          </div>

          <div style={{ display: "flex", gap: 16, marginTop: 16 }}>
            <Button 
              type="primary" 
              size="large"
              onClick={() => {
                document.getElementById('all-courses-section').scrollIntoView({ 
                  behavior: 'smooth' 
                });
              }}
              icon={<CloudOutlined />}
              style={{
                borderRadius: "24px",
                padding: "12px 24px",
                background: "linear-gradient(135deg, #40a9ff 0%, #1890ff 100%)",
                border: "none",
                boxShadow: "0 4px 12px rgba(64, 169, 255, 0.3)",
                fontWeight: "600",
                fontSize: "16px",
                transition: "all 0.3s ease",
                '&:hover': {
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 16px rgba(64, 169, 255, 0.4)"
                }
              }}
            >
              发现课程
            </Button>
            <Button 
              type="default" 
              size="large"
              onClick={() => {
                document.getElementById('my-courses-section').scrollIntoView({ 
                  behavior: 'smooth' 
                });
              }}
              icon={<BookOutlined />}
              style={{
                borderRadius: "24px",
                padding: "12px 24px",
                background: "white",
                border: "2px solid #40a9ff",
                color: "#1890ff",
                fontWeight: "600",
                fontSize: "16px",
                transition: "all 0.3s ease",
                '&:hover': {
                  background: "rgba(64, 169, 255, 0.05)",
                  transform: "translateY(-2px)"
                }
              }}
            >
              我的课程
            </Button>
          </div>
        </div>

        <Card style={{ 
          borderRadius: "20px", 
          border: "none", 
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)", 
          background: "white",
          overflow: "hidden"
        }}>

  

          {/* 全部课程 */}

          <div id="all-courses-section" style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center", 
            marginBottom: 24,
            padding: "0 16px"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ 
                width: 40, 
                height: 40, 
                borderRadius: "50%", 
                background: "linear-gradient(135deg, #91d5ff 0%, #40a9ff 100%)",
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center"
              }}>
                <SunOutlined style={{ fontSize: 20, color: "white" }} />
              </div>
              <h2 style={{ margin: 0, color: "#1890ff", fontSize: 24, fontWeight: "600" }}>全部课程</h2>
            </div>
            <Tag 
              color="#40a9ff" 
              style={{ 
                fontSize: 14, 
                borderRadius: "16px",
                padding: "4px 16px",
                background: "rgba(64, 169, 255, 0.1)",
                border: "1px solid #91d5ff"
              }}
            >
              {filteredCourses.length} 门课程
            </Tag>
          </div>

          <Row gutter={[24, 24]}>
            {filteredCourses.length === 0 ? (
              <Col span={24}>
                <Empty 
                  description="没有找到匹配的课程" 
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              </Col>
            ) : (
              filteredCourses.map((course) => {
                const enrolled = myCourses.some(c => c.id === course.id);
                
                return (
                  <Col xs={24} sm={12} lg={8} key={course.id}>
                    <Card 
                      hoverable 
                      style={{ 
                        borderRadius: 16, 
                        overflow: "hidden",
                        transition: "all 0.3s ease",
                        boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                        background: "white",
                        transform: "translateY(0)",
                        border: "2px solid #f0f9ff",
                        position: "relative"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-5px)";
                        e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.15)";
                        e.currentTarget.style.borderColor = "#91d5ff";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.1)";
                        e.currentTarget.style.borderColor = "#f0f9ff";
                      }}
                      cover={
                        <div style={{ 
                          height: 180, 
                          overflow: "hidden",
                          position: "relative"
                        }}>
                          <img 
                            src={course.cover} 
                            alt={course.title} 
                            style={{ 
                              width: "100%", 
                              height: "100%", 
                              objectFit: "cover",
                              transition: "transform 0.5s ease"
                            }} 
                            onError={(e) => {
                              e.target.src = defaultCover;
                            }}
                          />

                        </div>
                      }
                    >
                      <div style={{ padding: 16 }}>
                        <h3 style={{ 
                          margin: 0, 
                          fontSize: 18, 
                          fontWeight: 600, 
                          color: "#1890ff",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          marginBottom: 8
                        }}>
                          {course.title}
                        </h3>
                        <p style={{ 
                          marginBottom: 16, 
                          color: "#666",
                          height: 48,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          fontSize: 14
                        }}>
                          {course.description}
                        </p>
                        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                          <Button
                            type="primary"
                            onClick={() => navigate(`/majors/${course.id}`)}
                            icon={<BookOutlined />}
                            size="small"
                            style={{ 
                              flex: 1, 
                              borderRadius: 20, 
                              padding: "8px 16px",
                              background: "linear-gradient(135deg, #40a9ff 0%, #1890ff 100%)",
                              border: "none",
                              boxShadow: "0 2px 8px rgba(64, 169, 255, 0.3)",
                              transition: "all 0.3s ease",
                              fontWeight: "500"
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = "linear-gradient(135deg, #1890ff 0%, #096dd9 100%)";
                              e.currentTarget.style.boxShadow = "0 4px 12px rgba(64, 169, 255, 0.4)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = "linear-gradient(135deg, #40a9ff 0%, #1890ff 100%)";
                              e.currentTarget.style.boxShadow = "0 2px 8px rgba(64, 169, 255, 0.3)";
                            }}
                          >
                            查看详情
                          </Button>
                          <Button
                            loading={enrolling === course.id}
                            disabled={enrolled}
                            onClick={() => handleEnroll(course.id)}
                            size="small"
                            style={{ 
                              flex: 1, 
                              borderRadius: 20, 
                              padding: "8px 16px",
                              background: enrolled ? "#f0f0f0" : "white",
                              border: enrolled ? "1px solid #d9d9d9" : "1px solid #40a9ff",
                              color: enrolled ? "#666" : "#1890ff",
                              transition: "all 0.3s ease",
                              fontWeight: "500"
                            }}
                            onMouseEnter={(e) => {
                              if (!enrolled) {
                                e.currentTarget.style.background = "rgba(64, 169, 255, 0.05)";
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!enrolled) {
                                e.currentTarget.style.background = "white";
                              }
                            }}
                          >
                            {enrolled ? "已选" : "立即选课"}
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </Col>
                );
              })
            )}
          </Row>

          <Divider style={{ 
            margin: "48px 0",
            borderColor: "#e6f7ff",
            textAlign: "center"
          }}>
            <div style={{ 
              background: "white", 
              padding: "0 24px",
              color: "#1890ff",
              fontSize: "16px",
              fontWeight: "500"
            }}>
              <CloudOutlined style={{ marginRight: 8 }} />
              我的课程
            </div>
          </Divider>

          {/* 我的课程 */}

          <div id="my-courses-section" style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center", 
            marginBottom: 24,
            padding: "0 16px"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ 
                width: 40, 
                height: 40, 
                borderRadius: "50%", 
                background: "linear-gradient(135deg, #95de64 0%, #52c41a 100%)",
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center"
              }}>
                <MoonOutlined style={{ fontSize: 20, color: "white" }} />
              </div>
              <h2 style={{ margin: 0, color: "#52c41a", fontSize: 24, fontWeight: "600" }}>我的课程</h2>
            </div>
            <Tag 
              color="#52c41a" 
              style={{ 
                fontSize: 14, 
                borderRadius: "16px",
                padding: "4px 16px",
                background: "rgba(82, 196, 26, 0.1)",
                border: "1px solid #b7eb8f"
              }}
            >
              {myCourses.length} 门课程
            </Tag>
          </div>

          {myCourses.length === 0 ? (
            <Empty 
              description="暂未选课" 
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            >
              <Button 
                type="primary"
                icon={<CloudOutlined />}
                style={{
                  borderRadius: "20px",
                  padding: "8px 24px",
                  background: "linear-gradient(135deg, #40a9ff 0%, #1890ff 100%)",
                  border: "none",
                  boxShadow: "0 4px 12px rgba(64, 169, 255, 0.3)"
                }}
              >
                浏览课程
              </Button>
            </Empty>
          ) : (
            <Row gutter={[24, 24]}>
              {myCourses.map((course) => {
                const progress = courseProgress[course.id] || 0;
                const courseInfo = allCourses.find(c => c.id === course.id);
                
                return (
                  <Col xs={24} sm={12} lg={8} key={course.id}>
                    <Card 
                      hoverable 
                      style={{ 
                        borderRadius: 16, 
                        overflow: "hidden",
                        transition: "all 0.3s ease",
                        boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                        background: "white",
                        transform: "translateY(0)",
                        border: "2px solid #f6ffed",
                        position: "relative"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-5px)";
                        e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.15)";
                        e.currentTarget.style.borderColor = "#b7eb8f";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.1)";
                        e.currentTarget.style.borderColor = "#f6ffed";
                      }}
                      cover={
                        <div style={{ 
                          height: 160, 
                          overflow: "hidden",
                          position: "relative"
                        }}>
                          <img 
                            src={courseInfo?.cover || defaultCover} 
                            alt={course.title} 
                            style={{ 
                              width: "100%", 
                              height: "100%", 
                              objectFit: "cover",
                              transition: "transform 0.5s ease"
                            }} 
                            onError={(e) => {
                              e.target.src = defaultCover;
                            }}
                          />

                        </div>
                      }
                    >
                      <div style={{ padding: 16 }}>
                        <h3 style={{ 
                          margin: 0, 
                          fontSize: 18, 
                          fontWeight: 600, 
                          color: "#52c41a",
                          marginBottom: 8,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap"
                        }}>
                          {course.title}
                        </h3>
                        <p style={{ 
                          marginBottom: 16, 
                          color: "#666",
                          height: 40,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          fontSize: 14
                        }}>
                          {course.description}
                        </p>
                        <div style={{ marginBottom: 16 }}>
                          <div style={{ 
                            marginBottom: 8, 
                            fontSize: 14, 
                            color: "#666",
                            fontWeight: "500"
                          }}>
                            学习进度
                          </div>
                          <Progress
                            percent={progress}
                            size="small"
                            strokeColor={{
                              from: '#52c41a',
                              to: '#95de64',
                            }}
                            style={{ borderRadius: 4 }}
                          />
                        </div>
                        <Button
                          type="primary"
                          block
                          icon={<PlayCircleOutlined />}
                          onClick={() => navigate(`/majors/${course.id}`)}
                          size="small"
                          style={{ 
                            borderRadius: 20, 
                            padding: "10px 16px",
                            background: "linear-gradient(135deg, #52c41a 0%, #389e0d 100%)",
                            border: "none",
                            boxShadow: "0 4px 12px rgba(82, 196, 26, 0.3)",
                            transition: "all 0.3s ease",
                            fontWeight: "600",
                            fontSize: "14px"
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "linear-gradient(135deg, #389e0d 0%, #237804 100%)";
                            e.currentTarget.style.boxShadow = "0 6px 16px rgba(82, 196, 26, 0.4)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "linear-gradient(135deg, #52c41a 0%, #389e0d 100%)";
                            e.currentTarget.style.boxShadow = "0 4px 12px rgba(82, 196, 26, 0.3)";
                          }}
                        >
                          继续学习
                        </Button>
                      </div>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          )}

        </Card>

      </div>

    </div>

  );
}