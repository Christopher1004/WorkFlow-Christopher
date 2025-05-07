import { createClient } from 'https://esm.sh/@supabase/supabase-js';

const supabase = createClient(
  'https://uvvquwlgbkdcnchiyqzs.supabase.co',
  'SUA_CHAVE_AQUI'
);

async function loginUsuario(event) {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const senha = document.getElementById('password').value;

  if (!email || !senha) {
    alert('Por favor, preencha todos os campos.');
    return;
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    if (error) {
      alert('Erro ao fazer login: ' + error.message);
    } else {
      alert('Login bem-sucedido!');
      // Redirecionar ou realizar outras ações após o login
    }
  } catch (err) {
    console.error('Erro inesperado:', err);
    alert('Ocorreu um erro inesperado. Tente novamente.');
  }
}

document.getElementById('login-form').addEventListener('submit', loginUsuario);
