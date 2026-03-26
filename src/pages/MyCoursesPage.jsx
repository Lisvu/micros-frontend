import { Card, Empty, Button, Row, Col, Progress, Tag, Spin, Alert, Divider } from "antd";
import { BookOutlined, PlayCircleOutlined, ClockCircleOutlined, TrophyOutlined, FireOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUserCourses, getCourseProgress } from "../api/course";

export default function MyCoursesPage() {
  const navigate = useNavigate();
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [courseProgress, setCourseProgress] = useState({});

  useEffect(() => {
   const fetchUserCourses = async () => {
  try {
    setLoading(true);

    const response = await getUserCourses();
    const courses = response.data;

    setMyCourses(courses);

    // 获取每门课程进度
    const progressMap = {};

    await Promise.all(
      courses.map(async (course) => {
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
    setError(err.response?.data?.message || '获取我的课程失败');
  } finally {
    setLoading(false);
  }
};

    fetchUserCourses();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "60px 20px", textAlign: 'center', minHeight: "100vh" }}>
        <Spin size="large" tip="📚 加载您的课程..." />
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

  return (
    <div style={{ padding: "24px", maxWidth: "1400px", margin: "0 auto" }}>
      {/* 页面标题区域 */}
      <div style={{
        background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
        color: "white",
        borderRadius: "16px",
        padding: "32px 40px",
        marginBottom: "32px",
        boxShadow: "0 20px 40px rgba(59, 130, 246, 0.2)",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ position: "relative", zIndex: 2 }}>
          <h1 style={{ margin: 0, marginBottom: "12px", fontSize: "32px", fontWeight: 700 }}>
            📚 我的学习中心
          </h1>
          <p style={{ margin: 0, fontSize: "16px", opacity: 0.9 }}>
            继续您的学习之旅，发现更多精彩内容
          </p>
        </div>
        {/* 装饰性背景元素 */}
        <div style={{
          position: "absolute",
          top: "-50px",
          right: "-50px",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.1)",
          zIndex: 1,
        }} />
        <div style={{
          position: "absolute",
          bottom: "-30px",
          left: "-30px",
          width: "150px",
          height: "150px",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.05)",
          zIndex: 1,
        }} />
      </div>

      {/* 统计卡片行 */}
      <Row gutter={[20, 20]} style={{ marginBottom: "32px" }}>
        <Col xs={24} sm={8}>
          <Card
            style={{
              borderRadius: "12px",
              border: "none",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              color: "white",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "50px",
                height: "50px",
                borderRadius: "10px",
                background: "rgba(255, 255, 255, 0.2)",
                margin: "0 auto 12px",
              }}>
                <BookOutlined style={{ fontSize: "24px" }} />
              </div>
              <div style={{ fontSize: "24px", fontWeight: 700, marginBottom: "4px" }}>
                {myCourses.length}
              </div>
              <div style={{ fontSize: "12px", opacity: 0.9 }}>已选课程</div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card
            style={{
              borderRadius: "12px",
              border: "none",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
              color: "white",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "50px",
                height: "50px",
                borderRadius: "10px",
                background: "rgba(255, 255, 255, 0.2)",
                margin: "0 auto 12px",
              }}>
                <FireOutlined style={{ fontSize: "24px" }} />
              </div>
              <div style={{ fontSize: "24px", fontWeight: 700, marginBottom: "4px" }}>
                0%
              </div>
              <div style={{ fontSize: "12px", opacity: 0.9 }}>总体进度</div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card
            style={{
              borderRadius: "12px",
              border: "none",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
              color: "white",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "50px",
                height: "50px",
                borderRadius: "10px",
                background: "rgba(255, 255, 255, 0.2)",
                margin: "0 auto 12px",
              }}>
                <TrophyOutlined style={{ fontSize: "24px" }} />
              </div>
              <div style={{ fontSize: "24px", fontWeight: 700, marginBottom: "4px" }}>
                0
              </div>
              <div style={{ fontSize: "12px", opacity: 0.9 }}>完成课程</div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 课程列表 */}
      {myCourses.length === 0 ? (
        <Card
          style={{
            borderRadius: "16px",
            border: "2px dashed #e5e7eb",
            background: "#fafbfc",
            textAlign: "center",
            padding: "60px 20px",
          }}
        >
          <Empty
            image={<BookOutlined style={{ fontSize: "64px", color: "#d1d5db" }} />}
            description={
              <div>
                <h3 style={{ color: "#6b7280", marginBottom: "8px" }}>还没有选择课程</h3>
                <p style={{ color: "#9ca3af", marginBottom: "24px" }}>
                  开始您的学习之旅，选择感兴趣的课程吧！
                </p>
              </div>
            }
          >
            <Button
              type="primary"
              size="large"
              icon={<BookOutlined />}
              onClick={() => navigate("/discover-courses")}
              style={{
                borderRadius: "8px",
                height: "44px",
                fontSize: "16px",
                fontWeight: 600,
                background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                border: "none",
              }}
            >
              🎓 发现精彩课程
            </Button>
          </Empty>
        </Card>
      ) : (
        <div>
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
              📖 正在学习的课程
              <Tag color="blue" style={{ borderRadius: "12px", fontWeight: 500 }}>
                {myCourses.length} 门
              </Tag>
            </h2>
            <Button
              type="default"
              onClick={() => navigate("/discover-courses")}
              style={{ borderRadius: "6px" }}
            >
              浏览更多课程
            </Button>
          </div>

          <Row gutter={[24, 24]}>
            {myCourses.map((course, index) => (
              <Col xs={24} sm={12} lg={8} key={course.id}>
                <Card
                  hoverable
                  style={{
                    borderRadius: "16px",
                    border: "none",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    overflow: "hidden",
                    height: "100%",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "0 20px 25px rgba(0, 0, 0, 0.15)";
                    e.currentTarget.style.transform = "translateY(-6px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                  cover={
                    course.cover ? (
                      <div style={{ position: "relative", height: "160px", overflow: "hidden" }}>
                        <img
                          alt={course.title}
                          src={`http://localhost:8000${course.cover}`}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                        <div style={{
                          position: "absolute",
                          top: "12px",
                          right: "12px",
                          background: "rgba(0, 0, 0, 0.6)",
                          color: "white",
                          padding: "4px 8px",
                          borderRadius: "12px",
                          fontSize: "12px",
                          fontWeight: 500,
                        }}>
                          进行中
                        </div>
                      </div>
                    ) : (
                      <div style={{
                        height: "160px",
                        background: "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}>
                        <BookOutlined style={{ fontSize: "48px", color: "#9ca3af" }} />
                      </div>
                    )
                  }
                >
                  <div style={{ padding: "16px 0" }}>
                    <h3 style={{
                      margin: "0 0 8px 0",
                      fontSize: "18px",
                      fontWeight: 700,
                      color: "#1f2937",
                      lineHeight: "1.4",
                    }}>
                      {course.title}
                    </h3>

                    {course.description && (
                      <p style={{
                        margin: "0 0 16px 0",
                        fontSize: "14px",
                        color: "#6b7280",
                        lineHeight: "1.5",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}>
                        {course.description}
                      </p>
                    )}

                    {/* 学习进度 */}
                    <div style={{ marginBottom: "16px" }}>
                      <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "8px",
                      }}>
                        <span style={{ fontSize: "12px", color: "#6b7280", fontWeight: 500 }}>
                          学习进度
                        </span>
                        <span style={{ fontSize: "12px", color: "#3b82f6", fontWeight: 600 }}>
                          {courseProgress[course.id] || 0}%
                        </span>
                      </div>
                      <Progress
                        percent={courseProgress[course.id] || 0}
                        size="small"
                        strokeColor="#3b82f6"
                        trailColor="#e5e7eb"
                        showInfo={false}
                      />
                    </div>

                    <Button
                      type="primary"
                      icon={<PlayCircleOutlined />}
                      block
                      size="large"
                      onClick={() => navigate(`/majors/${course.id}`)}
                      style={{
                        borderRadius: "8px",
                        height: "40px",
                        fontSize: "14px",
                        fontWeight: 600,
                        background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                        border: "none",
                      }}
                    >
                      继续学习
                    </Button>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}
    </div>
  );
}
