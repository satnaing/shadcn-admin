import {
  type KnowledgeItem,
  MAX_FILE_COUNT,
  MAX_FILE_SIZE,
} from '../data/knowledge-types'

/**
 * 由 File 对象创建知识库条目（id / uploadedAt 在此生成，避免组件内调用不纯函数）。
 */
export function createKnowledgeItem(file: File): KnowledgeItem {
  return {
    id: crypto.randomUUID(),
    name: file.name,
    size: file.size,
    type: file.type,
    uploadedAt: Date.now(),
  }
}

/**
 * 校验文件是否符合上传规则。
 * @param file 待校验文件
 * @param allowedExtensions 允许的扩展名（不含点号，忽略大小写）
 * @returns 错误信息；通过校验时返回 null
 */
export function validateFile(
  file: File,
  allowedExtensions: string[]
): string | null {
  const ext = file.name.split('.').pop()?.toUpperCase() ?? ''
  if (!allowedExtensions.includes(ext)) {
    return `不支持 ${ext || '未知'} 格式`
  }
  if (file.size > MAX_FILE_SIZE) {
    return `文件大小不能超过 15MB`
  }
  return null
}

/**
 * 在已选文件之上继续追加新文件，应用格式 / 大小 / 数量限制。
 * @returns { accepted, errors } accepted 为合法的新增文件，errors 为被拒绝项的提示
 */
export function filterFiles(
  files: File[],
  currentCount: number,
  allowedExtensions: string[]
): { accepted: File[]; errors: string[] } {
  const accepted: File[] = []
  const errors: string[] = []

  for (const file of files) {
    if (accepted.length + currentCount >= MAX_FILE_COUNT) {
      errors.push(`最多同时上传 ${MAX_FILE_COUNT} 个文件`)
      break
    }
    const error = validateFile(file, allowedExtensions)
    if (error) {
      errors.push(`${file.name}：${error}`)
    } else {
      accepted.push(file)
    }
  }

  return { accepted, errors }
}

/**
 * 上传文件到知识库。
 * TODO: 接入真实后端时替换此实现，例如调用上传接口
 * （multipart/form-data POST），返回持久化后的条目（含 id/url 等）。
 * 组件只依赖此函数，无需改动页面。
 */
export async function uploadFile(file: File): Promise<KnowledgeItem> {
  // 模拟网络延迟
  await new Promise((resolve) => setTimeout(resolve, 600))
  return createKnowledgeItem(file)
}

/**
 * 格式化文件大小，如 1.2 MB。
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  const i = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  )
  return `${(bytes / 1024 ** i).toFixed(i === 0 ? 0 : 1)} ${units[i]}`
}
