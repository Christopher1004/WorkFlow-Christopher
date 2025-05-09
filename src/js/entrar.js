import { createClient } from 'https://esm.sh/@supabase/supabase-js';

const supabase = createClient(
  'https://uvvquwlgbkdcnchiyqzs.supabase.co',
  'hbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2dnF1d2xnYmtkY25jaGl5cXpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0ODA2OTQsImV4cCI6MjA2MjA1NjY5NH0.SnVqdpZa1V_vjJvoupVFAXjg0_2ih7KlfUa1s3vuzhE'
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
    }
  } catch (err) {
    console.error('Erro inesperado:', err);
    alert('Ocorreu um erro inesperado. Tente novamente.');
  }
}

document.getElementById('login-form').addEventListener('submit', loginUsuario);

supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN' && session) {
   
    window.location.href = 'index.html'; 
  }
});
