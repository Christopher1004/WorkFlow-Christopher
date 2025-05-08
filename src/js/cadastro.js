import { createClient } from "https://esm.sh/@supabase/supabase-js";

const supabaseURL = "https://uvvquwlgbkdcnchiyqzs.supabase.co"
const supabaseChave = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2dnF1d2xnYmtkY25jaGl5cXpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0ODA2OTQsImV4cCI6MjA2MjA1NjY5NH0.SnVqdpZa1V_vjJvoupVFAXjg0_2ih7KlfUa1s3vuzhE"

const supabase = createClient(supabaseURL, supabaseChave)


async function verificarEmail(emailFree) {
    try {
        const { data, error} = await supabase
            .from('freelancer')
            .select('email')
            .eq('email', emailFree)
            .maybeSingle()
        
        if(error){
            console.error('Erro ao verificar email no banco')
            return {exists: false, error: true}
        }
        return { exists: !!data, error: false}

    }
    catch (err) {
        console.error('Erro inesperado')
        return {exists: false, error: true}
    }
}


async function cadastroDados(emailFree, senhaFree, dataNascimentoFree) {
    try {
        const { data, error } = await supabase
            .from('freelancer')
            .insert([{
                cpf: null,
                nome_usuario: null,
                email: emailFree,
                senha: senhaFree,
                data_cadastro: new Date().toISOString(),
                telefone: null,
                biografia: null,
                foto_perfil: null,
                datanascimento: dataNascimentoFree
            }])
        if(error){
            alert('O email inserido já foi cadastrado')
            form.reset()
            return {success: false, error: error.message}
        }
        console.log('Dados enviados com sucesso', data)
        return {success: true, error: null}
    }
    catch (err) {
        console.error('Erro inesperado', err)
        return { success: false, error: err.message };
    }
}
const form = document.getElementById('formfreelancer')
const inputEmail = document.getElementById('txtEmail')
const inputSenha = document.getElementById('txtSenha')
const inputConfirmarSenha = document.getElementById('tConfirmarSenha')
const inputDataNascimento = document.getElementById('txtData')

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = inputEmail.value;
    const senha = inputSenha.value;
    const confirmarSenha = inputConfirmarSenha.value;
    const dataNascimento = inputDataNascimento.value;

    let Validado = true

    if (!senha) {
        alert('por favor preencha a senha')
        Validado = false
    }
    else if (!confirmarSenha) {
        alert('preencha a confirmação da  senha')
        Validado = false
    }
    if (senha != confirmarSenha) {
        alert('as senhas nao coincidem')
        Validado = false
    }
    if(!email){
        alert('Preencha o e-mail')
        Validado = false
    }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert('Por favor insira um e-mail válido');
        isValid = false;
    }
    if(!dataNascimento){
        alert('Preencha a Data de Nascimento')
        Validado = false 
    }

    if(!Validado) return

    try{
        const {exists: emailJaExiste, error: emailError} = await (verificarEmail(email));
        if(emailError){
            alert('Ocorreu um erro ao verificar o email')
            return;
        }
        if(emailJaExiste){
            alert('Este email ja existe')
            return
        }
        const {success, error: cadastroError} = await cadastroDados(email, senha, dataNascimento)
        if(success){
            alert('Cadastro realizado')
            form.reset();
        }
    }
    catch (error){
        console.error('Erro geral:', error);
        alert('Ocorreu um erro inesperado durante o cadastro');
    }

})