/**
 * 分页响应类型
 * 与Spring Boot后端分页结构匹配
 */
export interface PagedModel<T> {
  /**
   * 当前页的内容列表
   */
  content: T[];

  /**
   * 分页信息
   */
  page: {
    /**
    * 每页大小
    */
    size: number;

    /**
     * 当前页码（从0开始）
     */
    number: number;
    /**
     * 总页数
     */
    totalPages: number;

    /**
     * 总元素数
     */
    totalElements: number;
  }
} 
