import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, Button, Spin, Alert, Row, Col, Progress, Tag, Divider, Steps, Breadcrumb } from "antd";
import { ArrowLeftOutlined, PlayCircleOutlined, FileTextOutlined, BugOutlined, CheckSquareOutlined, CheckCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import QuizComponent from "../components/QuizComponent";
import ProgrammingComponent from "../components/ProgrammingComponent";
import { getModuleDetail } from "../api/course";

const { Step } = Steps;

export default function ModuleContent() {
  const { courseId, moduleId } = useParams();
  const navigate = useNavigate();
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeQuizId, setActiveQuizId] = useState(null);
  const [activeProgrammingId, setActiveProgrammingId] = useState(null);
  const [moduleInfo, setModuleInfo] = useState(null);

  useEffect(() => {
    const fetchContents = async () => {
      try {
        setLoading(true);
        const response = await getModuleDetail(courseId, moduleId);
        const moduleData = response.data.module;
        setContents(moduleData?.contents || []);
        setModuleInfo(moduleData);
      } catch (err) {
        setError(err.response?.data?.message || '获取内容失败');
      } finally {
        setLoading(false);
      }
    };

    if (courseId && moduleId) {
      fetchContents();
    }
  }, [courseId, moduleId]);

  if (loading) {
    return (
      <div style={{ padding: "60px 20px", textAlign: 'center', minHeight: "100vh" }}>
        <Spin size="large" tip="📚 加载课程内容..." />
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

  const getContentIcon = (type) => {
    switch (type) {
      case 'VIDEO':
        return <PlayCircleOutlined />;
      case 'TEXT':
        return <FileTextOutlined />;
      case 'QUIZ':
        return <CheckSquareOutlined />;
      case 'PROGRAMMING':
        return <BugOutlined />;
      default:
        return null;
    }
  };

  const getContentTypeLabel = (type) => {
    const labelMap = {
      'TEXT': '📖 文本课件',
      'VIDEO': '🎬 视频教程',
      'QUIZ': '📝 小测验',
      'PROGRAMMING': '💻 编程练习',
    };
    return labelMap[type] || type;
  };

  const getContentTypeColor = (type) => {
    const colorMap = {
      'TEXT': 'blue',
      'VIDEO': 'green',
      'QUIZ': 'orange',
      'PROGRAMMING': 'red',
    };
    return colorMap[type] || 'default';
  };

  const getContentBgColor = (type) => {
    const bgMap = {
      'TEXT': 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
      'VIDEO': 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
      'QUIZ': 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
      'PROGRAMMING': 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
    };
    return bgMap[type] || 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)';
  };

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto", minHeight: "100vh" }}>
      {/* 导航和面包屑 */}
      <div style={{ marginBottom: "24px" }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          style={{
            borderRadius: "6px",
            marginBottom: "16px",
          }}
        >
          返回上一级
        </Button>

        <Breadcrumb style={{ marginBottom: "16px" }}>
          <Breadcrumb.Item onClick={() => navigate("/my-courses")}>
            我的课程
          </Breadcrumb.Item>
          <Breadcrumb.Item onClick={() => navigate(`/majors/${courseId}`)}>
            课程详情
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            {moduleInfo?.title || '模块内容'}
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>

      {/* 模块标题区域 */}
      <Card
        style={{
          borderRadius: "16px",
          border: "none",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          marginBottom: "32px",
          background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
          color: "white",
        }}
      >
        <Row align="middle" gutter={[24, 16]}>
          <Col xs={24} md={16}>
            <h1 style={{
              margin: "0 0 8px 0",
              fontSize: "28px",
              fontWeight: 700,
              color: "white",
            }}>
              📚 {moduleInfo?.title || '课程模块'}
            </h1>
            {moduleInfo?.description && (
              <p style={{
                margin: "0",
                fontSize: "16px",
                opacity: 0.9,
                lineHeight: "1.5",
              }}>
                {moduleInfo.description}
              </p>
            )}
          </Col>
          <Col xs={24} md={8}>
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "16px",
              flexWrap: "wrap",
            }}>
              <div style={{
                textAlign: "center",
                padding: "16px",
                background: "rgba(255, 255, 255, 0.1)",
                borderRadius: "12px",
                backdropFilter: "blur(10px)",
              }}>
                <div style={{ fontSize: "24px", fontWeight: 700, marginBottom: "4px" }}>
                  {contents.length}
                </div>
                <div style={{ fontSize: "12px", opacity: 0.8 }}>学习内容</div>
              </div>
              <div style={{
                textAlign: "center",
                padding: "16px",
                background: "rgba(255, 255, 255, 0.1)",
                borderRadius: "12px",
                backdropFilter: "blur(10px)",
              }}>
                <div style={{ fontSize: "24px", fontWeight: 700, marginBottom: "4px" }}>
                  0%
                </div>
                <div style={{ fontSize: "12px", opacity: 0.8 }}>完成进度</div>
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* 学习进度条 */}
      <Card
        style={{
          borderRadius: "12px",
          border: "none",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
          marginBottom: "32px",
          background: "#f9fafb",
        }}
      >
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "12px",
        }}>
          <span style={{ fontSize: "14px", fontWeight: 600, color: "#1f2937" }}>
            📈 学习进度
          </span>
          <span style={{ fontSize: "14px", color: "#6b7280" }}>
            0 / {contents.length} 项内容
          </span>
        </div>
        <Progress
          percent={0}
          size="small"
          strokeColor="#3b82f6"
          trailColor="#e5e7eb"
          showInfo={false}
        />
      </Card>

      {/* 内容列表 */}
      {contents && contents.length > 0 ? (
        <div>
          <div style={{
            marginBottom: "24px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}>
            <h2 style={{
              margin: "0",
              fontSize: "20px",
              fontWeight: 700,
              color: "#1f2937",
            }}>
              🎯 学习内容
            </h2>
            <Tag color="blue" style={{ borderRadius: "12px", fontWeight: 500 }}>
              {contents.length} 项
            </Tag>
          </div>

          <Row gutter={[24, 24]}>
            {contents.map((content, index) => (
              <Col xs={24} key={content.id}>
                <Card
                  hoverable
                  style={{
                    borderRadius: "16px",
                    border: "none",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    overflow: "hidden",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "0 12px 16px rgba(0, 0, 0, 0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
                  }}
                >
                  {/* 内容头部 */}
                  <div style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    marginBottom: "16px",
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        marginBottom: "8px",
                      }}>
                        <div style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          background: getContentBgColor(content.type),
                          color: content.type === 'PROGRAMMING' ? '#dc2626' :
                                 content.type === 'QUIZ' ? '#d97706' :
                                 content.type === 'VIDEO' ? '#059669' : '#2563eb',
                          fontSize: "18px",
                        }}>
                          {getContentIcon(content.type)}
                        </div>
                        <div>
                          <div style={{
                            fontSize: "12px",
                            color: "#6b7280",
                            marginBottom: "4px",
                            fontWeight: 500,
                          }}>
                            第 {index + 1} 节
                          </div>
                          <h3 style={{
                            margin: "0",
                            fontSize: "20px",
                            fontWeight: 700,
                            color: "#1f2937",
                          }}>
                            {content.title}
                          </h3>
                        </div>
                      </div>

                      {content.description && (
                        <p style={{
                          margin: "0 0 12px 52px",
                          fontSize: "14px",
                          color: "#6b7280",
                          lineHeight: "1.5",
                        }}>
                          {content.description}
                        </p>
                      )}

                      <div style={{ marginLeft: "52px" }}>
                        <Tag
                          color={getContentTypeColor(content.type)}
                          icon={getContentIcon(content.type)}
                          style={{
                            borderRadius: "12px",
                            padding: "4px 12px",
                            fontWeight: 500,
                          }}
                        >
                          {getContentTypeLabel(content.type)}
                        </Tag>
                      </div>
                    </div>

                    {/* 完成状态指示器 */}
                    <div style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "8px",
                    }}>
                      <div style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        border: "2px solid #e5e7eb",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "white",
                      }}>
                        <ClockCircleOutlined style={{ color: "#9ca3af", fontSize: "16px" }} />
                      </div>
                      <span style={{ fontSize: "12px", color: "#6b7280" }}>未开始</span>
                    </div>
                  </div>

                  <Divider style={{ margin: "16px 0" }} />

                  {/* 内容展示区域 */}
                  <div style={{ marginBottom: "16px" }}>
                    {content.type === 'TEXT' && (
                      <div style={{
                        padding: "20px",
                        background: "#f9fafb",
                        borderRadius: "12px",
                        border: "1px solid #e5e7eb",
                        lineHeight: "1.6",
                        color: "#374151",
                      }}>
                        <div dangerouslySetInnerHTML={{ __html: content.body }} />
                      </div>
                    )}

                    {content.type === 'VIDEO' && content.body && (
                      <div style={{
                        borderRadius: "12px",
                        overflow: "hidden",
                        background: "#000",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                      }}>
                        <video
                          controls
                          style={{
                            width: '100%',
                            maxHeight: '500px',
                            display: "block",
                          }}
                          poster="/video-poster.png"
                        >
                          <source src={`http://localhost:8000${content.body}`} type="video/mp4" />
                          您的浏览器不支持视频标签
                        </video>
                      </div>
                    )}

                    {content.type === 'QUIZ' && (
                      <div>
                        {activeQuizId === content.id ? (
                          <QuizComponent
                            courseId={courseId}
                            moduleId={moduleId}
                            contentId={content.id}
                          />
                        ) : (
                          <div style={{
                            padding: "32px",
                            background: "linear-gradient(135deg, #fef3c7 0%, #fef08a 100%)",
                            borderRadius: "12px",
                            textAlign: "center",
                            border: "2px dashed #fbbf24",
                          }}>
                            <div style={{
                              fontSize: "48px",
                              marginBottom: "16px",
                              opacity: 0.7,
                            }}>
                              📝
                            </div>
                            <h3 style={{
                              margin: "0 0 8px 0",
                              color: "#92400e",
                              fontWeight: 600,
                            }}>
                              知识测验
                            </h3>
                            <p style={{
                              margin: "0 0 24px 0",
                              color: "#a16207",
                              fontSize: "14px",
                            }}>
                              点击下方按钮开始测验，检验你对本节内容的掌握程度
                            </p>
                            <Button
                              type="primary"
                              size="large"
                              onClick={() => setActiveQuizId(content.id)}
                              icon={<CheckSquareOutlined />}
                              style={{
                                borderRadius: "8px",
                                height: "44px",
                                fontSize: "16px",
                                fontWeight: 600,
                                background: "linear-gradient(135deg, #f59e0b, #d97706)",
                                border: "none",
                              }}
                            >
                              开始测验
                            </Button>
                          </div>
                        )}
                      </div>
                    )}

                    {content.type === 'PROGRAMMING' && (
                      <div>
                        {activeProgrammingId === content.id ? (
                          <ProgrammingComponent
                            courseId={courseId}
                            moduleId={moduleId}
                            contentId={content.id}
                          />
                        ) : (
                          <div style={{
                            padding: "32px",
                            background: "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)",
                            borderRadius: "12px",
                            textAlign: "center",
                            border: "2px dashed #ef4444",
                          }}>
                            <div style={{
                              fontSize: "48px",
                              marginBottom: "16px",
                              opacity: 0.7,
                            }}>
                              💻
                            </div>
                            <h3 style={{
                              margin: "0 0 8px 0",
                              color: "#dc2626",
                              fontWeight: 600,
                            }}>
                              编程练习
                            </h3>
                            <p style={{
                              margin: "0 0 24px 0",
                              color: "#b91c1c",
                              fontSize: "14px",
                            }}>
                              点击下方按钮开始编程练习，提升你的动手能力
                            </p>
                            <Button
                              type="primary"
                              size="large"
                              onClick={() => setActiveProgrammingId(content.id)}
                              icon={<BugOutlined />}
                              style={{
                                borderRadius: "8px",
                                height: "44px",
                                fontSize: "16px",
                                fontWeight: 600,
                                background: "linear-gradient(135deg, #ef4444, #dc2626)",
                                border: "none",
                              }}
                            >
                              开始编程
                            </Button>
                          </div>
                        )}
                      </div>
                    )}

                    {!['TEXT', 'VIDEO', 'QUIZ', 'PROGRAMMING'].includes(content.type) && (
                      <Alert
                        message={`未知内容类型: ${content.type}`}
                        type="warning"
                        showIcon
                        style={{ borderRadius: "8px" }}
                      />
                    )}
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
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
            该模块暂无内容
          </h3>
          <p style={{ color: "#9ca3af" }}>
            课程内容正在准备中，请稍后再来查看
          </p>
        </Card>
      )}
    </div>
  );
}