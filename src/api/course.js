import request from './request';

// 获取所有课程
export const getCourses = () => {
  return request.get('/courses');
};

// 获取课程详情（包含模块）
export const getCourseDetail = (id) => {
  return request.get(`/course/${id}`);
};

// 获取模块详情（包含内容）
export const getModuleDetail = (courseId, moduleId) => {
  return request.get(`/course/${courseId}/module/${moduleId}`);
};

// 加入课程
export const enrollCourse = (id) => {
  return request.put(`/course/${id}/enroll`);
};

// 获取用户已选课程
export const getUserCourses = () => {
  return request.get('/course/enrolled');
};

// 获取模块内容
export const getModuleContent = (courseId, moduleId) => {
  return request.get(`/course/${courseId}/module/${moduleId}`);
};

// 生成Quiz
export const generateQuiz = (courseId, moduleId, contentId) => {
  return request.post(`/course/${courseId}/module/${moduleId}/content/${contentId}/quiz`);
};

// 提交Quiz
export const submitQuiz = (courseId, moduleId, contentId, answers) => {
  return request.put(`/course/${courseId}/module/${moduleId}/content/${contentId}/quiz`, {
    answers
  });
};

// 获取编程题信息
export const getProgrammingInfo = (courseId, moduleId, contentId) => {
  return request.get(`/course/${courseId}/module/${moduleId}/content/${contentId}/programming`);
};

// 获取课程进度
export const getCourseProgress = (courseId) => {
  return request.get(`/course/${courseId}/progress`);
};

// 获取模块进度
export const getModuleProgress = (courseId, moduleId) => {
  return request.get(`/course/${courseId}/module/${moduleId}/progress`);
};

// 提交编程题代码（评判/保存）
export const submitProgramming = (courseId, moduleId, contentId, payload) => {
  return request.put(`/course/${courseId}/module/${moduleId}/content/${contentId}/programming`, payload);
};

// 获取Quiz历史最高成绩
export const getQuizHighestScore = (courseId, moduleId, contentId) => {
  return request.get(`/course/${courseId}/module/${moduleId}/content/${contentId}/quiz/highest`);
};

// 获取Quiz历史答题记录
export const getQuizHistory = (courseId, moduleId, contentId) => {
  return request.get(`/course/${courseId}/module/${moduleId}/content/${contentId}/quiz/history`);
};

// 获取课程讨论区问题列表
export const getCourseDiscussions = (courseId, params = {}) => {
  return request.get(`/courses/${courseId}/discussions`, { params });
};

// 提交讨论区问题
export const createDiscussion = (courseId, data) => {
  return request.post(`/courses/${courseId}/discussions`, data);
};

// 获取讨论区问题详情
export const getDiscussionDetail = (courseId, discussionId) => {
  return request.get(`/courses/${courseId}/discussions/${discussionId}`);
};

// 更新讨论区问题（包括回答）
export const updateDiscussion = (courseId, discussionId, data) => {
  return request.put(`/courses/${courseId}/discussions/${discussionId}`, data);
};

// 删除讨论区问题
export const deleteDiscussion = (courseId, discussionId) => {
  return request.delete(`/courses/${courseId}/discussions/${discussionId}`);
};

// 点赞讨论区问题
export const likeDiscussion = (courseId, discussionId) => {
  return request.post(`/courses/${courseId}/discussions/${discussionId}/like`);
};

// 获取编程题提交状态和分数
export const getProgrammingSubmissionStatus = (submissionId) => {
  return request.get(`/programming/submission/${submissionId}`);
};

// 获取编程题提交历史记录
export const getProgrammingHistory = (courseId, moduleId, contentId) => {
  return request.get(`/course/${courseId}/module/${moduleId}/content/${contentId}/programming/history`);
};

// 获取编程题历史最高成绩
export const getProgrammingHighestScore = (courseId, moduleId, contentId) => {
  return request.get(`/course/${courseId}/module/${moduleId}/content/${contentId}/programming/highest`);
};

// 获取模块总分
export const getModuleTotalScore = (courseId, moduleId) => {
  return request.get(`/course/${courseId}/module/${moduleId}/total-score`);
};

// 获取课程总分
export const getCourseScores = () => {
  return request.get('/course/scores');
};

// 获取课程模块分数
export const getModuleScores = (courseId) => {
  return request.get(`/course/${courseId}/module/scores`);
};

// 获取考试列表
export const getExams = () => {
  return request.get('/exams');
};

// 获取考试详情
export const getExamDetail = (examId) => {
  return request.get(`/exams/${examId}`);
};

// 报名参加考试
export const registerExam = (examId) => {
  return request.post(`/exams/${examId}/register`);
};

// 获取考试报名状态
export const getExamRegistrationStatus = (examId) => {
  return request.get(`/exams/${examId}/register/status`);
};

// 获取考试成绩
export const getExamScores = () => {
  return request.get('/exam/scores');
};

// 获取课程考试成绩
export const getCourseExamScore = (courseId) => {
  return request.get(`/exam/course/${courseId}/score`);
};