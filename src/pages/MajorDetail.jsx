import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { Card, Button, Typography, Image, Spin, Alert, Row, Col, Progress, Tag, Divider, Breadcrumb, Statistic, message } from "antd";
import { BookOutlined, PlayCircleOutlined, ClockCircleOutlined, UserOutlined, TrophyOutlined, FireOutlined, ArrowLeftOutlined, CloudOutlined, SunOutlined, StarFilled, HeartOutlined, SmileOutlined, MessageOutlined } from "@ant-design/icons";
import { getCourseDetail, getCourseProgress, getModuleProgress, getUserCourses } from "../api/course";

// 课程封面图片映射 - 使用与 OnlineLearningPage 相同的图片来源
const courseCovers = {
  1: "https://picsum.photos/seed/cs1/800/450",
  2: "https://picsum.photos/seed/programming2/800/450",
  3: "https://picsum.photos/seed/software3/800/450",
  4: "https://picsum.photos/seed/app4/800/450",
  5: "https://picsum.photos/seed/ai5/800/450",
};

// 默认封面图片
const defaultCover = "https://picsum.photos/seed/course/800/450";

const { Title, Paragraph, Text } = Typography;


export default function MajorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
const [completedModules, setCompletedModules] = useState(0);
const [moduleProgresses, setModuleProgresses] = useState({}); // 存储每个模块的进度
const [isEnrolled, setIsEnrolled] = useState(false); // 用户是否已选课


  useEffect(() => {
    const fetchCourseDetail = async () => {
      try {
        setLoading(true);
        const response = await getCourseDetail(id);
        // 为课程添加封面图片
        const courseWithCover = {
          ...response.data.course,
          cover: courseCovers[response.data.course.id] || defaultCover
        };
        setCourse(courseWithCover);
      } catch (err) {
        setError(err.response?.data?.message || '获取课程详情失败');
      } finally {
        setLoading(false);
      }
    };

    const fetchProgress = async () => {
  try {
    const response = await getCourseProgress(id);

    setProgress(response.data.progress);
    setCompletedModules(response.data.completed_modules || 0);

  } catch (err) {
    setProgress(0);
    setCompletedModules(0);
  }
};

    // 检查用户是否已选课
    const checkEnrollment = async () => {
      try {
        const response = await getUserCourses();
        const userCourses = response.data;
        const enrolled = userCourses.some(course => course.id === parseInt(id));
        setIsEnrolled(enrolled);
      } catch (err) {
        setIsEnrolled(false);
      }
    };

    if (id) {
      fetchCourseDetail();
      fetchProgress();
      checkEnrollment();
    }
  }, [id]);

  // 当课程数据加载完成后，获取每个模块的进度（仅当已选课时）
  useEffect(() => {
    if (isEnrolled && course && course.modules) {
      const fetchModuleProgresses = async () => {
        try {
          const progresses = {};
          for (const module of course.modules) {
            try {
              const response = await getModuleProgress(id, module.id);
              progresses[module.id] = response.data.progress;
            } catch (err) {
              progresses[module.id] = 0;
            }
          }
          setModuleProgresses(progresses);
        } catch (err) {
          console.error('获取模块进度失败:', err);
        }
      };
      fetchModuleProgresses();
    }
  }, [course, id, isEnrolled]);



  if (loading) {
    return (
      <div style={{ padding: "60px 20px", textAlign: 'center', minHeight: "100vh" }}>
        <Spin size="large" tip="📚 加载课程详情..." />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
        <Card
          style={{
            background: "#fee2e2",
            border: "1px solid #fecaca",
            borderRadius: "12px",
            textAlign: "center",
            padding: "40px 20px",
          }}
        >
          <Alert message="错误" description={error} type="error" showIcon />
        </Card>
      </div>
    );
  }

  if (!course) {
    return (
      <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
        <Card
          style={{
            borderRadius: "16px",
            textAlign: "center",
            padding: "60px 20px",
            border: "2px dashed #e5e7eb",
            background: "#fafbfc",
          }}
        >
          <div style={{ fontSize: "48px", marginBottom: "16px", opacity: 0.5 }}>
            📚
          </div>
          <h3 style={{ color: "#6b7280", marginBottom: "8px" }}>
            课程不存在
          </h3>
          <p style={{ color: "#9ca3af" }}>
            该课程可能已被删除或您没有访问权限
          </p>
        </Card>
      </div>
    );
  }

  const moduleCount = course.modules?.length || 0;
  const progressPercent = progress;

  return (
    <div style={{ padding: "24px", maxWidth: "1400px", margin: "0 auto", minHeight: "100vh", background: 'linear-gradient(135deg, #e6f7ff 0%, #b3d9ff 100%)' }}>
      {/* 导航面包屑 */}
      <div style={{ marginBottom: "24px", display: "flex", alignItems: "center", gap: "12px" }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          style={{
            borderRadius: "16px",
            padding: "8px 16px",
            height: "auto",
            background: "white",
            border: "2px solid #91d5ff",
            boxShadow: "0 2px 8px rgba(64, 169, 255, 0.2)",
            transition: "all 0.3s ease",
            '&:hover': {
              transform: "translateY(-2px)",
              boxShadow: "0 4px 12px rgba(64, 169, 255, 0.3)"
            }
          }}
        >
          返回
        </Button>

        <Breadcrumb>
          <Breadcrumb.Item onClick={() => navigate("/my-courses")} style={{ fontSize: "14px", color: "#666" }}>
            <BookOutlined style={{ marginRight: "4px" }} /> 我的课程
          </Breadcrumb.Item>
          <Breadcrumb.Item style={{ fontSize: "14px", color: "#1890ff", fontWeight: "500" }}>
            {course.title}
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>

      {/* 课程标题区域 */}
      <Card
        style={{
          borderRadius: "20px",
          border: "none",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
          marginBottom: "32px",
          overflow: "hidden",
          position: "relative",
          background: "white",
          border: "2px solid #f0f9ff"
        }}
      >
        {/* 装饰元素 */}
        <div style={{ 
          position: "absolute", 
          top: 20, 
          right: 20, 
          width: 80, 
          height: 80, 
          borderRadius: "50%", 
          background: "linear-gradient(135deg, #91d5ff 0%, #40a9ff 100%)",
          opacity: 0.2
        }} />
        <div style={{ 
          position: "absolute", 
          bottom: 20, 
          left: 20, 
          width: 100, 
          height: 100, 
          borderRadius: "50%", 
          background: "linear-gradient(135deg, #91d5ff 0%, #40a9ff 100%)",
          opacity: 0.1
        }} />
        <Row gutter={[32, 24]} align="middle">
          <Col xs={24} lg={8}>
            <div style={{ position: "relative" }}>
              {course.cover ? (
                <div style={{
                  borderRadius: "16px",
                  overflow: "hidden",
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
                  border: "4px solid white",
                  transition: "all 0.3s ease",
                  transform: "rotate(-1deg)"
                }}>
                  <Image
                    src={course.cover}
                    alt={course.title}
                    style={{
                      width: '100%',
                      height: '240px',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                    placeholder={<Spin />}
                    onError={(e) => {
                      e.target.src = defaultCover;
                    }}
                  />
                </div>
              ) : (
                <div style={{
                  width: '100%',
                  height: '240px',
                  background: "linear-gradient(135deg, #91d5ff 0%, #40a9ff 100%)",
                  borderRadius: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
                  border: "4px solid white"
                }}>
                  <BookOutlined style={{ fontSize: "64px", color: "white" }} />
                </div>
              )}

              {/* 课程状态标签 */}
              <div style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)",
                color: "white",
                padding: "8px 16px",
                borderRadius: "20px",
                fontSize: "14px",
                fontWeight: 600,
                boxShadow: "0 4px 12px rgba(255, 107, 107, 0.3)",
                display: "flex",
                alignItems: "center",
                gap: "6px"
              }}>
                <SmileOutlined style={{ fontSize: "14px" }} />
                进行中
              </div>
            </div>
          </Col>

          <Col xs={24} lg={16}>
            <div style={{ padding: "0 16px" }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "20px",
              }}>
                <Tag
                  color="blue"
                  style={{
                    borderRadius: "16px",
                    padding: "6px 16px",
                    fontWeight: 500,
                    fontSize: "14px",
                    background: "rgba(64, 169, 255, 0.1)",
                    border: "2px solid #91d5ff"
                  }}
                >
                  🎓 专业课程
                </Tag>
                <Tag
                  color="green"
                  style={{
                    borderRadius: "16px",
                    padding: "6px 16px",
                    fontWeight: 500,
                    fontSize: "14px",
                    background: "rgba(82, 196, 26, 0.1)",
                    border: "2px solid #b7eb8f"
                  }}
                >
                  📚 学习中
                </Tag>
              </div>

              <Title level={1} style={{
                margin: "0 0 16px 0",
                fontSize: "32px",
                fontWeight: 700,
                color: "#1890ff",
                lineHeight: "1.2",
                display: "flex",
                alignItems: "center",
                gap: "12px"
              }}>
                <StarFilled style={{ color: "#ffd666" }} />
                {course.title}
                <StarFilled style={{ color: "#ffd666" }} />
              </Title>

              {course.description && (
                <Paragraph style={{
                  fontSize: "16px",
                  color: "#666",
                  lineHeight: "1.6",
                  marginBottom: "24px",
                  background: "#f9f9f9",
                  padding: "16px",
                  borderRadius: "12px",
                  border: "1px solid #e6f7ff"
                }}>
                  {course.description}
                </Paragraph>
              )}

              {/* 课程统计信息 */}
              <Row gutter={[24, 16]} style={{ marginBottom: "24px" }}>
                <Col xs={12} sm={6}>
                  <div style={{
                    textAlign: "center",
                    padding: "20px",
                    background: "linear-gradient(135deg, #f0f9ff 0%, #e6f7ff 100%)",
                    borderRadius: "16px",
                    border: "2px solid #91d5ff",
                    boxShadow: "0 4px 12px rgba(64, 169, 255, 0.1)",
                    transition: "all 0.3s ease",
                    '&:hover': {
                      transform: "translateY(-4px)",
                      boxShadow: "0 8px 20px rgba(64, 169, 255, 0.2)"
                    }
                  }}>
                    <div style={{
                      fontSize: "28px",
                      fontWeight: 700,
                      color: "#1890ff",
                      marginBottom: "8px",
                    }}>
                      {moduleCount}
                    </div>
                    <div style={{ fontSize: "14px", color: "#666", fontWeight: "500" }}>学习模块</div>
                  </div>
                </Col>
                {isEnrolled && (
                  <Col xs={12} sm={6}>
                    <div style={{
                      textAlign: "center",
                      padding: "20px",
                      background: "linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%)",
                      borderRadius: "16px",
                      border: "2px solid #b7eb8f",
                      boxShadow: "0 4px 12px rgba(82, 196, 26, 0.1)",
                      transition: "all 0.3s ease",
                      '&:hover': {
                        transform: "translateY(-4px)",
                        boxShadow: "0 8px 20px rgba(82, 196, 26, 0.2)"
                      }
                    }}>
                      <div style={{
                        fontSize: "28px",
                        fontWeight: 700,
                        color: "#52c41a",
                        marginBottom: "8px",
                      }}>
                        {progressPercent}%
                      </div>
                      <div style={{ fontSize: "14px", color: "#666", fontWeight: "500" }}>完成进度</div>
                    </div>
                  </Col>
                )}
                
                <Col xs={12} sm={isEnrolled ? 6 : 12}>
                  <div style={{
                    textAlign: "center",
                    padding: "20px",
                    background: "linear-gradient(135deg, #f9f0ff 0%, #efdbff 100%)",
                    borderRadius: "16px",
                    border: "2px solid #d3adf7",
                    boxShadow: "0 4px 12px rgba(139, 92, 246, 0.1)",
                    transition: "all 0.3s ease",
                    '&:hover': {
                      transform: "translateY(-4px)",
                      boxShadow: "0 8px 20px rgba(139, 92, 246, 0.2)"
                    }
                  }}>
                    <div style={{
                      fontSize: "28px",
                      fontWeight: 700,
                      color: "#8b5cf6",
                      marginBottom: "8px",
                    }}>
                      初级
                    </div>
                    <div style={{ fontSize: "14px", color: "#666", fontWeight: "500" }}>难度等级</div>
                  </div>
                </Col>
              </Row>

              {/* 学习进度条 - 仅当已选课时显示 */}
              {isEnrolled && (
                <div style={{ marginBottom: "24px", background: "#f9f9f9", padding: "20px", borderRadius: "16px", border: "1px solid #e6f7ff" }}>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "12px",
                  }}>
                    <span style={{ fontSize: "16px", fontWeight: 600, color: "#1890ff", display: "flex", alignItems: "center", gap: "8px" }}>
                      <SunOutlined /> 学习进度
                    </span>
                    <span style={{ fontSize: "14px", color: "#666", fontWeight: "500" }}>
                      {completedModules} / {moduleCount} 个模块
                    </span>
                  </div>
                  <Progress
                    percent={progressPercent}
                    size="small"
                    strokeColor={{ from: '#40a9ff', to: '#1890ff' }}
                    trailColor="#e6f7ff"
                    showInfo={false}
                    style={{ borderRadius: "8px" }}
                  />
                </div>
              )}


            </div>
          </Col>
        </Row>
      </Card>

      {/* 模块列表 - 仅当已选课时显示 */}
      {isEnrolled ? (
        <>
          <div style={{ marginBottom: "24px" }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "24px",
              padding: "16px 20px",
              background: "white",
              borderRadius: "16px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              border: "2px solid #f0f9ff"
            }}>
              <h2 style={{
                margin: "0",
                fontSize: "24px",
                fontWeight: 700,
                color: "#1890ff",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}>
                <BookOutlined style={{ fontSize: "24px" }} />
                课程模块
                <Tag 
                  color="blue" 
                  style={{ 
                    borderRadius: "16px", 
                    fontWeight: 500,
                    padding: "4px 16px",
                    background: "rgba(64, 169, 255, 0.1)",
                    border: "1px solid #91d5ff"
                  }}
                >
                  {moduleCount} 个模块
                </Tag>
              </h2>
            </div>

            {course.modules && course.modules.length > 0 ? (
              <Row gutter={[24, 24]}>
                {course.modules.map((module, index) => {
                  // 获取当前模块的进度
                  const moduleProgress = moduleProgresses[module.id] || 0;
                  
                  // 模块进度判断逻辑：
                  // - 进度为100%：已完成
                  // - 进度不为0：进行中
                  // - 进度为0：未开始
                  const isCompleted = moduleProgress === 100;
                  const isCurrent = moduleProgress > 0;

                  return (
                    <Col xs={24} sm={12} lg={8} key={module.id}>
                      <Card
                        hoverable
                        style={{
                          borderRadius: "20px",
                          border: "none",
                          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          height: "100%",
                          position: "relative",
                          overflow: "hidden",
                          border: isCompleted ? "3px solid #10b981" : isCurrent ? "3px solid #3b82f6" : "3px solid #f0f9ff",
                          background: "white"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.boxShadow = "0 20px 25px rgba(0, 0, 0, 0.15)";
                          e.currentTarget.style.transform = "translateY(-8px)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = "0 4px 16px rgba(0, 0, 0, 0.1)";
                          e.currentTarget.style.transform = "translateY(0)";
                        }}
                        onClick={() => navigate(`/course/${id}/module/${module.id}`)}
                      >
                        {/* 模块状态指示器 */}
                        <div style={{
                          position: "absolute",
                          top: "16px",
                          right: "16px",
                          zIndex: 2,
                        }}>
                          <div style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            background: isCompleted
                              ? "linear-gradient(135deg, #10b981, #059669)"
                              : isCurrent
                              ? "linear-gradient(135deg, #3b82f6, #2563eb)"
                              : "linear-gradient(135deg, #f3f4f6, #e5e7eb)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontSize: "18px",
                            fontWeight: 600,
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
                          }}>
                            {isCompleted ? "✓" : index + 1}
                          </div>
                        </div>

                        <div style={{ padding: "24px 20px 20px 20px" }}>
                          <h3 style={{
                            margin: "0 0 16px 0",
                            fontSize: "18px",
                            fontWeight: 700,
                            color: isCompleted ? "#10b981" : isCurrent ? "#3b82f6" : "#1f2937",
                            lineHeight: "1.4",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px"
                          }}>
                            {isCompleted ? <HeartOutlined style={{ color: "#10b981" }} /> : null}
                            {module.title}
                          </h3>

                          {module.description && (
                            <p style={{
                              margin: "0 0 20px 0",
                              fontSize: "14px",
                              color: "#666",
                              lineHeight: "1.5",
                              display: "-webkit-box",
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              background: "#f9f9f9",
                              padding: "12px",
                              borderRadius: "8px",
                              border: "1px solid #f0f0f0"
                            }}>
                              {module.description}
                            </p>
                          )}

                          {/* 模块信息 */}
                          <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "8px",
                          }}>
                            <div style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                              fontSize: "14px",
                              color: "#666",
                              fontWeight: "500"
                            }}>
                              <ClockCircleOutlined style={{ color: "#999" }} />
                              <span>预计 30 分钟</span>
                            </div>
                            <Tag
                              color={isCompleted ? "success" : isCurrent ? "processing" : "default"}
                              size="small"
                              style={{ 
                                borderRadius: "16px",
                                padding: "4px 12px",
                                fontWeight: "500"
                              }}
                            >
                              {isCompleted ? "已完成" : isCurrent ? "进行中" : "未开始"}
                            </Tag>
                          </div>
                          
                          {/* 模块进度条 */}
                          <Progress
                            percent={moduleProgress}
                            size="small"
                            strokeColor={isCompleted ? "#10b981" : isCurrent ? "#3b82f6" : "#e5e7eb"}
                            trailColor="#f0f0f0"
                            showInfo={false}
                            style={{ borderRadius: "4px" }}
                          />
                        </div>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            ) : (
              <Card
                style={{
                  borderRadius: "16px",
                  textAlign: "center",
                  padding: "60px 20px",
                  border: "2px dashed #e5e7eb",
                  background: "#fafbfc",
                }}
              >
                <div style={{ fontSize: "48px", marginBottom: "16px", opacity: 0.5 }}>
                  📚
                </div>
                <h3 style={{ color: "#6b7280", marginBottom: "8px" }}>
                  暂无学习模块
                </h3>
                <p style={{ color: "#9ca3af" }}>
                  该课程正在准备学习内容，请稍后再来查看
                </p>
              </Card>
            )}
          </div>

          {/* 讨论区入口 */}
          <div style={{ marginBottom: "24px" }}>
            <Card
              style={{
                borderRadius: "20px",
                border: "none",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
                overflow: "hidden",
                position: "relative",
                background: "white",
                border: "2px solid #f0f9ff"
              }}
            >
              <div style={{
                padding: "32px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center"
              }}>
                <div style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "20px",
                  boxShadow: "0 4px 16px rgba(139, 92, 246, 0.3)"
                }}>
                  <MessageOutlined style={{ fontSize: "40px", color: "white" }} />
                </div>
                <h3 style={{
                  margin: "0 0 12px 0",
                  fontSize: "24px",
                  fontWeight: 700,
                  color: "#1890ff"
                }}>
                  课程讨论区
                </h3>
                <p style={{
                  margin: "0 0 24px 0",
                  fontSize: "16px",
                  color: "#666",
                  maxWidth: "400px"
                }}>
                  加入课程讨论，与同学交流学习心得，解决学习中遇到的问题
                </p>
                <Button
                  type="primary"
                  size="large"
                  onClick={() => navigate(`/course/${id}/discussion`)}
                  style={{
                    borderRadius: "24px",
                    padding: "12px 32px",
                    background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(139, 92, 246, 0.3)",
                    fontWeight: "600",
                    fontSize: "16px",
                    transition: "all 0.3s ease",
                    '&:hover': {
                      transform: "translateY(-2px)",
                      boxShadow: "0 6px 16px rgba(139, 92, 246, 0.4)"
                    }
                  }}
                >
                  进入讨论区
                </Button>
              </div>
            </Card>
          </div>
        </>
      ) : (
        <Card
          style={{
            borderRadius: "20px",
            textAlign: "center",
            padding: "60px 20px",
            border: "3px dashed #91d5ff",
            background: "linear-gradient(135deg, #f0f9ff 0%, #e6f7ff 100%)",
            marginBottom: "24px",
            boxShadow: "0 4px 16px rgba(64, 169, 255, 0.1)"
          }}
        >
          <div style={{ fontSize: "64px", marginBottom: "24px", opacity: 0.8 }}>
            📚✨
          </div>
          <h3 style={{ color: "#1890ff", marginBottom: "12px", fontSize: "24px", fontWeight: "600" }}>
            开始你的学习之旅
          </h3>
          <p style={{ color: "#666", marginBottom: "32px", fontSize: "16px" }}>
            你还没有选择这门课程，选课之后即可查看完整的课程内容
          </p>
          <Button
            type="primary"
            size="large"
            onClick={() => navigate("/online-learning")}
            icon={<CloudOutlined />}
            style={{
              borderRadius: "24px",
              height: "48px",
              fontSize: "16px",
              fontWeight: 600,
              background: "linear-gradient(135deg, #40a9ff 0%, #1890ff 100%)",
              border: "none",
              padding: "0 32px",
              boxShadow: "0 4px 12px rgba(64, 169, 255, 0.3)",
              transition: "all 0.3s ease",
              '&:hover': {
                transform: "translateY(-2px)",
                boxShadow: "0 6px 16px rgba(64, 169, 255, 0.4)"
              }
            }}
          >
            立即选课
          </Button>
        </Card>
      )}


    </div>
  );
}