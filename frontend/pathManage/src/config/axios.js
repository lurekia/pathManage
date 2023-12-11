import axios from "axios";
// 创建并配置一个新的axios
const service = axios.create({
    baseURL: 'http://localhost:11000', // 这里指所有接口请求的“请求地址前缀”，完整请求地址 = 请求地址前缀 + 接口后缀，即 url = baseURL + request url
    timeout: 60000, // 请求超时时间 毫秒
    // withCredentials: true,   // 异步请求时是否携带cookie
    headers: {   // 设置后端需要的传参类型，后端不要求，这没必要设置
        // "Content-Type": "application/json",
        //  token: token,
        //     "X-Requested-With": "XMLHttpRequest",
    },
});

// 添加请求拦截器
// service.interceptors.request.use(
//     (config) => {
//         // 在发送请求之前做些什么。。。
//         // 比如配置请求token（如果需要的话）
//         // 携带token
        
//     },
//     (error) => {
//         // 对请求错误做些什么
//         return Promise.reject(error);
//     }
// );

// // 添加响应拦截器
// service.interceptors.response.use(
//     (response) => {
//         return res;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );

export default service;
