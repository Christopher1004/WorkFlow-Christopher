const documentoInput = document.getElementById('documento');

// Máscara automática durante a digitação
documentoInput.addEventListener('input', function (e) {
    let value = this.value.replace(/\D/g, '');

    // Limita o comprimento máximo
    if (value.length > 14) {
        value = value.substring(0, 14);
    }

    // Aplica máscara conforme o tamanho
    if (value.length <= 11) {
        // Formata como CPF (000.000.000-00)
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    } else {
        // Formata como CNPJ (00.000.000/0000-00)
        value = value.replace(/^(\d{2})(\d)/, '$1.$2');
        value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
        value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
        value = value.replace(/(\d{4})(\d{1,2})$/, '$1-$2');
    }

    this.value = value;
});

// Permite apenas números e teclas de controle
documentoInput.addEventListener('keydown', function (e) {
    // Permite: backspace, delete, tab, escape, enter
    if ([46, 8, 9, 27, 13].includes(e.keyCode) ||
        
        (e.keyCode === 65 && e.ctrlKey === true) ||
        (e.keyCode === 67 && e.ctrlKey === true) ||
        (e.keyCode === 86 && e.ctrlKey === true) ||
        (e.keyCode === 88 && e.ctrlKey === true) ||
        
        (e.keyCode >= 35 && e.keyCode <= 39)) {
        return;
    }
    
    if ((e.keyCode < 48 || e.keyCode > 57) && (e.keyCode < 96 || e.keyCode > 105)) {
        e.preventDefault();
    }
});


import { createClient } from "https://esm.sh/@supabase/supabase-js";

const supabaseURL = "https://uvvquwlgbkdcnchiyqzs.supabase.co"
const supabaseChave = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2dnF1d2xnYmtkY25jaGl5cXpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0ODA2OTQsImV4cCI6MjA2MjA1NjY5NH0.SnVqdpZa1V_vjJvoupVFAXjg0_2ih7KlfUa1s3vuzhE"

const supabase = createClient(supabaseURL, supabaseChave)

