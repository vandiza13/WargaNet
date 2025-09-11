import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:4000/api', // Sesuaikan jika backend berjalan di port lain
});

API.interceptors.request.use((req) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
        req.headers.Authorization = `Bearer ${JSON.parse(userInfo).token}`;
    }
    return req;
});

export default API;
