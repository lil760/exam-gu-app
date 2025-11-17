// ➜ À brancher sur ton backend. Pour l’instant, une démo locale.
export async function login({ email, password }){
    await new Promise(r => setTimeout(r, 500)); // simu réseau
    if (
      (email === 'teo.teacher@example.com' || email === 'enseignant@exemple.com') &&
      password === 'Demo@123'
    ) {
      return { ok:true, token:'fake-jwt', role:'TEACHER' };
    }
    return { ok:false, error:'Identifiants invalides.' };
  }
  
  // Quand on va  brancher le vrai backend :
  // export async function login({ email, password }) {
  //   const res = await fetch('/api/auth/login', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ email, password })
  //   });
  //   if (!res.ok) return { ok:false, error:'Identifiants invalides.' };
  //   const data = await res.json();
  //   return { ok:true, token:data.token, role:data.role };
  // }
  