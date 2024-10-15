import axios from 'axios';

const BASE_URL = 'http://192.168.1.16:5000/api'; 

export const login = async (username: string, password: string) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      username,
      password,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response ? error.response.data.message : 'Failed to login');
  }
};


export const register = async (username: string, email: string, password: string) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/register`, {
      username,
      email,
      password,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response ? error.response.data.message : 'Failed to register');
  }
};


export const fetchUsers = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/auth/allUser`);
    return response.data;
  } catch (error: any) {  
    throw new Error(error.response ? error.response.data.message : 'Failed to fetch users');
  }
};


export const fetchUserDetails = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/auth/user`);
    return response.data.user;
  } catch (error: any) {
    throw new Error(error.response ? error.response.data.message : 'Failed to fetch user details');
  }
};


export const fetchCourses = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/admin/courses`);
    return response.data;
  } catch (error: any) {  
    throw new Error(error.response ? error.response.data.message : 'Failed to fetch courses');
  }
};


export const fetchCourseDetails = async (courseId: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/admin/courses/${courseId}`);
    return response.data;
  } catch (error: any) {  
    throw new Error(error.response ? error.response.data.message : 'Failed to fetch course details');
  }
};


export const addYogaCourse = async (course: any) => {
  try {
    const response = await axios.post(`${BASE_URL}/admin/courses`, course);
    return response.data;
  } catch (error: any) {  
    throw new Error(error.response ? error.response.data.message : 'Failed to add course');
  }
};


export const updateYogaCourse = async (courseId: string, updatedCourse: any) => {
  try {
    const response = await axios.put(`${BASE_URL}/admin/courses/${courseId}`, updatedCourse);
    return response.data;
  } catch (error: any) {  
    throw new Error(error.response ? error.response.data.message : 'Failed to update course');
  }
};


export const deleteYogaCourse = async (courseId: string) => {
  try {
    await axios.delete(`${BASE_URL}/admin/courses/${courseId}`);
  } catch (error: any) {  
    throw new Error(error.response ? error.response.data.message : 'Failed to delete course');
  }
};


export const fetchUser = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/auth/user`);
    return response.data.user;
  } catch (error: any) {  
    throw new Error(error.response ? error.response.data.message : 'Failed to fetch user');
  }
};


export const logoutUser = async () => {
  try {
    await axios.post(`${BASE_URL}/auth/logout`);
  } catch (error: any) {  
    throw new Error(error.response ? error.response.data.message : 'Failed to log out');
  }
};


export const joinYogaCourse = async (courseId: string) => {
  try {
    const response = await axios.post(`${BASE_URL}/courses/${courseId}/join`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response ? error.response.data.message : 'Failed to join the course');
  }
};


export const searchYogaCourses = async (searchQuery: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/courses/search`, {
      params: { search: searchQuery },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response ? error.response.data.message : 'Failed to search courses');
  }
};


export const filterYogaCourses = async (courseTime: string, classType: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/courses/filter`, {
      params: { courseTime, classType },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response ? error.response.data.message : 'Failed to filter courses');
  }
};
