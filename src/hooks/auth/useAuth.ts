import { useAuthStore } from '../../store/auth.store';
import { useToast } from '../ui/useToast';
import type { AuthCredentials } from '../../types/auth';

export function useAuth() {
  const user = useAuthStore((state) => state.currentUser);
  const storeLogin = useAuthStore((state) => state.login);
  const storeLogout = useAuthStore((state) => state.logout);
  const { addToast } = useToast();

  const login = (credentials: AuthCredentials): boolean => {
    const success = storeLogin(credentials);

    if (success) {
      addToast(`¡Bienvenido, ${useAuthStore.getState().currentUser?.name}!`, 'success');
    } else {
      addToast('Correo o contraseña incorrectos.', 'error');
    }

    return success;
  };

  const logout = () => {
    storeLogout();
    addToast('Sesión cerrada.', 'info');
  };

  return {
    user,
    isAuthenticated: Boolean(user),
    login,
    logout,
  };
}
