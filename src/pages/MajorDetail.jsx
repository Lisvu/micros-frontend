import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, Button, Typography, Image, Spin, Alert, Row, Col, Progress, Tag, Divider, Breadcrumb, Statistic } from "antd";
import { BookOutlined, PlayCircleOutlined, ClockCircleOutlined, UserOutlined, TrophyOutlined, FireOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { getCourseDetail } from "../api/course";

const { Title, Paragraph } = Typography;

export default function MajorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourseDetail = async () => {
      try {
        setLoading(true);
        const response = await getCourseDetail(id);
        setCourse(response.data.course);
      } catch (err) {
        setError(err.response?.data?.message || '获取课程详情失败');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCourseDetail();
    }
  }, [id]);

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
  const completedModules = 0; // 这里可以根据实际数据计算
  const progressPercent = moduleCount > 0 ? Math.round((completedModules / moduleCount) * 100) : 0;

  return (
    <div style={{ padding: "24px", maxWidth: "1400px", margin: "0 auto", minHeight: "100vh" }}>
      {/* 导航面包屑 */}
      <div style={{ marginBottom: "24px" }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          style={{
            borderRadius: "6px",
            marginBottom: "16px",
          }}
        >
          返回
        </Button>

        <Breadcrumb>
          <Breadcrumb.Item onClick={() => navigate("/my-courses")}>
            我的课程
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            {course.title}
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>

      {/* 课程标题区域 */}
      <Card
        style={{
          borderRadius: "16px",
          border: "none",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          marginBottom: "32px",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <Row gutter={[32, 24]} align="middle">
          <Col xs={24} lg={8}>
            <div style={{ position: "relative" }}>
              {course.cover ? (
                <div style={{
                  borderRadius: "12px",
                  overflow: "hidden",
                  boxShadow: "0 8px 16px rgba(0, 0, 0, 0.15)",
                }}>
                  <Image
                    src={`http://localhost:8000${course.cover}`}
                    alt={course.title}
                    style={{
                      width: '100%',
                      height: '240px',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                    placeholder={<Spin />}
                  />
                </div>
              ) : (
                <div style={{
                  width: '100%',
                  height: '240px',
                  background: "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 8px 16px rgba(0, 0, 0, 0.15)",
                }}>
                  <BookOutlined style={{ fontSize: "64px", color: "#9ca3af" }} />
                </div>
              )}

              {/* 课程状态标签 */}
              <div style={{
                position: "absolute",
                top: "12px",
                right: "12px",
                background: "rgba(0, 0, 0, 0.7)",
                color: "white",
                padding: "6px 12px",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: 600,
                backdropFilter: "blur(10px)",
              }}>
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
                marginBottom: "16px",
              }}>
                <Tag
                  color="blue"
                  style={{
                    borderRadius: "12px",
                    padding: "4px 12px",
                    fontWeight: 500,
                  }}
                >
                  🎓 专业课程
                </Tag>
                <Tag
                  color="green"
                  style={{
                    borderRadius: "12px",
                    padding: "4px 12px",
                    fontWeight: 500,
                  }}
                >
                  📚 学习中
                </Tag>
              </div>

              <Title level={1} style={{
                margin: "0 0 16px 0",
                fontSize: "36px",
                fontWeight: 700,
                color: "#1f2937",
                lineHeight: "1.2",
              }}>
                {course.title}
              </Title>

              {course.description && (
                <Paragraph style={{
                  fontSize: "16px",
                  color: "#6b7280",
                  lineHeight: "1.6",
                  marginBottom: "24px",
                }}>
                  {course.description}
                </Paragraph>
              )}

              {/* 课程统计信息 */}
              <Row gutter={[24, 16]} style={{ marginBottom: "24px" }}>
                <Col xs={12} sm={6}>
                  <div style={{
                    textAlign: "center",
                    padding: "16px",
                    background: "#f9fafb",
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                  }}>
                    <div style={{
                      fontSize: "24px",
                      fontWeight: 700,
                      color: "#3b82f6",
                      marginBottom: "4px",
                    }}>
                      {moduleCount}
                    </div>
                    <div style={{ fontSize: "12px", color: "#6b7280" }}>学习模块</div>
                  </div>
                </Col>
                <Col xs={12} sm={6}>
                  <div style={{
                    textAlign: "center",
                    padding: "16px",
                    background: "#f9fafb",
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                  }}>
                    <div style={{
                      fontSize: "24px",
                      fontWeight: 700,
                      color: "#10b981",
                      marginBottom: "4px",
                    }}>
                      {progressPercent}%
                    </div>
                    <div style={{ fontSize: "12px", color: "#6b7280" }}>完成进度</div>
                  </div>
                </Col>
                <Col xs={12} sm={6}>
                  <div style={{
                    textAlign: "center",
                    padding: "16px",
                    background: "#f9fafb",
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                  }}>
                    <div style={{
                      fontSize: "24px",
                      fontWeight: 700,
                      color: "#f59e0b",
                      marginBottom: "4px",
                    }}>
                      0
                    </div>
                    <div style={{ fontSize: "12px", color: "#6b7280" }}>获得证书</div>
                  </div>
                </Col>
                <Col xs={12} sm={6}>
                  <div style={{
                    textAlign: "center",
                    padding: "16px",
                    background: "#f9fafb",
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                  }}>
                    <div style={{
                      fontSize: "24px",
                      fontWeight: 700,
                      color: "#8b5cf6",
                      marginBottom: "4px",
                    }}>
                      初级
                    </div>
                    <div style={{ fontSize: "12px", color: "#6b7280" }}>难度等级</div>
                  </div>
                </Col>
              </Row>

              {/* 学习进度条 */}
              <div style={{ marginBottom: "24px" }}>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "8px",
                }}>
                  <span style={{ fontSize: "14px", fontWeight: 600, color: "#1f2937" }}>
                    📈 学习进度
                  </span>
                  <span style={{ fontSize: "14px", color: "#6b7280" }}>
                    {completedModules} / {moduleCount} 个模块
                  </span>
                </div>
                <Progress
                  percent={progressPercent}
                  size="small"
                  strokeColor="#3b82f6"
                  trailColor="#e5e7eb"
                  showInfo={false}
                />
              </div>

              {/* 操作按钮 */}
              <div style={{
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
              }}>
                <Button
                  size="large"
                  icon={<BookOutlined />}
                  style={{
                    borderRadius: "8px",
                    height: "44px",
                    fontSize: "16px",
                    fontWeight: 600,
                  }}
                >
                  课程资料
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* 模块列表 */}
      <div style={{ marginBottom: "24px" }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}>
          <h2 style={{
            margin: "0",
            fontSize: "24px",
            fontWeight: 700,
            color: "#1f2937",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}>
            📚 课程模块
            <Tag color="blue" style={{ borderRadius: "12px", fontWeight: 500 }}>
              {moduleCount} 个模块
            </Tag>
          </h2>
        </div>

        {course.modules && course.modules.length > 0 ? (
          <Row gutter={[24, 24]}>
            {course.modules.map((module, index) => {
              const isCompleted = false; // 这里可以根据实际数据判断
              const isCurrent = index === completedModules;

              return (
                <Col xs={24} sm={12} lg={8} key={module.id}>
                  <Card
                    hoverable
                    style={{
                      borderRadius: "16px",
                      border: "none",
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      height: "100%",
                      position: "relative",
                      overflow: "hidden",
                      border: isCurrent ? "2px solid #3b82f6" : "none",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = "0 20px 25px rgba(0, 0, 0, 0.15)";
                      e.currentTarget.style.transform = "translateY(-6px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
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
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        background: isCompleted
                          ? "linear-gradient(135deg, #10b981, #059669)"
                          : isCurrent
                          ? "linear-gradient(135deg, #3b82f6, #2563eb)"
                          : "#e5e7eb",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontSize: "16px",
                        fontWeight: 600,
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                      }}>
                        {isCompleted ? "✓" : index + 1}
                      </div>
                    </div>

                    <div style={{ padding: "20px 16px 16px 16px" }}>
                      <h3 style={{
                        margin: "0 0 12px 0",
                        fontSize: "18px",
                        fontWeight: 700,
                        color: "#1f2937",
                        lineHeight: "1.4",
                      }}>
                        {module.title}
                      </h3>

                      {module.description && (
                        <p style={{
                          margin: "0 0 16px 0",
                          fontSize: "14px",
                          color: "#6b7280",
                          lineHeight: "1.5",
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}>
                          {module.description}
                        </p>
                      )}

                      {/* 模块信息 */}
                      <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "16px",
                      }}>
                        <div style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          fontSize: "12px",
                          color: "#9ca3af",
                        }}>
                          <ClockCircleOutlined />
                          <span>预计 30 分钟</span>
                        </div>
                        <Tag
                          color={isCompleted ? "success" : isCurrent ? "processing" : "default"}
                          size="small"
                          style={{ borderRadius: "12px" }}
                        >
                          {isCompleted ? "已完成" : isCurrent ? "进行中" : "未开始"}
                        </Tag>
                      </div>
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
    </div>
  );
}
