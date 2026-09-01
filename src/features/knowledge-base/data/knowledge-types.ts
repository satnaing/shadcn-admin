export type KnowledgeItem = {
  id: string
  name: string
  size: number
  type: string
  uploadedAt: number
}

export type KnowledgeDataType = 'unstructured' | 'structured' | 'multimodal'

export type KnowledgeDataTypeOption = {
  value: KnowledgeDataType
  label: string
  description: string
  formats: string[]
}

export const dataTypeOptions: KnowledgeDataTypeOption[] = [
  {
    value: 'unstructured',
    label: '非结构化数据',
    description:
      '文件的主要内容为文本和图表，如文章、报告、书籍等',
    formats: ['TXT', 'MARKDOWN', 'PDF', 'DOC', 'DOCX', 'OFD', 'WPS', 'WPT'],
  },
  {
    value: 'structured',
    label: '结构化数据',
    description:
      '文件的主要内容为结构化文本，需具备明确的字段约束，如问答总结、政策条款、数据收集等',
    formats: ['CSV', 'XLSX', 'XLS', 'ET', 'ETT'],
  },
  {
    value: 'multimodal',
    label: '多模态数据',
    description: '文件的主要内容为图片知识，如文搜图等',
    formats: ['JPG', 'JPEG', 'PNG', 'BMP', 'TIFF'],
  },
]

/** 数据上传支持的文件格式（不含点号） */
export const uploadFormats = [
  'PDF',
  'TXT',
  'DOC',
  'DOCX',
  'MARKDOWN',
  'OFD',
  'WPS',
  'WPT',
]

/** 单个文件大小上限：15MB */
export const MAX_FILE_SIZE = 15 * 1024 * 1024

/** 单次最多上传文件数 */
export const MAX_FILE_COUNT = 50
