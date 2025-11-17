import { isEmail, isStrongPwd } from './validation.js';
import { login } from './auth.js';

const form = document.getElementById('loginForm');
const emailEl = document.getElementById('email');
const pwdEl = document.getElementById('password');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = emailEl.value.trim();
  const password = pwdEl.value;

  if (!isEmail(email))  return alert('Veuillez saisir un courriel valide.');
  if (!isStrongPwd(password)) return alert('Mot de passe trop court (≥ 6).');

  const btn = form.querySelector('.btn-primary');
  const old = btn.textContent;
  btn.disabled = true; btn.textContent = 'Connexion…';

  const res = await login({ email, password });

  btn.disabled = false; btn.textContent = old;
  if (!res.ok) return alert(res.error);

  // ➜ Succès : stocke le token et redirige où tu veux
  // localStorage.setItem('token', res.token);
  window.location.href = '/enseignant/dashboard.html';
});
