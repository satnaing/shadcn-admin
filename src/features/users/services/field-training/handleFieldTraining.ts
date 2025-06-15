import supabase from "@/utils/supabase/client"
import { UserEditType } from "../../data/schema"
import { Database } from "@/utils/supabase/database.types";

type FieldTrainingInsert = Database['public']['Tables']['field_training']['Insert'];
export type FieldTrainingUpdate = Database['public']['Tables']['field_training']['Update'];

export const handleFieldTraining = async (editDataList: UserEditType) => {
  for (const editData of editDataList) {
    const data = editData.datas.field_training;

    if (!data || !data.company_id || !data.job_id || !data.start_date || !data.end_date || !data.student_id) {
      alert('누락된 현장 실습 정보가 있습니다.')
      continue
    }

    const insertData: FieldTrainingInsert = {
      student_id: data.student_id,
      company_id: data.company_id,
      job_id: data.job_id,
      lead_or_part: false,
      start_date: data.start_date,
      end_date: data.end_date,
    };

    const updateData: FieldTrainingUpdate = {
      lead_or_part: false,
      start_date: data.start_date,
      end_date: data.end_date,
      job_id: data.job_id
    };

    switch (editData.action) {
      case 'add': {
        const { error } = await supabase
          .from('field_training')
          .insert([insertData]);

        if (error) throw new Error(error.message);
        break;
      }

      case 'update': {
        const { error } = await supabase
          .from('field_training')
          .update(updateData)
          .eq('student_id', data.student_id)
          .eq('company_id', data.company_id)

        if (error) throw new Error(error.message);
        break;
      }

      case 'delete': {
        const { error } = await supabase
          .from('field_training')
          .delete()
          .eq('student_id', data.student_id)
          .eq('company_id', data.company_id)
          .eq('job_id', data.job_id);

        if (error) throw new Error(error.message);
        break;
      }
    }
  }
};