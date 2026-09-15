import type { User } from '@/types/auth.types';

export interface MockUserRecord {
  user: User;
  passwordHash: string;
}

export const MOCK_USER: MockUserRecord = {
  user: {
    id: 'usr-001',
    name: 'Administrador Principal',
    email: 'admin@example.com',
    role: 'admin',
  },
  passwordHash: 'Admin123*',
};
