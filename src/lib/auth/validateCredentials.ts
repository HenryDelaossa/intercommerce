import type { AuthCredentials, AuthUser, AuthUserRecord } from '../../types/auth';

export function validateCredentials(
  users: AuthUserRecord[],
  credentials: AuthCredentials,
): AuthUser | null {
  const normalizedEmail = credentials.email.trim().toLowerCase();
  const match = users.find(
    (user) => user.email.toLowerCase() === normalizedEmail && user.password === credentials.password,
  );

  if (!match) return null;

  return {
    id: match.id,
    name: match.name,
    email: match.email,
    phone: match.phone,
  };
}
