import service from '../server'

// 角色详情
export const rolesFindOne = (data) => {
    return service.post('/v1/admin/sys/roles/findOne', data)
}

