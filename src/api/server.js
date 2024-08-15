import axios from 'axios';
import dbUtils from "utils/util.strotage";
import {ZyNotification} from "../utils/util.toast";
import router from '@/router'
// 创建 Axios 实例
const instance = axios.create({
    timeout: 8000,
    // baseURL: import.meta.env.VITE_APP_BASE_URL,
});
// 请求拦截器
instance.interceptors.request.use(
    (config) => {
        // 在请求发送之前可以进行一些处理，例如设置 token、添加请求头等
        config.headers.authorization = dbUtils.get('token')
        return config;
    },
    (error) => {
        return Promise.reject();
    }
);


// 响应拦截器
instance.interceptors.response.use(
    (response) => {
        if (response.status === 200) {
            if (response.data.status) {
                // 在接收到响应数据之前可以进行一些处理，例如解析响应数据、错误处理等
                const contentType = response.headers['content-type'];
                if (contentType === 'application/octet-stream' ||
                    contentType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
                    // 注意：Blob类型文件下载需要请求头参数添加 responseType:'blob'  下载 导出等功能需要
                    return downloadFile(response)
                } else {
                    // 响应数据是有效的 JSON 格式，继续处理
                    return Promise.resolve({
                        status: true,
                        message: 'success',
                        data: response.data?.data,
                        origin: response.data
                    });
                }
            } else {
                return Promise.resolve({
                    status: false,
                    message: 'fail',
                    data: response.data?.data,
                    origin: response.data
                });
            }

        } else {
            return handleRequestError(response)
        }

    },
    (error) => {
        // 统一处理错误
        return handleRequestError(error)
    }
);

// 下载blob二进制文件
const downloadFile = (response) => {
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const filename = response.headers['x-filename'];

    axios.get(url, {responseType: 'blob'}).then((res) => {
        const blob = new Blob([res.data]);
        if (window.navigator.msSaveBlob) {
            // 兼容 IE，使用 msSaveBlob 方法进行下载
            window.navigator.msSaveBlob(blob, decodeURIComponent(filename));
        } else {
            // 创建一个 <a> 元素
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.setAttribute('download', decodeURIComponent(filename));
            // 模拟点击下载
            link.click();
            // 清理 URL 和 <a> 元素
            link.remove();
            window.URL.revokeObjectURL(url);
        }
    });
}

// 统一处理错误
const handleRequestError = (error) => {
    // 进行错误处理
    if (error.response) {
        // 服务器响应错误
        let status = error.response.status
        // 在这里可以进行错误处理逻辑，例如弹出错误提示、记录错误日志等
        switch (status) {
            case 400:
                ZyNotification.error(error.response.data.message || '参数校验失败')
                return Promise.reject(error.response.data.message ?? '参数json解析失败');
            case 401:
                router.push({path: '/login'})
                ZyNotification.error('账号已过期,请重新登录')

                return Promise.reject({error: 'jwt expired', message: '账号已过期,请重新登录'});

            case 404:
                console.error('404:', error.response.data.message);

                ZyNotification.error(error.response.data.message || '资源不存在')
                return Promise.reject({error: '接口不存在', message: error.response.data.message});
            case 500:
                console.error('服务器内部错误:', error.response.data.message);

                ZyNotification.error('服务器内部错误')
                return Promise.reject({error: '服务器内部错误', message: error.response.data.message});
            default:
                ZyNotification.error('服务器响应错误')

                console.error('服务器响应错误:', error.response.data);
        }

    } else if (error.request) {
        // 请求未收到响应
        console.error('请求未收到响应:', error.request);
        ZyNotification.error('请求未收到响应')
        // 在这里可以进行错误处理逻辑，例如弹出错误提示、记录错误日志等
    } else {
        // 请求配置出错
        console.error('请求配置出错:', error.message);
        ZyNotification.error('请求配置出错')
        // 在这里可以进行错误处理逻辑，例如弹出错误提示、记录错误日志等
    }
}

// 封装请求方法
class AxiosService {
    constructor() {
        if (AxiosService.instance) {
            return AxiosService.instance;
        }
        AxiosService.instance = this;
    }

    // GET 请求
    get(url, params = null) {
        return instance.request({
            method: 'get',
            url,
            params,
        });
    }

    // POST 请求
    post(url, data = null, params = null, responseType) {
        return instance.request({
            method: 'post',
            url,
            data,
            params,
            responseType
        });
    }

    // PUT 请求
    put(url, data = null, params = null) {
        return instance.request({
            method: 'put',
            url,
            data,
            params,
        });
    }

    // DELETE 请求
    delete(url, params = null) {
        return instance.request({
            method: 'delete',
            url,
            params,
        });
    }

}

// 创建 AxiosService 实例
const axiosService = new AxiosService();

// 导出实例化后的 AxiosService 对象
export default axiosService;
