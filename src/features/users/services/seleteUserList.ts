import { useQuery } from "@tanstack/react-query";
import supabase from "@/utils/supabase/client";
import { User } from "../data/schema";
import { getCohort } from "@/utils/users/getCohort";
import { getFieldTrainingStatus } from "@/utils/users/getFieldTrainingStatus";

const seleteUserList = async () => {
  const { data, error } = await supabase
    .schema('student')
    .from('student')
    .select(`student_id, name, join_at, email, phone,
      field_training(*)`)

  if (error) {
    throw new Error(error.message)
  }
  
  const returnData: User[] = data.map(student => ({
    student_id: student.student_id,
    name: student.name,
    join_at: getCohort(student.join_at),
    email: student.email ?? '',
    phone: student.phone,
    user_status: getFieldTrainingStatus(student.field_training)
  }))

  return returnData
}

export const useUserListQuery = () => {
  return useQuery({
    queryKey: ['students'],
    queryFn: seleteUserList,
    staleTime: 60000,
    retry: 3
  })
}