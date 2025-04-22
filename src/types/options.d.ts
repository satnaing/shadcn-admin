/**
 * 通用选项接口
 * 用于下拉选择框等UI组件的数据传输
 * 与后端OptionDTO对应
 */
export interface Option {
  /**
   * 选项值
   */
  value: any
  
  /**
   * 选项标签
   */
  label: string
  
  /**
   * 选项分组（可选）
   */
  group?: string
  
  /**
   * 是否禁用（可选）
   */
  disabled?: boolean
} 