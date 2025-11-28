import service from '../server'

// 登录
export const authLogin = (data) => {
    return service.post('/v1/admin/login/login', data)
}

