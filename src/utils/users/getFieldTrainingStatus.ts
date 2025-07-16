import { FieldTrainingType } from "@/features/users/data/schema";

export const fieldTrainingStatus: Record<number, string> = {
  0: '미취업',
  1: '현장 실습'
}

export const getFieldTrainingStatus = (field_training: FieldTrainingType[]) => {
  const now = new Date()
  
  const activeFieldTraining = field_training.filter(item => !item.deleted_at)

  const isFieldTraining = activeFieldTraining.some(({ start_date, end_date }) => {
    const startDate = new Date(start_date)
    const endDate = end_date ? new Date(end_date) : null
    
    return endDate ? now <= endDate || startDate : false
  })

  return fieldTrainingStatus[Number(isFieldTraining)]
}