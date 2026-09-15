import type { AuthResponse, LoginCredentials } from '@/types/auth.types';
import { MOCK_USER } from '@/mocks/user.mock';

export class AuthService {
  // Simula la espera de la llamada para a autenticación.
  private static readonly NETWORK_DELAY_MS = 600;

  public static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    await new Promise((resolve) => setTimeout(resolve, this.NETWORK_DELAY_MS));

    const normalizedEmail = credentials.email.trim().toLowerCase();
    const isEmailValid = normalizedEmail === MOCK_USER.user.email.toLowerCase();
    const isPasswordValid = credentials.password === MOCK_USER.passwordHash;

    if (!isEmailValid || !isPasswordValid) {
      throw new Error('Credenciales incorrectas. Por favor, verifique el correo y la contraseña.');
    }

    return {
      user: { ...MOCK_USER.user },
      token: `mock-jwt-token-${Date.now()}`,
    };
  }
}
