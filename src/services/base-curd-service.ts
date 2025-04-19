import { PagedModel } from "@/types/page"
import { ColumnFiltersState, PaginationState, SortingState } from "@tanstack/react-table"
import axios from '@/lib/axios'

export class BaseCrudService<T> {

    public readonly path: string

    constructor(path: string) {
        this.path = path
    }

    /**
     * 分页查询
     * @param pageable 分页参数
     * @param columnFilters 过滤条件
     * @param sorting 排序参数
     * @returns 分页查询结果
     */
    public async page(pageable: PaginationState, columnFilters: ColumnFiltersState, sorting: SortingState): Promise<PagedModel<T>> {
        // 处理过滤条件
        const filters = columnFilters.reduce((acc, filter) => {
            return { ...acc, [filter.id]: filter.value }
        }, {})

        // 处理排序参数
        const sort = sorting.length > 0
            ? sorting.map((sort) => `${sort.id},${sort.desc ? 'desc' : 'asc'}`)
            : undefined

        // 发送请求
        const response = await axios.get(this.path, {
            params: {
                ...pageable,
                ...filters,
                sort
            }
        })
        return response.data
    }

    /**
     * 根据ID获取单个实体
     * @param id 实体ID
     * @returns 实体
     */
    async getById(id: string): Promise<T> {
        const response = await axios.get(`${this.path}/${id}`)
        return response.data
    }

    /**
     * 创建实体
     * @param entity 实体
     * @returns 创建的实体
     */
    async create(entity: Partial<T>): Promise<T> {
        const response = await axios.post(this.path, entity)
        return response.data
    }

    /**
     * 更新实体
     * @param entity 实体
     * @returns 更新的实体
     */
    async update(entity: { id: string;[key: string]: any }): Promise<T> {
        const response = await axios.put(`${this.path}/${entity.id}`, entity)
        return response.data
    }

    /**
     * 删除实体
     * @param id 实体ID
     */
    async deleteById(id: string): Promise<void> {
        await axios.delete(`${this.path}/${id}`)
    }
}

