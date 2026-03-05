import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, Button, Typography, Spin, Alert } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import QuizComponent from "../components/QuizComponent";
import ProgrammingComponent from "../components/ProgrammingComponent";
import { getModuleDetail } from "../api/course";

const { Title, Paragraph } = Typography;

export default function ModuleContent() {
  const { courseId, moduleId } = useParams();
  const navigate = useNavigate();
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeQuizId, setActiveQuizId] = useState(null);
  const [activeProgrammingId, setActiveProgrammingId] = useState(null);

  useEffect(() => {
    const fetchContents = async () => {
      try {
        setLoading(true);
        const response = await getModuleDetail(courseId, moduleId);
        setContents(response.data.module?.contents || []);
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

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
        style={{ marginBottom: '16px' }}
      >
        返回
      </Button>

      <Title level={3}>模块内容</Title>

      {contents && contents.length > 0 ? (
        contents.map((content, index) => (
          <Card key={content.id} style={{ marginBottom: '16px' }}>
            <Title level={4}>{content.title}</Title>
            {content.description && <Paragraph style={{ color: '#999', marginBottom: '16px' }}>{content.description}</Paragraph>}
            
            {content.type === 'TEXT' && <Paragraph>{content.body}</Paragraph>}
            
            {content.type === 'VIDEO' && content.body && (
              <div>
                <video controls style={{ width: '100%', maxHeight: '500px' }}>
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
      <Button
        type="primary"
        onClick={() => setActiveQuizId(content.id)}
      >
        进入小测
      </Button>
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
      <Button
        type="primary"
        onClick={() => setActiveProgrammingId(content.id)}
      >
        进入编程题
      </Button>
    )}
  </div>
)}
            
            {!['TEXT', 'VIDEO', 'QUIZ', 'PROGRAMMING'].includes(content.type) && (
              <Alert message={`未知内容类型: ${content.type}`} type="warning" />
            )}
          </Card>
        ))
      ) : (
        <Alert message="该模块暂无内容" type="info" />
      )}
    </div>
  );
}