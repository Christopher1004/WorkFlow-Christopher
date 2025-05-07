import { createClient } from "https://esm.sh/@supabase/supabase-js";

const supabaseURL = "https://uvvquwlgbkdcnchiyqzs.supabase.co"
const supabaseChave = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2dnF1d2xnYmtkY25jaGl5cXpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0ODA2OTQsImV4cCI6MjA2MjA1NjY5NH0.SnVqdpZa1V_vjJvoupVFAXjg0_2ih7KlfUa1s3vuzhE"

const supabase = createClient(supabaseURL, supabaseChave)


async function cadastroDados(emailFree, senhaFree, dataNascimentoFree) {
    try {

        const { data: emailExistente, error: erroConsulta } = await supabase
            .from('freelancer')
            .select()
            .eq('email', emailFree)
            .single()
            console.log('verificado')
        if (erroConsulta && erroConsulta.code !== 'PGRST116') {
            console.error('Erro ao consultar email:', erroConsulta);
            return false;
        }
        if (emailFree) {
            alert('Este e-mail já está cadastrado.')
            return false;
        }

        const { data, error } = await supabase
            .from('freelancer')
            .insert([{
                cpf: null,
                nome_usuario: null,
                email: emailFree,
                senha: senhaFree,
                data_cadastro: null,
                telefone: null,
                biografia: null,
                foto_perfil: null,
                datanascimento: dataNascimentoFree
            }])
        console.log('Dados enviados com sucesso', data)
        return true

    }
    catch (err) {
        console.error('Erro inesperado', err)
        return false
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

    
    if(senha == ''){
        alert('por favor preencha a senha')
        return 
    }
    else if (confirmarSenha == ''){
        alert('preencha a confirmação da  senha')
    } 
    if (senha != confirmarSenha) {
        alert('as senhas nao coincidem')
        return
    }
    const resultado = await cadastroDados(email, senha, dataNascimento)
    if (resultado) {
        alert('dados enviados com sucesso')
        form.reset();
    }

})