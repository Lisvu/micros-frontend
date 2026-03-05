import { useEffect, useState } from "react";
import { Card, Button, Spin, Alert, Select, message } from "antd";
import Editor from '@monaco-editor/react';
import { getProgrammingInfo, submitProgramming } from "../api/course";

const { Option } = Select;

export default function ProgrammingComponent({ courseId, moduleId, contentId }) {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [result, setResult] = useState(null);

  const fetchInfo = async () => {
    try {
      setLoading(true);
      const res = await getProgrammingInfo(courseId, moduleId, contentId);
      if (res.data.error) {
        message.error(res.data.error);
        return;
      }
      // 后端实际返回字段：code_template (旧)、code_templates (新), last_submission
      const infoData = {
        ...res.data,
        // 将 code_templates 保持原样, 旧字段 code_template 仍然可用
        template: res.data.code_templates ?? res.data.code_template ?? res.data.template ?? null,
        last_submission: res.data.last_submission ?? res.data.lastSubmission ?? null,
      };
      setInfo(infoData);

      // 优先使用上次提交的代码回填，否则使用模板
      let fillFrom = '';
      if (infoData.last_submission?.code) {
        fillFrom = infoData.last_submission.code;
      } else if (infoData.template) {
        fillFrom = infoData.template;
      }

      if (typeof fillFrom === 'object' && fillFrom !== null) {
        setCode(fillFrom[language] || '');
      } else {
        setCode(fillFrom);
      }
    } catch (err) {
      console.error('获取编程题信息错误:', err);
      message.error(err.response?.data?.message || err.message || '获取编程题信息失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, moduleId, contentId]);

  // 当语言切换并且后端返回按语言的模板时，自动替换编辑器内容为对应模板
  useEffect(() => {
    // 当语言切换，如果 info.template 是按语言的对象，则替换为对应语言模板
    if (info && info.template && typeof info.template === 'object') {
      setCode(info.template[language] || '');
    }
  }, [language, info]);

  const handleSubmit = async () => {
    if (!code || code.trim() === '') {
      message.warn('请先输入代码');
      return;
    }

    try {
      setSubmitting(true);
      const payload = { code, language };
      const res = await submitProgramming(courseId, moduleId, contentId, payload);
      if (res.data.error) {
        message.error(res.data.error);
        return;
      }
      setResult(res.data);
      message.success('提交已发送，查看结果');
    } catch (err) {
      console.error('提交编程题错误:', err);
      message.error(err.response?.data?.message || err.message || '提交失败');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 20 }}>
        <Spin />
      </div>
    );
  }

  if (!info) {
    return <Alert message="无法加载编程题" type="error" />;
  }

  return (
    <Card title={info.title || '编程题'}>
      {info.description && (
        <div style={{ marginBottom: 12 }} dangerouslySetInnerHTML={{ __html: info.description }} />
      )}

      {info.sample_input && (
        <div style={{ marginBottom: 8 }}>
          <strong>示例输入:</strong>
          <pre style={{ background: '#f6f8fa', padding: 8 }}>{info.sample_input}</pre>
        </div>
      )}

      {info.sample_output && (
        <div style={{ marginBottom: 8 }}>
          <strong>示例输出:</strong>
          <pre style={{ background: '#f6f8fa', padding: 8 }}>{info.sample_output}</pre>
        </div>
      )}

      <div style={{ marginBottom: 8 }}>
        <strong>语言:</strong>
        <Select value={language} onChange={setLanguage} style={{ width: 220, marginLeft: 8 }}>
          <Option value="python">Python</Option>
          <Option value="c">C</Option>
          <Option value="cpp">C++</Option>
          <Option value="javascript">JavaScript</Option>
          <Option value="java">Java</Option>
        </Select>
      </div>

      <div style={{ border: '1px solid #eee', borderRadius: 4, overflow: 'hidden' }}>
        <Editor
          height="360px"
          defaultLanguage={language}
          language={language}
          value={code}
          onChange={(val) => setCode(val || '')}
          options={{ minimap: { enabled: false }, fontSize: 14, wordWrap: 'on' }}
        />
      </div>

      <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
        <Button type="primary" onClick={handleSubmit} loading={submitting}>
          提交代码
        </Button>
        <Button onClick={() => { setCode(info.template || ''); }}>恢复模板</Button>
      </div>

      {result && (
        <div style={{ marginTop: 12 }}>
          <strong>评测结果:</strong>
          <pre style={{ background: '#f6f8fa', padding: 8, whiteSpace: 'pre-wrap' }}>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </Card>
  );
}
