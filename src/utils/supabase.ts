import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://vkvetbymtvtoymxrolus.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzMzc4NjYzMCwiZXhwIjoxOTQ5MzYyNjMwfQ.r1t_zxxARDuSx-1H_KXcc0IpWL-xxZXP0yQgRAhRZdM";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
