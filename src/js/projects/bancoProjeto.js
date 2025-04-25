import { createClient } from "@supabase/supabase-js";

const supabaseURL = "https://tgbgsvnbrwrmzckrhsff.supabase.co"
const supabaseChave = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnYmdzdm5icndybXpja3Joc2ZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1MzE1NTcsImV4cCI6MjA2MTEwNzU1N30.lIzmyDuS4eME-PaorxEg-hKbD12JkVCwicyQCwCm-ug"

const supabase = createClient(supabaseURL, supabaseChave)