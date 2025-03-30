import supabase from "@/utils/supabase/client";
import { CompanySupabase } from "../data/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const insertCompany = async (newCompany: {
  newCompany: Pick<CompanySupabase, "company_name">;
}): Promise<CompanySupabase> => {
  const { data, error } = await supabase
    .schema("enum")
    .from("companies")
    .insert([newCompany.newCompany])
    .single();

  if (error) {
    console.error("Error inserting company:", error);
    throw new Error(error.message);
  }

  return data; 
};

export const useInsertCompanyMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: insertCompany,
    onSuccess: (data) => {
      console.log("Company inserted successfully:", data);
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    },
    onError: (error) => {
      console.error("Error inserting company:", error);
    },
  });

  return {
    ...mutation,
    isLoading: mutation.isPending,
  };
};
