import axios from 'axios';

const api = axios.create({
  baseURL: 'https://project-production-50c0.up.railway.app/', // <-- PASTE YOUR JAVA RAILWAY LINK HERE!
  withCredentials: true, 
});

export default api;