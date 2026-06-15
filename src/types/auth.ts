export interface AuthUserRecord {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
}

export type AuthUser = Omit<AuthUserRecord, 'password'>;

export interface AuthCredentials {
  email: string;
  password: string;
}
