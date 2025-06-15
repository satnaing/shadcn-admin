import supabase from "@/utils/supabase/client";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { UserDetailType } from "../data/schema";

export const useUserDetailQuery = (student_id: string): UseQueryResult<UserDetailType, Error> => {
  const selectUserDatas = async () => {
    const { data, error } = await supabase
      .from('student')
      .select(`student_id, name,
        departments(*),
        student_jobs(
          jobs(*)
        ),
        student_after_courses(
          grade,
          after_courses(*)
        ),
        student_certificates(
          certificates(*)
        ),
        student_competitions(
          prize,
          competitions(*)
        ),
        field_training(
          *,
          companies(*),
          jobs(*)
        ),
        student_universities(
          universities(*)
        ),
        military_services(
          *,
          military_service_statuses(military_service_status_name)
        ),
        student_middle_schools(
          *,
          middle_schools(*)
        )
      `)
      .eq('student_id', student_id)
  
      if (error) {
        console.error("Error : ", error)
      }

      return data
  }

  const selectProfileDatas = async () => {
    const { data, error } = await supabase
      .from('profile_permission')
      .select(`
        profile(
          profile_skills(
            skills!fk_profile_skills_skill_id(*)
          ),
          project_permissions (
            projects(project_id, project_name)
          )
        ) 
      `)
      .eq('student_id', student_id)

      if (error) {
        console.error("Error : ", error)
      }

      return data
  }

  const selectUserDetail = async () => {
    const userDatas = await selectUserDatas()
    const profileDatas = await selectProfileDatas()

    if (userDatas && profileDatas)
      return {
        ...userDatas[0],
        ...profileDatas[0]
      }
  }

  return useQuery({
    queryKey: [`user-${student_id}`],
    queryFn: selectUserDetail,
    staleTime: 120000,
    retry: 3
  })
}