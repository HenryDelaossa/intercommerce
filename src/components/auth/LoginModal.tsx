import { useState, type FormEvent } from 'react';
import { useAuth } from '../../hooks/auth/useAuth';
import { useCheckout } from '../../hooks/cart/useCheckout';
import { useUiStore } from '../../store/ui.store';
import { DUMMY_USERS } from '../../constants/dummyUsers';
import { Button } from '../ui/Button';

export function LoginModal() {
  const isOpen = useUiStore((state) => state.isLoginModalOpen);
  const closeLoginModal = useUiStore((state) => state.closeLoginModal);
  const { login } = useAuth();
  const { startCheckout, pendingCheckout, setPendingCheckout } = useCheckout();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleClose = () => {
    setError(null);
    setPendingCheckout(false);
    closeLoginModal();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const success = login({ email, password });
    if (!success) {
      setError('Correo o contraseña incorrectos.');
      return;
    }

    setError(null);
    setEmail('');
    setPassword('');
    closeLoginModal();

    if (pendingCheckout) {
      setPendingCheckout(false);
      void startCheckout();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Iniciar sesión"
    >
      <div className="w-full max-w-sm rounded-lg bg-brand-light p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-brand-dark">Iniciar sesión</h2>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Cerrar"
            className="text-brand-dark/60 hover:text-brand-primary"
          >
            ✕
          </button>
        </div>

        {pendingCheckout && (
          <p className="mb-3 rounded-md bg-brand-primary/10 p-2 text-sm text-brand-dark">
            Inicia sesión para confirmar tu compra.
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <label className="flex flex-col gap-1 text-sm text-brand-dark">
            Correo electrónico
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="rounded-md border border-black/10 px-3 py-2 text-sm focus:border-brand-primary focus:outline-none"
              placeholder="ana.torres@intercommerce.com"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm text-brand-dark">
            Contraseña
            <input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="rounded-md border border-black/10 px-3 py-2 text-sm focus:border-brand-primary focus:outline-none"
              placeholder="••••••••"
            />
          </label>

          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}

          <Button type="submit">Iniciar sesión</Button>
        </form>

        <div className="mt-4 rounded-md bg-black/5 p-2 text-xs text-brand-dark/70">
          <p className="mb-1 font-medium">Usuarios de prueba</p>
          <ul className="flex flex-col gap-0.5">
            {DUMMY_USERS.map((user) => (
              <li key={user.id}>
                {user.email} / {user.password}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
