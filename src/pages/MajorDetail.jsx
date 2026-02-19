import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, Button, List, Typography, Image, Spin, Alert, Row, Col, Divider } from "antd";
import { BookOutlined, PlayCircleOutlined } from "@ant-design/icons";
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
      <div style={{ padding: 20, textAlign: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 20 }}>
        <Alert message="错误" description={error} type="error" showIcon />
      </div>
    );
  }

  if (!course) {
    return (
      <div style={{ padding: 20 }}>
        <Alert message="课程不存在" type="warning" showIcon />
      </div>
    );
  }

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      <Card>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={8}>
            {course.cover && (
              <Image
                src={`http://localhost:8000${course.cover}`}
                alt={course.title}
                style={{ width: '100%', borderRadius: '8px' }}
                placeholder={<Spin />}
              />
            )}
          </Col>
          <Col xs={24} md={16}>
            <Title level={2}>{course.title}</Title>
            {course.description && <Paragraph>{course.description}</Paragraph>}
          </Col>
        </Row>
      </Card>

      <Divider />

      <Card title={<><BookOutlined style={{ marginRight: '8px' }} />模块列表</>}>
        {course.modules && course.modules.length > 0 ? (
          <List
            dataSource={course.modules}
            renderItem={(module) => (
              <List.Item
                actions={[
                  <Button
                    type="primary"
                    icon={<PlayCircleOutlined />}
                    onClick={() => navigate(`/course/${id}/module/${module.id}`)}
                  >
                    开始学习
                  </Button>
                ]}
              >
                <List.Item.Meta
                  title={<strong>{module.title}</strong>}
                  description={module.description}
                />
              </List.Item>
            )}
          />
        ) : (
          <Alert message="暂无模块" type="info" showIcon />
        )}
      </Card>
    </div>
  );
}
