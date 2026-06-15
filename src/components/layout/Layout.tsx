import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { CartDrawer } from '../cart/CartDrawer';
import { LoginModal } from '../auth/LoginModal';
import { BuyNowConfirmModal } from '../cart/BuyNowConfirmModal';
import { CheckoutModal } from '../checkout/CheckoutModal';
import { ToastContainer } from '../toast/ToastContainer';
import { ErrorBoundary } from '../error/ErrorBoundary';
import { useStockSync } from '../../hooks/cart/useStockSync';

export function Layout() {
  const location = useLocation();
  const { syncStock } = useStockSync();

  useEffect(() => {
    void syncStock();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-brand-light">
      <Header />
      <main className="flex-1">
        <ErrorBoundary key={location.pathname}>
          <Outlet />
        </ErrorBoundary>
      </main>
      <CartDrawer />
      <LoginModal />
      <BuyNowConfirmModal />
      <CheckoutModal />
      <ToastContainer />
    </div>
  );
}
