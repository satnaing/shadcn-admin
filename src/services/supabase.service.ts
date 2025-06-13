import { SupabaseClient, createClient } from "@supabase/supabase-js";
import { supabaseConfig } from "@/config/supabase.config";

export class SupabaseInstance {
  private static instance: SupabaseClient;

  public static getSupabase(): SupabaseClient {
    if (!SupabaseInstance.instance) {
      SupabaseInstance.instance = createClient(
        supabaseConfig.supabaseUrl,
        supabaseConfig.supabaseKey
      );
    }
    return SupabaseInstance.instance;
  }
}
