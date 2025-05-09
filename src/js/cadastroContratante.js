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


async function verificarEmailCadastrado(email) {
    const { data, error } = await supabase
        .rpc('verificar_email_detalhado', { email_input: email });

    if (error || !data) {
        console.error('Erro ao verificar email:', error);
        return { existe: true, tabela: 'erro' };
    }

    return data;
}
async function cadastroContratantesFisico(cpfContratante, emailContratante, senhaContratante, dataNascimentoContratante) {
    try {
        const { data, error } = await supabase
            .from('contratantefisico')
            .insert([{
                cpf: cpfContratante,
                nome_usuario: null,
                email: emailContratante,
                senha: senhaContratante,
                data_cadastro: new Date().toISOString(),
                telefone: null,
                biografia: null,
                foto_perfil: null,
                datanascimento: dataNascimentoContratante
            }])
        if (error) {
            alert('O Email inserido ja foi cadastrado: ')
            return { success: false, error: error.message }
        }
        console.log('Cadastro Contratante Fisico realizado', data)
        alert('O Cadastro Contratante Fisico realizado com sucesso')
        return { success: true, error: null }
    }
    catch (err) {
        console.error('Erro inesperado', err)
        return { success: false, error: err.message }
    }
}

async function cadastroContratantesJuridico(cnpjContratante, emailContratante, senhaContratante, dataNascimentoContratante) {
    try {
        const { data, error } = await supabase
            .from('contratantejuridico')
            .insert([{
                cnpj: cnpjContratante,
                nome_usuario: null,
                email: emailContratante,
                senha: senhaContratante,
                data_cadastro: new Date().toISOString(),
                telefone: null,
                biografia: null,
                foto_perfil: null,
                datanascimento: dataNascimentoContratante
            }])
        if (error) {
            alert('O email inserido ja foi cadastrado: ')
            form.reset()
            return { success: false, error: error.message }
        }
        console.log('Cadastro Contratante Juridico realizado', data)
        alert('O Cadastro Contratante Juridico realizado com sucesso')

        return { success: true, error: null }
    }
    catch (err) {
        console.error('Erro inesperado', err)
        return { success: false, error: err.message }
    }
}
const form = document.getElementById('formcontratante')
const inputEmailContratante = document.getElementById('txtEmailContra')
const inputSenhaContrantante = document.getElementById('txtSenhaContra')
const inputConfirmarSenhaContratante = document.getElementById('txtConfirmarSenhaContra')
const inputDataNascimentoContrantante = document.getElementById('txtDataContra')

form.addEventListener('submit', async (event) => {
    event.preventDefault()

    const emailContrat = inputEmailContratante.value
    const senhaContratante = inputSenhaContrantante.value
    const confirmarSenhaContratante = inputConfirmarSenhaContratante.value
    const dataNascimentoContrat = inputDataNascimentoContrantante.value
    const documentoContratante = documentoInput.value

    let Validado = true

    if (!senhaContratante) {
        alert('por favor preencha a senha')
        Validado = false
    }
    else if (!confirmarSenhaContratante) {
        alert('preencha a confirmação da  senha')
        Validado = false
    }
    if (senhaContratante != confirmarSenhaContratante) {
        alert('as senhas nao coincidem')
        Validado = false
    }
    if (!emailContrat) {
        alert('Preencha o e-mail')
        Validado = false
    }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailContrat)) {
        alert('Por favor insira um e-mail válido');
        isValid = false;
    }
    if (!dataNascimentoContrat) {
        alert('Preencha a Data de Nascimento')
        Validado = false
    }
    if (!documentoContratante) {
        alert('Preencha o documento para CPF: 11 digitos para CNPJ 14 Digitos')
        Validado = false
    }

    if (!Validado) return

    const verificacao = await verificarEmailCadastrado(emailContrat);
    if (verificacao.existe) {
        alert(`Este email já está cadastrado como ${verificacao.tabela === 'contratantefisico' ? 'pessoa física' : 'pessoa jurídica'}`);
        return;
    }
    const documentoSemPonto = documentoContratante.replace(/\D/g, '')
    if (documentoSemPonto.length === 11) {
        await cadastroContratantesFisico(documentoContratante, emailContrat, senhaContratante, dataNascimentoContrat)
    }
    else if (documentoSemPonto.length === 14) {
        await cadastroContratantesJuridico(documentoContratante, emailContrat, senhaContratante, dataNascimentoContrat)
    }
    else {
        alert('documento inválido')
    }
})