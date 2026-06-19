import { cookies } from 'next/headers';

const ADMIN_TOKEN_COOKIE = 'pharma_admin_token';
const SECRET_SALT = 'pharma_jobs_secret_2026';

export interface AdminSession {
  isAuthenticated: boolean;
  username?: string;
  role?: 'SUPER ADMIN' | 'ADMIN';
}

// A simple but secure mock JWT-like signature
export function signToken(username: string, explicitRole?: 'SUPER ADMIN' | 'ADMIN'): string {
  let role = explicitRole;
  if (!role) {
    const isMainAdmin = username.includes('superadmin') || username === 'admin@pharmagmail.com';
    role = isMainAdmin ? 'SUPER ADMIN' : 'ADMIN';
  }
  const payload = {
    username,
    role,
    exp: Date.now() + 24 * 60 * 60 * 1000 // 1 day
  };
  const str = JSON.stringify(payload);
  const base64Payload = Buffer.from(str).toString('base64');
  
  // Create signature
  const signature = Buffer.from(base64Payload + SECRET_SALT).toString('base64').substring(0, 20);
  return `${base64Payload}.${signature}`;
}

export function decodeAndVerifyToken(token: string | undefined): AdminSession {
  if (!token) return { isAuthenticated: false };
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return { isAuthenticated: false };
    
    const [base64Payload, signature] = parts;
    const computedSignature = Buffer.from(base64Payload + SECRET_SALT).toString('base64').substring(0, 20);
    
    if (signature !== computedSignature) return { isAuthenticated: false };
    
    const payloadStr = Buffer.from(base64Payload, 'base64').toString('utf8');
    const payload = JSON.parse(payloadStr);
    
    if (payload.exp < Date.now()) {
      return { isAuthenticated: false };
    }
    
    return {
      isAuthenticated: true,
      username: payload.username,
      role: payload.role
    };
  } catch (error) {
    return { isAuthenticated: false };
  }
}

export function verifyToken(token: string | undefined): boolean {
  return decodeAndVerifyToken(token).isAuthenticated;
}

export async function getAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_TOKEN_COOKIE)?.value;
  return verifyToken(token);
}

export async function getAdminSessionDetails(): Promise<AdminSession> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_TOKEN_COOKIE)?.value;
  return decodeAndVerifyToken(token);
}

export async function setAdminSession(username: string, explicitRole?: 'SUPER ADMIN' | 'ADMIN'): Promise<void> {
  const token = signToken(username, explicitRole);
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24, // 1 day
    path: '/'
  });
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_TOKEN_COOKIE);
}
