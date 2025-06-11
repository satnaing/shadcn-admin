const SCHOOL_FOUNDING_YEAR = 2021

export const getCohort = (join_at: string): string => {
  const joinDate = new Date(join_at)
  const joinYear  = joinDate.getFullYear()

  const cohort = joinYear - SCHOOL_FOUNDING_YEAR + 1

  return `${String(cohort)}기`
}