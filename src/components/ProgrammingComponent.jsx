import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Spin, Alert, message, Badge } from "antd";
import Editor from '@monaco-editor/react';
import { getProgrammingInfo, submitProgramming, getProgrammingSubmissionStatus } from "../api/course";

export default function ProgrammingComponent({ courseId, moduleId, contentId, onProgressUpdate }) {
  const navigate = useNavigate();
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [code, setCode] = useState('');
  const language = 'python';
  const [result, setResult] = useState(null);

  const fetchInfo = async (updateLanguageAndCode = true) => {
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

      // 如果有上次提交的信息，设置result状态以显示最新的提交结果
      if (infoData.last_submission) {
        setResult({
          submission_id: infoData.last_submission.id,
          status: infoData.last_submission.status,
          score: infoData.last_submission.score,
          language: infoData.last_submission.language
        });
      }

      // 只在非轮询时更新语言和代码
      if (updateLanguageAndCode) {
        // 如果上次提交包含语言，则先确定要使用的语言
        // 优先使用上次提交的代码回填，否则使用模板
        let fillFrom = '';
        if (infoData.last_submission?.code && infoData.last_submission?.language === 'python') {
          fillFrom = infoData.last_submission.code;
        } else if (infoData.template) {
          fillFrom = infoData.template;
        }

        if (typeof fillFrom === 'object' && fillFrom !== null) {
          setCode(fillFrom[language] || '');
        } else {
          setCode(fillFrom);
        }
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


  const handleSubmit = async () => {
    if (!code || code.trim() === '') {
      message.warn('请先输入代码');
      return;
    }

    try {
      setSubmitting(true);
      // 1. 提交代码
      const payload = { code, language };
      const res = await submitProgramming(courseId, moduleId, contentId, payload);
      if (res.data.error) {
        message.error(res.data.error);
        return;
      }
      
      message.success('提交已发送，正在获取判题结果...');
      // 保存返回的语言以防后续自动填充
      if (onProgressUpdate) onProgressUpdate();
      
      // 2. 获取判题结果
      if (res.data.submission_id) {
        await fetchSubmissionResult(res.data.submission_id);
      }
    } catch (err) {
      console.error('提交编程题错误:', err);
      message.error(err.response?.data?.message || err.message || '提交失败');
    } finally {
      setSubmitting(false);
    }
  };

  // 获取判题结果
  const fetchSubmissionResult = async (submissionId) => {
    try {
      console.log('开始获取判题结果，提交ID:', submissionId);
      // 调用获取提交状态的API
      const res = await getProgrammingSubmissionStatus(submissionId);
      console.log('获取判题结果成功，返回数据:', res.data);
      if (res.data.error) {
        message.error(res.data.error);
        return;
      }
      
      // 更新结果
      setResult({
        submission_id: res.data.submission_id,
        status: res.data.status,
        score: res.data.score,
        language: res.data.language,
        failed_case: res.data.failed_case
      });
      
      message.success('获取判题结果成功');
    } catch (err) {
      console.error('获取判题结果错误:', err);
      console.error('错误详情:', err.response?.data || err.message);
      message.error(`获取判题结果失败: ${err.message}`);
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
    <div>
      <Card title={info.title || '编程题'} style={{ fontSize: '16px' }}>
        {info.description && (
          <div style={{ marginBottom: 16, fontSize: '16px', lineHeight: '1.6' }} dangerouslySetInnerHTML={{ __html: info.description }} />
        )}

        {info.sample_input && (
          <div style={{ marginBottom: 12 }}>
            <strong style={{ fontSize: '16px' }}>示例输入:</strong>
            <pre style={{ background: '#1e1e1e', padding: 12, fontSize: '16px', lineHeight: '1.5', color: '#d4d4d4', borderRadius: 8, border: '1px solid #333' }}>{info.sample_input}</pre>
          </div>
        )}

        {info.sample_output && (
          <div style={{ marginBottom: 12 }}>
            <strong style={{ fontSize: '16px' }}>示例输出:</strong>
            <pre style={{ background: '#1e1e1e', padding: 12, fontSize: '16px', lineHeight: '1.5', color: '#d4d4d4', borderRadius: 8, border: '1px solid #333' }}>{info.sample_output}</pre>
          </div>
        )}

        <div style={{ marginBottom: 12 }}>
          <strong style={{ fontSize: '16px' }}>语言:</strong>
          <span style={{ marginLeft: 8, fontSize: '16px' }}>Python</span>
        </div>

        <div style={{ border: '1px solid #333', borderRadius: 4, overflow: 'hidden', backgroundColor: '#1e1e1e' }}>
          <Editor
            height="360px"
            defaultLanguage={language}
            language={language}
            value={code}
            onChange={(val) => setCode(val || '')}
            options={{ minimap: { enabled: false }, fontSize: 18, wordWrap: 'on', theme: 'vs-dark' }}
          />
        </div>

        <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
          <Button type="primary" onClick={handleSubmit} loading={submitting}>
            提交代码
          </Button>
          <Button onClick={() => {
            // 恢复模板时也要考虑语言和模板可能是按语言存储的对象
            if (info) {
              let t = info.template || '';
              if (typeof t === 'object' && t !== null) {
                setCode(t[language] || '');
              } else {
                setCode(t);
              }
            }
          }}>恢复模板</Button>
          <Button onClick={() => navigate(`/programming/history/${courseId}/${moduleId}/${contentId}`)}>
            查看历史提交
          </Button>
        </div>

        {result && (
          <div style={{ marginTop: 16 }}>
            <strong style={{ fontSize: '16px' }}>评测结果:</strong>
            <div style={{ background: '#f6f8fa', padding: 16, borderRadius: 8, marginTop: 8, fontSize: '16px' }}>
              <div style={{ marginBottom: 8 }}>状态: <span style={{ color: result.status === 'AC' ? '#52c41a' : result.status === 'WA' ? '#faad14' : '#1890ff', fontSize: '16px' }}>{result.status === 'AC' ? '答案正确' : result.status === 'WA' ? '错误' : '正在判题中'}</span></div>
              {result.score !== undefined && (
                <div style={{ marginBottom: 8 }}>分数: <span style={{ fontWeight: 'bold', fontSize: '16px' }}>{result.score}</span></div>
              )}
              <div style={{ marginBottom: 8 }}>提交ID: <span style={{ fontSize: '16px' }}>{result.submission_id}</span></div>
              {result.language && (
                <div style={{ marginBottom: 8 }}>语言: <span style={{ fontSize: '16px' }}>{result.language}</span></div>
              )}
              {result.failed_case && (
                <div style={{
                  marginTop: 16,
                  padding: 20,
                  backgroundColor: '#fff5f5',
                  borderRadius: 12,
                  border: '2px solid #fed7d7',
                  boxShadow: '0 2px 8px rgba(220, 38, 38, 0.1)'
                }}>
                  <div style={{
                    marginBottom: 16,
                    paddingBottom: 12,
                    borderBottom: '1px solid #fed7d7'
                  }}>
                    <h5 style={{ 
                      margin: 0, 
                      color: '#c53030',
                      fontSize: '18px',
                      fontWeight: 600
                    }}>
                      错误测试用例
                    </h5>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <div style={{
                      display: 'inline-block',
                      padding: '6px 16px',
                      backgroundColor: '#fee2e2',
                      borderRadius: '20px',
                      fontSize: '16px',
                      color: '#b91c1c',
                      fontWeight: 500
                    }}>
                      测试用例 ID: {result.failed_case.id}
                    </div>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <div style={{
                      marginBottom: 8,
                      fontSize: '16px',
                      fontWeight: 600,
                      color: '#1f2937'
                    }}>
                      输入
                    </div>
                    <div style={{
                      backgroundColor: '#1e1e1e',
                      padding: 16,
                      borderRadius: 8,
                      border: '1px solid #333',
                      fontFamily: 'monospace',
                      fontSize: '18px',
                      fontWeight: 'bold',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-all',
                      lineHeight: '1.5',
                      color: '#d4d4d4'
                    }}>
                      {result.failed_case.input}
                    </div>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <div style={{
                      marginBottom: 8,
                      fontSize: '16px',
                      fontWeight: 600,
                      color: '#1f2937'
                    }}>
                      预期输出
                    </div>
                    <div style={{
                      backgroundColor: '#1e1e1e',
                      padding: 16,
                      borderRadius: 8,
                      border: '1px solid #333',
                      fontFamily: 'monospace',
                      fontSize: '18px',
                      fontWeight: 'bold',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-all',
                      lineHeight: '1.5',
                      color: '#98d982'
                    }}>
                      {result.failed_case.expected_output}
                    </div>
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <div style={{
                      marginBottom: 8,
                      fontSize: '16px',
                      fontWeight: 600,
                      color: '#1f2937'
                    }}>
                      实际输出
                    </div>
                    <div style={{
                      backgroundColor: '#1e1e1e',
                      padding: 16,
                      borderRadius: 8,
                      border: '1px solid #333',
                      fontFamily: 'monospace',
                      fontSize: '18px',
                      fontWeight: 'bold',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-all',
                      lineHeight: '1.5',
                      color: '#f87171'
                    }}>
                      {result.failed_case.actual_output || '无输出'}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {info.last_submission && (
          <div style={{ marginTop: 12 }}>
            <strong>上次提交:</strong>
            <div style={{ background: '#f0f2f5', padding: 12, borderRadius: 4, marginTop: 8 }}>
              <div style={{ marginBottom: 4 }}>状态: <span style={{ color: info.last_submission.status === 'AC' ? '#52c41a' : info.last_submission.status === 'WA' ? '#faad14' : '#1890ff' }}>{info.last_submission.status === 'AC' ? '答案正确' : info.last_submission.status === 'WA' ? '错误' : '正在判题中'}</span></div>
              {info.last_submission.score !== undefined && (
                <div style={{ marginBottom: 4 }}>分数: <span style={{ fontWeight: 'bold' }}>{info.last_submission.score}</span></div>
              )}
              <div>语言: {info.last_submission.language}</div>
            </div>
          </div>
        )}
      </Card>
      

    </div>
  );
}