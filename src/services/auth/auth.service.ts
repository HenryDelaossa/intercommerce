import { AUTH_USERS_STORAGE_KEY } from '../../constants/config';
import { DUMMY_USERS } from '../../constants/dummyUsers';
import type { AuthUserRecord } from '../../types/auth';

export function seedUsers(): void {
  if (localStorage.getItem(AUTH_USERS_STORAGE_KEY)) return;
  localStorage.setItem(AUTH_USERS_STORAGE_KEY, JSON.stringify(DUMMY_USERS));
}

export function getUsers(): AuthUserRecord[] {
  const raw = localStorage.getItem(AUTH_USERS_STORAGE_KEY);
  if (!raw) return DUMMY_USERS;

  try {
    return JSON.parse(raw) as AuthUserRecord[];
  } catch {
    return DUMMY_USERS;
  }
}
