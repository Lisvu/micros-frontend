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