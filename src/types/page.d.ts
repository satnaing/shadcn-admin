/**
 * 分页响应类型
 * 与Spring Boot后端分页结构匹配
 */
export interface Page<T> {
  /**
   * 当前页的内容列表
   */
  content: T[];
  
  /**
   * 分页信息
   */
  pageable: {
    /**
     * 排序信息
     */
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    /**
     * 偏移量
     */
    offset: number;
    /**
     * 每页大小
     */
    pageSize: number;
    /**
     * 当前页码
     */
    pageNumber: number;
    /**
     * 是否分页
     */
    paged: boolean;
    /**
     * 是否不分页
     */
    unpaged: boolean;
  };
  
  /**
   * 总页数
   */
  totalPages: number;
  
  /**
   * 总元素数
   */
  totalElements: number;
  
  /**
   * 本页元素数量
   */
  numberOfElements: number;
  
  /**
   * 每页大小
   */
  size: number;
  
  /**
   * 当前页码（从0开始）
   */
  number: number;
  
  /**
   * 排序信息
   */
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  
  /**
   * 是否为第一页
   */
  first: boolean;
  
  /**
   * 是否为最后一页
   */
  last: boolean;
  
  /**
   * 是否为空
   */
  empty: boolean;
} 

export interface Pageable {
  pageIndex: number;
  pageSize: number;
  sort?: string;
}