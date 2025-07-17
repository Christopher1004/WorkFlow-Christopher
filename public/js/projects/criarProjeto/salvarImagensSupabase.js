import { createClient } from "https://esm.sh/@supabase/supabase-js";

const supabaseUrl = "https://uvvquwlgbkdcnchiyqzs.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2dnF1d2xnYmtkY25jaGl5cXpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0ODA2OTQsImV4cCI6MjA2MjA1NjY5NH0.SnVqdpZa1V_vjJvoupVFAXjg0_2ih7KlfUa1s3vuzhE"

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function uploadImagemSupabase(file, caminhoDestino) {

    if (!file || !file.name) {
        throw new Error('Arquivo inválido para upload');
    }
    const { data, error } = await supabase.storage
        .from('imagensprojeto')
        .upload(caminhoDestino, file, {
            cacheControl: '3600',
            upsert: false
        });

    if (error) throw error;

    const { data: urlData, error: urlError } = supabase.storage
        .from('imagensprojeto')
        .getPublicUrl(caminhoDestino);

    if (urlError) throw urlError;

    return urlData.publicUrl;

    return publicURL;
}
