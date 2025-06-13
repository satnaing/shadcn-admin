import { FieldTrainingType } from "@/features/users/data/schema";

export const fieldTrainingStatus: Record<number, string> = {
  0: '미취업',
  1: '현장 실습'
}

export const getFieldTrainingStatus = (field_training: FieldTrainingType[]) => {
  const now = new Date()

  const isFieldTraining = field_training.some(({ start_date, end_date }) => {
    const startDate = new Date(start_date)
    const endDate = new Date(end_date)
    
    return now <= endDate || startDate
  })

  return fieldTrainingStatus[Number(isFieldTraining)]
}