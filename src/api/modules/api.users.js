import service from '../server'

// 用户列表
export const usersList = (data) => {
    return service.post('/v1/admin/sys/users/list', data)
}
// 用户详细信息
export const usersFindOne = (data) => {
    return service.post('/v1/admin/sys/users/findOne', data)
}

