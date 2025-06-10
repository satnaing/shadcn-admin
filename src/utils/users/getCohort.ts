const userStatus: Record<number, string> = {
  0: '1학년',
  1: '2학년',
  3: '3학년'
}

export const getCohort = (join_at: string): string => {
  const joinDate = new Date(join_at)
  const now = new Date()

  const joinYear  = joinDate.getFullYear()
  const nowYear = now.getFullYear()
  const nowMonth = now.getMonth() + 1

  let status = nowYear - joinYear

  if (nowMonth < 3) {
    status -= 1
  }

  return userStatus[status] ?? '졸업생'
}