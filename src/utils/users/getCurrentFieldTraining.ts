import { UserDetailType } from '@/features/users/data/schema'

export const getCurrentFieldTraining = ({
  datas,
}: {
  datas:
    | UserDetailType['field_training']
    | UserDetailType['employment_companies']
}) => {
  const activeDatas = datas.filter(item => !item.deleted_at)
  
  if (activeDatas.length === 0) return null
  
  return activeDatas.reduce((latestItem, currentItem) => {
    return new Date(currentItem.created_at) > new Date(latestItem.created_at)
      ? currentItem
      : latestItem
  })
}
