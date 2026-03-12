import { useEffect, useState } from "react";
import { Card, Button, Spin, Alert, message, Modal, List, Badge } from "antd";
import Editor from '@monaco-editor/react';
import { getProgrammingInfo, submitProgramming, getProgrammingSubmissionStatus, getProgrammingHistory } from "../api/course";

export default function ProgrammingComponent({ courseId, moduleId, contentId, onProgressUpdate }) {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [code, setCode] = useState('');
  const language = 'python';
  const [result, setResult] = useState(null);
  const [historyVisible, setHistoryVisible] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

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
        language: res.data.language
      });
      
      message.success('获取判题结果成功');
    } catch (err) {
      console.error('获取判题结果错误:', err);
      console.error('错误详情:', err.response?.data || err.message);
      message.error(`获取判题结果失败: ${err.message}`);
    }
  };

  // 获取编程题提交历史
  const fetchProgrammingHistory = async () => {
    try {
      setHistoryLoading(true);
      const res = await getProgrammingHistory(courseId, moduleId, contentId);
      if (res.data.error) {
        message.error(res.data.error);
        return;
      }
      setHistoryData(res.data.history || []);
      setHistoryVisible(true);
    } catch (err) {
      console.error('获取编程题提交历史错误:', err);
      message.error('获取提交历史失败');
    } finally {
      setHistoryLoading(false);
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
          <span style={{ marginLeft: 8 }}>Python</span>
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
          <Button onClick={fetchProgrammingHistory}>
            查看历史提交
          </Button>
        </div>

        {result && (
          <div style={{ marginTop: 12 }}>
            <strong>评测结果:</strong>
            <div style={{ background: '#f6f8fa', padding: 12, borderRadius: 4, marginTop: 8 }}>
              <div style={{ marginBottom: 4 }}>状态: <span style={{ color: result.status === 'AC' ? '#52c41a' : result.status === 'WA' ? '#faad14' : '#1890ff' }}>{result.status === 'AC' ? '答案正确' : result.status === 'WA' ? '错误' : '正在判题中'}</span></div>
              {result.score !== undefined && (
                <div style={{ marginBottom: 4 }}>分数: <span style={{ fontWeight: 'bold' }}>{result.score}</span></div>
              )}
              <div style={{ marginBottom: 4 }}>提交ID: {result.submission_id}</div>
              {result.language && (
                <div>语言: {result.language}</div>
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
      
      {/* 历史提交记录模态框 */}
      <Modal
        title="编程题提交历史"
        open={historyVisible}
        onCancel={() => setHistoryVisible(false)}
        footer={[
          <Button key="close" onClick={() => setHistoryVisible(false)}>
            关闭
          </Button>
        ]}
        width={800}
      >
        {historyLoading ? (
          <div style={{ textAlign: 'center', padding: 20 }}>
            <Spin />
          </div>
        ) : historyData.length > 0 ? (
          <List
            dataSource={historyData}
            locale={{ emptyText: '暂无提交记录' }}
            renderItem={(item, index) => (
              <List.Item>
                <List.Item.Meta
                  title={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>提交 #{historyData.length - index}</span>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Badge 
                          status={item.status === 'AC' ? 'success' : item.status === 'WA' ? 'warning' : 'processing'} 
                          text={item.status === 'AC' ? '答案正确' : item.status === 'WA' ? '错误' : '正在判题中'}
                        />
                        <span style={{ marginLeft: 16, fontSize: '14px', color: '#666' }}>分数: {item.score}</span>
                        <span style={{ marginLeft: 16, fontSize: '14px', color: '#666' }}>语言: {item.language}</span>
                      </div>
                    </div>
                  }
                  description={
                    <div>
                      <div style={{ marginBottom: 8, fontSize: '12px', color: '#999' }}>
                        提交时间: {new Date(item.created_at).toLocaleString()}
                      </div>
                      <div style={{ padding: 8, backgroundColor: '#f5f5f5', borderRadius: 4, fontFamily: 'monospace', fontSize: '13px', whiteSpace: 'pre-wrap', maxHeight: '200px', overflowY: 'auto' }}>
                        {item.code}
                      </div>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        ) : (
          <div style={{ textAlign: 'center', padding: 40 }}>
            暂无提交记录
          </div>
        )}
      </Modal>
    </div>
  );
}
