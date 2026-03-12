import axios from 'axios';

const API_URL = '/api';

// Create axios instance with credentials
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

export default api;
