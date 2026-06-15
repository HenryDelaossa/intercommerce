import type { AuthUserRecord } from '../types/auth';

export const DUMMY_USERS: AuthUserRecord[] = [
  {
    id: 'usr-001',
    name: 'Ana Torres',
    email: 'ana.torres@intercommerce.com',
    password: 'Ana1234',
    phone: '+57 300 123 4567',
  },
  {
    id: 'usr-002',
    name: 'Carlos Pérez',
    email: 'carlos.perez@intercommerce.com',
    password: 'Carlos1234',
    phone: '+57 301 234 5678',
  },
  {
    id: 'usr-003',
    name: 'Lucía Gómez',
    email: 'lucia.gomez@intercommerce.com',
    password: 'Lucia1234',
    phone: '+57 302 345 6789',
  },
];
