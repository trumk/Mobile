import axios from 'axios';

const BASE_URL = 'http://192.168.1.2:5000/api'; 

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

export const fetchClassTypes = async () => {
  try {
      const response = await axios.get(`${BASE_URL}/class`);
      return response.data;
  } catch (error: any) {  
      throw new Error(error.response ? error.response.data.message : 'Failed to fetch class types');
  }
};

export const fetchClassTypeDetails = async (classTypeId: string) => {
  try {
      const response = await axios.get(`${BASE_URL}/class/${classTypeId}`);
      return response.data;
  } catch (error: any) {  
      throw new Error(error.response ? error.response.data.message : 'Failed to fetch class type details');
  }
};


export const joinYogaCourse = async (courseId: string) => {
  try {
    const response = await axios.post(`${BASE_URL}/admin/courses/${courseId}/join`);
    return response.data;
  } catch (error: any) {
    console.error('Error:', error);
    throw new Error(error.response ? error.response.data.message : 'Failed to join the course');
  }
};


export const fetchCoursesBySearch = async (teacherName: string, dayOfWeek?: string | null) => {
  try {
      const params: any = {};
      if (teacherName) params.teacherName = teacherName;
      if (dayOfWeek) params.dayOfWeek = dayOfWeek;

      const response = await axios.get(`${BASE_URL}/admin/courses/search`, { params });
      return response.data;
  } catch (error: any) {
      throw new Error(error.response ? error.response.data.message : 'Failed to search courses');
  }
};


export const filterYogaCourses = async (duration: string, classType: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/admin/courses/filter`, {
      params: { duration, classType },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response ? error.response.data.message : 'Failed to filter courses');
  }
};
