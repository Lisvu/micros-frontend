import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { Card, Button, Typography, Spin, Alert, Row, Col, Form, Input, Select, List, Avatar, Badge, Modal, message, Pagination, Popconfirm } from "antd";
import { MessageOutlined, SendOutlined, PlusOutlined, CommentOutlined, LikeOutlined, EyeOutlined, ArrowLeftOutlined, BookOutlined, DeleteOutlined } from "@ant-design/icons";
import { getCourseDetail, getCourseDiscussions, createDiscussion, deleteDiscussion } from "../api/course";
import { getUser } from "../api/auth";

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

export default function CourseDiscussionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [questions, setQuestions] = useState([]); // 讨论区问题列表
  const [showAskModal, setShowAskModal] = useState(false); // 显示提问模态框
  const [form] = Form.useForm(); // 提问表单
  const [loadingQuestions, setLoadingQuestions] = useState(false); // 加载问题列表的状态
  const [currentPage, setCurrentPage] = useState(1); // 当前页码
  const [totalQuestions, setTotalQuestions] = useState(0); // 总问题数
  const [pageSize, setPageSize] = useState(10); // 每页显示数量
  const [currentUser, setCurrentUser] = useState(null); // 当前用户信息


  useEffect(() => {
    const fetchCourseDetail = async () => {
      try {
        setLoading(true);
        // 同时获取课程详情和用户信息
        const [courseResponse, userResponse] = await Promise.all([
          getCourseDetail(id),
          getUser()
        ]);
        setCourse(courseResponse.data.course);
        setCurrentUser(userResponse.data.user);
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

  // 获取讨论区问题列表
  const fetchQuestions = useCallback(async () => {
    try {
      setLoadingQuestions(true);
      // 调用API获取问题列表，添加分页参数
      const response = await getCourseDiscussions(id, {
        page: currentPage,
        limit: pageSize
      });
      
      // 检查响应结构
      console.log('Discussion API response:', response);
      
      const questionsData = response.data.data || [];
      const total = response.data.total || questionsData.length;
      
      // 格式化问题数据
      const formattedQuestions = questionsData.map(question => ({
        id: question.id,
        title: question.title,
        content: question.content,
        moduleId: question.module_id,
        moduleTitle: question.module?.title || "通用问题",
        author: {
          id: question.user?.id || 0,
          name: question.user?.name || "未知用户",
          avatar: `https://picsum.photos/seed/user${question.user?.id || Math.floor(Math.random() * 10)}/100/100`
        },
        createdAt: new Date(question.created_at).toLocaleString(),
        replies: question.answer ? 1 : 0,
        likes: question.likes || 0,
        views: question.views || 0,
        answer: question.answer,
        answeredBy: question.answerer?.name || null,
        isExpanded: false // 默认收起状态
      }));
      
      setQuestions(formattedQuestions);
      setTotalQuestions(total);
      
      console.log('Fetched questions:', formattedQuestions);
      console.log('Total questions:', total);
    } catch (err) {
      console.error('获取问题列表失败:', err);
      message.error('获取问题列表失败');
      setQuestions([]);
      setTotalQuestions(0);
    } finally {
      setLoadingQuestions(false);
    }
  }, [id, currentPage, pageSize]);

  // 当课程数据加载完成后，获取问题列表
  // 切换问题展开/收起状态
  const toggleQuestionExpand = (questionId) => {
    setQuestions(prevQuestions => 
      prevQuestions.map(question => 
        question.id === questionId 
          ? { ...question, isExpanded: !question.isExpanded } 
          : question
      )
    );
  };

  useEffect(() => {
    if (course) {
      fetchQuestions();
    }
  }, [course, fetchQuestions]);

  // 处理提问
  const handleAskQuestion = async (values) => {
    try {
      // 调用API提交问题
      const response = await createDiscussion(id, {
        title: values.title,
        content: values.content,
        module_id: values.moduleId || null
      });
      
      setShowAskModal(false);
      form.resetFields();
      message.success('问题提交成功');
      
      // 提交成功后刷新问题列表，回到第一页
      setCurrentPage(1);
      fetchQuestions();
    } catch (err) {
      console.error('提交问题失败:', err);
      message.error('提交问题失败');
    }
  };

  // 处理删除问题
  const handleDeleteQuestion = async (discussionId) => {
    try {
      await deleteDiscussion(id, discussionId);
      message.success('问题删除成功');
      // 删除成功后刷新问题列表
      fetchQuestions();
    } catch (err) {
      console.error('删除问题失败:', err);
      message.error('删除问题失败');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "60px 20px", textAlign: 'center', minHeight: "100vh" }}>
        <Spin size="large" tip="📚 加载讨论区..." />
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

        <div style={{ fontSize: "14px", color: "#666" }}>
          <span onClick={() => navigate("/my-courses")} style={{ cursor: "pointer", marginRight: "8px" }}>
            <BookOutlined style={{ marginRight: "4px" }} /> 我的课程
          </span>
          <span style={{ margin: "0 8px" }}> / </span>
          <span onClick={() => navigate(`/majors/${id}`)} style={{ cursor: "pointer", marginRight: "8px" }}>
            {course.title}
          </span>
          <span style={{ margin: "0 8px" }}> / </span>
          <span style={{ color: "#1890ff", fontWeight: "500" }}>
            课程讨论区
          </span>
        </div>
      </div>

      {/* 页面标题 */}
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
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "24px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(139, 92, 246, 0.3)"
            }}>
              <MessageOutlined style={{ fontSize: "24px", color: "white" }} />
            </div>
            <h2 style={{
              margin: 0,
              fontSize: "28px",
              fontWeight: "700",
              color: "#1890ff"
            }}>
              课程讨论区
            </h2>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setShowAskModal(true)}
            style={{
              borderRadius: "20px",
              padding: "10px 24px",
              background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
              border: "none",
              boxShadow: "0 4px 12px rgba(139, 92, 246, 0.3)",
              fontWeight: "600",
              transition: "all 0.3s ease",
              '&:hover': {
                transform: "translateY(-2px)",
                boxShadow: "0 6px 16px rgba(139, 92, 246, 0.4)"
              }
            }}
          >
            提出问题
          </Button>
        </div>
      </Card>

      {/* 问题列表 */}
      <Card
        style={{
          borderRadius: "20px",
          border: "none",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
          background: "white",
          border: "2px solid #f0f9ff"
        }}
      >
        <div style={{ padding: "24px" }}>
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center", 
            marginBottom: "24px"
          }}>
            <h3 style={{ 
              margin: 0, 
              fontSize: "20px", 
              fontWeight: "600", 
              color: "#1890ff"
            }}>
              讨论列表
            </h3>
            <span style={{ 
              fontSize: "14px", 
              color: "#666",
              background: "#f0f9ff",
              padding: "4px 16px",
              borderRadius: "16px"
            }}>
              {questions.length} 个问题
            </span>
          </div>

          {loadingQuestions ? (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <Spin size="large" tip="加载问题列表..." />
            </div>
          ) : questions.length > 0 ? (
            <>
              <List
                itemLayout="vertical"
                dataSource={questions}
                renderItem={(question) => (
                  <List.Item
                    style={{
                      background: "#f0f9ff",
                      borderRadius: "12px",
                      marginBottom: "8px",
                      padding: "12px",
                      boxShadow: "0 2px 6px rgba(0, 0, 0, 0.08)",
                      border: "1px solid #e6f7ff",
                      transition: "all 0.3s ease",
                      '&:hover': {
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.12)",
                        borderColor: "#91d5ff"
                      }
                    }}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar src={question.author.avatar} alt={question.author.name} style={{ 
                          width: "40px", 
                          height: "40px",
                          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)"
                        }} />
                      }
                      title={
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{ 
                            fontSize: "18px", 
                            fontWeight: "600", 
                            color: "#1890ff",
                            flex: 1,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap"
                          }}>
                            {question.title}
                          </span>
                          {question.moduleId && (
                            <Badge 
                              color="blue" 
                              text={question.moduleTitle}
                              style={{ 
                                borderRadius: "10px",
                                padding: "2px 8px",
                                fontSize: "10px",
                                background: "rgba(64, 169, 255, 0.1)",
                                border: "1px solid #91d5ff"
                              }}
                            />
                          )}
                        </div>
                      }
                      description={
                        <div style={{ marginTop: "6px" }}>
                          <div style={{ 
                            fontSize: "14px", 
                            color: "#666",
                            marginBottom: "6px",
                            lineHeight: "1.4",
                            ...(question.isExpanded ? {} : {
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              textOverflow: "ellipsis"
                            })
                          }} dangerouslySetInnerHTML={{ __html: question.content.replace(/\n/g, '<br>') }} />
                          {question.content.split('\n').length > 2 && (
                            <Button
                              type="text"
                              size="small"
                              onClick={() => toggleQuestionExpand(question.id)}
                              style={{
                                fontSize: "12px",
                                color: "#1890ff",
                                padding: 0,
                                marginBottom: "6px"
                              }}
                            >
                              {question.isExpanded ? "收起" : "展开"}
                            </Button>
                          )}
                          <div style={{ 
                            display: "flex", 
                            alignItems: "center", 
                            gap: "10px",
                            fontSize: "12px",
                            color: "#999"
                          }}>

                            <span style={{ marginLeft: "auto", fontSize: "11px", display: "flex", alignItems: "center", gap: "8px" }}>
                              {question.author.name} · {question.createdAt}
                              {/* 只有问题作者才能看到删除按钮 */}
                              {currentUser && question.author.id === currentUser.id && (
                                <Popconfirm
                                  title="确定要删除这个问题吗？"
                                  description="删除后将无法恢复"
                                  onConfirm={() => handleDeleteQuestion(question.id)}
                                  okText="确定"
                                  cancelText="取消"
                                >
                                  <Button
                                    type="text"
                                    icon={<DeleteOutlined style={{ fontSize: "13px", color: "#ff4d4f" }} />}
                                    style={{
                                      padding: "4px 8px",
                                      fontSize: "12px",
                                      color: "#ff4d4f",
                                      borderRadius: "6px",
                                      transition: "all 0.3s ease",
                                      '&:hover': {
                                        background: "rgba(255, 77, 79, 0.1)",
                                        color: "#ff4d4f",
                                        transform: "translateY(-1px)"
                                      }
                                    }}
                                  >
                                    删除
                                  </Button>
                                </Popconfirm>
                              )}
                            </span>
                          </div>
                          {question.answer && (
                            <div style={{
                              marginTop: "8px",
                              padding: "8px",
                              background: "#f0f9ff",
                              borderRadius: "6px",
                              borderLeft: "3px solid #40a9ff"
                            }}>
                              <div style={{ 
                                fontSize: "12px", 
                                color: "#666",
                                marginBottom: "3px"
                              }}>
                                <strong>回答：</strong>{question.answeredBy}
                              </div>
                              <div style={{ 
                                fontSize: "13px", 
                                color: "#333",
                                lineHeight: "1.4",
                                ...(question.isExpanded ? {} : {
                                  display: "-webkit-box",
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: "vertical",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis"
                                })
                              }} dangerouslySetInnerHTML={{ __html: question.answer.replace(/\n/g, '<br>') }} />
                              {question.answer && question.answer.split('\n').length > 2 && (
                                <Button
                                  type="text"
                                  size="small"
                                  onClick={() => toggleQuestionExpand(question.id)}
                                  style={{
                                    fontSize: "12px",
                                    color: "#1890ff",
                                    padding: 0,
                                    marginTop: "6px"
                                  }}
                                >
                                  {question.isExpanded ? "收起" : "展开"}
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
              {/* 分页组件 */}
              <div style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "24px",
                paddingTop: "16px",
                borderTop: "1px solid #f0f0f0"
              }}>
                <Pagination
                  current={currentPage}
                  pageSize={pageSize}
                  total={totalQuestions}
                  onChange={(page) => setCurrentPage(page)}
                  showSizeChanger={false}
                  showTotal={(total) => `共 ${total} 个讨论`}
                  style={{
                    borderRadius: "8px",
                    overflow: "hidden"
                  }}
                  itemStyle={{
                    borderRadius: "4px",
                    margin: "0 4px"
                  }}
                  prevIcon={<span style={{ fontSize: "16px" }}>‹</span>}
                  nextIcon={<span style={{ fontSize: "16px" }}>›</span>}
                />
              </div>
            </>
          ) : (
            <div style={{
              textAlign: "center",
              padding: "60px 20px",
              background: "#fafbfc",
              borderRadius: "16px",
              border: "2px dashed #e5e7eb"
            }}>
              <div style={{ fontSize: "48px", marginBottom: "16px", opacity: 0.5 }}>
                💬
              </div>
              <h3 style={{ color: "#6b7280", marginBottom: "8px" }}>
                暂无讨论
              </h3>
              <p style={{ color: "#9ca3af", marginBottom: "24px" }}>
                成为第一个提问的人吧！
              </p>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setShowAskModal(true)}
                style={{
                  borderRadius: "20px",
                  padding: "8px 24px",
                  background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                  border: "none",
                  boxShadow: "0 4px 12px rgba(139, 92, 246, 0.3)"
                }}
              >
                提出第一个问题
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* 提问模态框 */}
      <Modal
        title={
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "12px",
            color: "#1890ff"
          }}>
            <MessageOutlined style={{ fontSize: "20px" }} />
            <span style={{ fontSize: "18px", fontWeight: "600" }}>提出问题</span>
          </div>
        }
        open={showAskModal}
        onCancel={() => setShowAskModal(false)}
        footer={null}
        width={600}
        style={{
          borderRadius: "20px",
          overflow: "hidden"
        }}
        bodyStyle={{
          padding: "24px",
          background: "linear-gradient(135deg, #f9f0ff 0%, #f0f9ff 100%)"
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAskQuestion}
        >
          <Form.Item
            name="title"
            label="问题标题"
            rules={[{ required: true, message: "请输入问题标题" }, { min: 5, message: "标题至少5个字符" }]}
            style={{ marginBottom: "16px" }}
          >
            <Input 
              placeholder="请输入问题标题" 
              style={{
                borderRadius: "12px",
                height: "48px",
                fontSize: "16px",
                border: "2px solid #d3adf7",
                '&:focus': {
                  borderColor: '#8b5cf6',
                  boxShadow: '0 0 0 2px rgba(139, 92, 246, 0.2)'
                }
              }}
            />
          </Form.Item>
          
          <Form.Item
            name="moduleId"
            label="选择模块（可选）"
            style={{ marginBottom: "16px" }}
          >
            <Select 
              placeholder="选择问题对应的模块，不选则为通用问题"
              style={{
                borderRadius: "12px",
                height: "48px",
                border: "2px solid #d3adf7",
                '&:focus': {
                  borderColor: '#8b5cf6'
                }
              }}
              allowClear
            >
              {course.modules && course.modules.map(module => (
                <Select.Option key={module.id} value={module.id}>
                  {module.title}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="content"
            label="问题内容"
            rules={[{ required: true, message: "请输入问题内容" }, { min: 10, message: "内容至少10个字符" }]}
            style={{ marginBottom: "24px" }}
          >
            <TextArea 
              rows={6} 
              placeholder="请详细描述你的问题..."
              style={{
                borderRadius: "12px",
                fontSize: "16px",
                border: "2px solid #d3adf7",
                '&:focus': {
                  borderColor: '#8b5cf6',
                  boxShadow: '0 0 0 2px rgba(139, 92, 246, 0.2)'
                }
              }}
            />
          </Form.Item>
          
          <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
            <Button 
              onClick={() => setShowAskModal(false)}
              style={{
                borderRadius: "12px",
                padding: "8px 24px"
              }}
            >
              取消
            </Button>
            <Button 
              type="primary" 
              htmlType="submit"
              icon={<SendOutlined />}
              style={{
                borderRadius: "12px",
                padding: "8px 24px",
                background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                border: "none",
                boxShadow: "0 4px 12px rgba(139, 92, 246, 0.3)"
              }}
            >
              提交问题
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}