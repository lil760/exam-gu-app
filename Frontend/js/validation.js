export function isEmail(v){ return /\S+@\S+\.\S+/.test(v); }
export function isStrongPwd(v){ return typeof v === 'string' && v.length >= 6; }
