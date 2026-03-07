import { Card, Empty, Button, Row, Col, List, Input, Select, Space, Tag, Statistic, Divider } from "antd";
import { SearchOutlined, StarOutlined, BookOutlined, UserOutlined, ClockCircleOutlined, TrophyOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCourses, enrollCourse, getUserCourses } from "../api/course";

export default function DiscoverCoursesPage() {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [category, setCategory] = useState("all");
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrolling, setEnrolling] = useState(null); // 正在选课的课程ID
  const [enrolledCourses, setEnrolledCourses] = useState([]); // 已选课程ID列表

  const categories = [
    { label: "全部分类", value: "all" },
    { label: "基本理论类", value: "基本理论类" },
    { label: "编程技术类", value: "编程技术类" },
    { label: "软件开发工程类", value: "软件开发工程类" },
    { label: "实践与项目类", value: "实践与项目类" },
  ];

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await getCourses();
        setAllCourses(response.data);
      } catch (err) {
        setError(err.response?.data?.message || '获取课程列表失败');
      } finally {
        setLoading(false);
      }
    };

    const fetchEnrolledCourses = async () => {
      try {
        const response = await getUserCourses();
        setEnrolledCourses(response.data.map(course => course.id));
      } catch (err) {
        // 可能未登录或无权限，忽略
      }
    };

    fetchCourses();
    fetchEnrolledCourses();
  }, []);

  // 筛选课程
  const filteredCourses = allCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchText.toLowerCase()) ||
                         (course.description && course.description.toLowerCase().includes(searchText.toLowerCase()));
    const matchesCategory = category === "all" || course.category === category;
    return matchesSearch && matchesCategory;
  });

  const handleEnroll = async (courseId) => {
    try {
      setEnrolling(courseId);
      await enrollCourse(courseId);
      alert('成功选课！');
      setEnrolledCourses(prev => [...prev, courseId]);
      // 可以更新状态或重新获取数据
    } catch (err) {
      alert(err.response?.data?.message || '选课失败');
    } finally {
      setEnrolling(null);
    }
  };

  // 获取分类显示信息
  const getCategoryInfo = (categoryValue) => {
    const categoryMap = {
      '基本理论类': { label: '基本理论类', color: 'blue', icon: '📖' },
      '编程技术类': { label: '编程技术类', color: 'green', icon: '💻' },
      '软件开发工程类': { label: '软件开发工程类', color: 'purple', icon: '⚙️' },
      '实践与项目类': { label: '实践与项目类', color: 'orange', icon: '🚀' }
    };
    return categoryMap[categoryValue] || { label: '其他', color: 'default', icon: '📚' };
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: "24px 0"
    }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 24px" }}>
        {/* 页面标题区域 */}
        <div style={{
          textAlign: "center",
          marginBottom: "32px",
          padding: "40px 20px",
          background: "rgba(255, 255, 255, 0.1)",
          borderRadius: "20px",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)"
        }}>
          
          <h1 style={{
            color: "white",
            fontSize: "36px",
            fontWeight: 500,
            margin: "0 0 8px 0",
            textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)"
          }}>
            发现精彩课程
          </h1>
          <p style={{
            color: "rgba(255, 255, 255, 0.8)",
            fontSize: "16px",
            margin: "0",
            fontWeight: 200
          }}>
            探索无限可能，开启你的学习之旅
          </p>
        </div>

        <Card
          style={{
            borderRadius: "16px",
            boxShadow: "0 20px 25px rgba(0, 0, 0, 0.1)",
            border: "none",
            background: "white"
          }}
          loading={loading}
        >
          {error ? (
            <div style={{
              color: '#ef4444',
              textAlign: 'center',
              padding: '60px 20px',
              background: "#fef2f2",
              borderRadius: "12px",
              border: "1px solid #fecaca"
            }}>
              <div style={{ fontSize: "48px", marginBottom: "16px", opacity: 0.5 }}>⚠️</div>
              <h3 style={{ color: "#dc2626", marginBottom: "8px" }}>加载失败</h3>
              <p style={{ color: "#7f1d1d" }}>{error}</p>
            </div>
          ) : (
            <>
              {/* 搜索和筛选区域 */}
              <div style={{
                background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
                padding: "24px",
                borderRadius: "12px",
                marginBottom: "24px",
                border: "1px solid #e2e8f0"
              }}>
                <Row gutter={[24, 16]} align="middle">
                  <Col xs={24} md={16}>
                    <div style={{ position: "relative" }}>
                      <Input
                        placeholder="🔍 搜索课程名称或描述..."
                        size="large"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        allowClear
                        style={{
                          borderRadius: "25px",
                          paddingLeft: "20px",
                          fontSize: "16px",
                          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                          border: "2px solid transparent",
                          background: "white"
                        }}
                        onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
                        onBlur={(e) => e.target.style.borderColor = "transparent"}
                      />
                    </div>
                  </Col>
                  <Col xs={24} md={8}>
                    <Select
                      value={category}
                      onChange={setCategory}
                      options={categories}
                      size="large"
                      style={{
                        width: "100%",
                        borderRadius: "12px",
                        fontSize: "16px"
                      }}
                    />
                  </Col>
                </Row>
              </div>

              {/* 课程统计 */}
              <Row gutter={[24, 16]} style={{ marginBottom: "24px" }}>
                <Col xs={12} sm={6}>
                  <div style={{
                    textAlign: "center",
                    padding: "20px",
                    background: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
                    borderRadius: "12px",
                    border: "1px solid #93c5fd"
                  }}>
                    <div style={{
                      fontSize: "28px",
                      fontWeight: 700,
                      color: "#1e40af",
                      marginBottom: "4px"
                    }}>
                      {allCourses.length}
                    </div>
                    <div style={{ fontSize: "12px", color: "#3730a3", fontWeight: 600 }}>总课程数</div>
                  </div>
                </Col>
                <Col xs={12} sm={6}>
                  <div style={{
                    textAlign: "center",
                    padding: "20px",
                    background: "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)",
                    borderRadius: "12px",
                    border: "1px solid #86efac"
                  }}>
                    <div style={{
                      fontSize: "28px",
                      fontWeight: 700,
                      color: "#166534",
                      marginBottom: "4px"
                    }}>
                      {filteredCourses.length}
                    </div>
                    <div style={{ fontSize: "12px", color: "#14532d", fontWeight: 600 }}>匹配课程</div>
                  </div>
                </Col>
                <Col xs={12} sm={6}>
                  <div style={{
                    textAlign: "center",
                    padding: "20px",
                    background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
                    borderRadius: "12px",
                    border: "1px solid #fcd34d"
                  }}>
                    <div style={{
                      fontSize: "28px",
                      fontWeight: 700,
                      color: "#92400e",
                      marginBottom: "4px"
                    }}>
                      5
                    </div>
                    <div style={{ fontSize: "12px", color: "#78350f", fontWeight: 600 }}>课程分类</div>
                  </div>
                </Col>
                <Col xs={12} sm={6}>
                  <div style={{
                    textAlign: "center",
                    padding: "20px",
                    background: "linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)",
                    borderRadius: "12px",
                    border: "1px solid #f9a8d4"
                  }}>
                    <div style={{
                      fontSize: "28px",
                      fontWeight: 700,
                      color: "#be185d",
                      marginBottom: "4px"
                    }}>
                      ∞
                    </div>
                    <div style={{ fontSize: "12px", color: "#9d174d", fontWeight: 600 }}>学习无限</div>
                  </div>
                </Col>
              </Row>

              {/* 课程列表 */}
              {filteredCourses.length === 0 ? (
                <div style={{
                  textAlign: "center",
                  padding: "80px 20px",
                  background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                  borderRadius: "16px",
                  border: "2px dashed #cbd5e1"
                }}>
                  <div style={{ fontSize: "64px", marginBottom: "24px", opacity: 0.5 }}>
                    {searchText ? "🔍" : "📚"}
                  </div>
                  <h2 style={{
                    color: "#475569",
                    marginBottom: "8px",
                    fontSize: "24px",
                    fontWeight: 600
                  }}>
                    {searchText ? "没有找到匹配的课程" : "暂无课程"}
                  </h2>
                  <p style={{
                    color: "#64748b",
                    fontSize: "16px",
                    marginBottom: "24px"
                  }}>
                    {searchText ? "尝试调整搜索关键词或清除筛选条件" : "敬请期待更多精彩课程"}
                  </p>
                  {searchText && (
                    <Button
                      onClick={() => setSearchText("")}
                      style={{
                        borderRadius: "8px",
                        fontWeight: 600
                      }}
                    >
                      清除搜索
                    </Button>
                  )}
                </div>
              ) : (
                <Row gutter={[24, 24]}>
                  {filteredCourses.map((course) => (
                    <Col xs={24} sm={12} lg={8} key={course.id}>
                      <Card
                        hoverable
                        style={{
                          borderRadius: "16px",
                          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
                          border: "1px solid #e2e8f0",
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          overflow: "hidden"
                        }}
                        bodyStyle={{ padding: "0" }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-8px)";
                          e.currentTarget.style.boxShadow = "0 20px 25px rgba(0, 0, 0, 0.15)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.05)";
                        }}
                      >
                        {/* 课程封面 */}
                        <div style={{
                          height: "160px",
                          background: course.cover
                            ? `url(${course.cover}) center/cover no-repeat`
                            : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          position: "relative",
                          overflow: "hidden"
                        }}>
                          {!course.cover && (
                            <div style={{
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%, -50%)",
                              fontSize: "48px",
                              opacity: 0.7
                            }}>
                              📚
                            </div>
                          )}
                          <div style={{
                            position: "absolute",
                            top: "12px",
                            right: "12px",
                            background: "rgba(0, 0, 0, 0.7)",
                            color: "white",
                            padding: "4px 8px",
                            borderRadius: "12px",
                            fontSize: "12px",
                            fontWeight: 600
                          }}>
                            免费
                          </div>
                        </div>

                        {/* 课程信息 */}
                        <div style={{ padding: "20px" }}>
                          <h3 style={{
                            margin: "0 0 12px 0",
                            fontSize: "18px",
                            fontWeight: 700,
                            color: "#1e293b",
                            lineHeight: "1.4",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden"
                          }}>
                            {course.title}
                          </h3>

                          {course.description && (
                            <p style={{
                              margin: "0 0 16px 0",
                              fontSize: "14px",
                              color: "#64748b",
                              lineHeight: "1.5",
                              display: "-webkit-box",
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden"
                            }}>
                              {course.description}
                            </p>
                          )}

                          {/* 课程标签和统计 */}
                          <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "16px"
                          }}>
                            <Space size={4}>
                              <Tag color={getCategoryInfo(course.category).color} style={{ borderRadius: "12px", fontSize: "11px", fontWeight: 600 }}>
                                {getCategoryInfo(course.category).icon} {getCategoryInfo(course.category).label}
                              </Tag>
                            </Space>
                            <div style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "12px",
                              fontSize: "12px",
                              color: "#64748b"
                            }}>
                              <span style={{ display: "flex", alignItems: "center", gap: "2px" }}>
                                <UserOutlined />
                                100+
                              </span>
                              <span style={{ display: "flex", alignItems: "center", gap: "2px" }}>
                                <ClockCircleOutlined />
                                8h
                              </span>
                            </div>
                          </div>

                          <Divider style={{ margin: "16px 0" }} />

                          {/* 操作按钮 */}
                          <Space direction="vertical" style={{ width: "100%" }} size={8}>
                            <Button
                              type="primary"
                              block
                              onClick={() => navigate(`/majors/${course.id}`)}
                              style={{
                                borderRadius: "8px",
                                height: "40px",
                                fontSize: "14px",
                                fontWeight: 600,
                                background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                                border: "none"
                              }}
                            >
                              <BookOutlined style={{ marginRight: "6px" }} />
                              查看详情
                            </Button>
                            <Button
                              block
                              loading={enrolling === course.id}
                              onClick={() => handleEnroll(course.id)}
                              disabled={enrolledCourses.includes(course.id)}
                              style={{
                                borderRadius: "8px",
                                height: "36px",
                                fontSize: "14px",
                                fontWeight: 600,
                                border: enrolledCourses.includes(course.id) ? "2px solid #10b981" : "2px solid #3b82f6",
                                color: enrolledCourses.includes(course.id) ? "#10b981" : "#3b82f6",
                                background: enrolledCourses.includes(course.id) ? "#f0fdf4" : "transparent"
                              }}
                            >
                              <TrophyOutlined style={{ marginRight: "6px" }} />
                              {enrolledCourses.includes(course.id) ? '已选' : (enrolling === course.id ? '选课中...' : '立即选课')}
                            </Button>
                          </Space>
                        </div>
                      </Card>
                    </Col>
                  ))}
                </Row>
              )}
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
