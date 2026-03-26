import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import QuizComponent from "../components/QuizComponent";

export default function QuizPage() {
  const { courseId, moduleId, contentId } = useParams();
  const navigate = useNavigate();

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* 返回按钮 */}
      <div style={{ marginBottom: "24px" }}>
        <button
          onClick={() => navigate(`/course/${courseId}/module/${moduleId}`)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "none",
            border: "none",
            color: "#3b82f6",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: 600,
            padding: "0",
            transition: "color 0.3s",
          }}
          onMouseEnter={(e) => e.target.style.color = "#2563eb"}
          onMouseLeave={(e) => e.target.style.color = "#3b82f6"}
        >
          <ArrowLeftOutlined />
          返回
        </button>
      </div>

      {/* Quiz 组件 */}
      <QuizComponent
        courseId={courseId}
        moduleId={moduleId}
        contentId={contentId}
      />
    </div>
  );
}
