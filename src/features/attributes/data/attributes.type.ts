export type AttributeItem = {
  id: number
  name: string
  values: string[]
  [key: string]: unknown
}

export type AttributeFormData = {
  name: string
  values: string[]
}
