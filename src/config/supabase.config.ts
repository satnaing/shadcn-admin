export const supabaseConfig = {
  supabaseUrl:
    (import.meta.env.VITE_SUPABASE_URL as string) ||
    'https://llurgvtfxepirowqieqi.supabase.co',
  supabaseKey:
    (import.meta.env.VITE_SUPABASE_KEY as string) ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxsdXJndnRmeGVwaXJvd3FpZXFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTAzODc5MjAsImV4cCI6MjAwNTk2MzkyMH0.dWmZWZXkBeCvn2KJ9L6nnm-pIqbytQAnc3Y9ZH8_8VI',
}
