import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { CartDrawer } from '../cart/CartDrawer';
import { ToastContainer } from '../toast/ToastContainer';
import { ErrorBoundary } from '../error/ErrorBoundary';

export function Layout() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen flex-col bg-brand-light">
      <Header />
      <main className="flex-1">
        <ErrorBoundary key={location.pathname}>
          <Outlet />
        </ErrorBoundary>
      </main>
      <CartDrawer />
      <ToastContainer />
    </div>
  );
}
