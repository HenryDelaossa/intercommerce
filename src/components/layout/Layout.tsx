import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { CartDrawer } from '../cart/CartDrawer';
import { LoginModal } from '../auth/LoginModal';
import { BuyNowConfirmModal } from '../cart/BuyNowConfirmModal';
import { CheckoutModal } from '../checkout/CheckoutModal';
import { ToastContainer } from '../toast/ToastContainer';
import { ErrorBoundary } from '../error/ErrorBoundary';
import { ScrollToTop } from '../ui/ScrollToTop';
import { useStockSync } from '../../hooks/cart/useStockSync';
import { useUiStore } from '../../store/ui.store';

export function Layout() {
  const location = useLocation();
  const { syncStock } = useStockSync();
  const startDragging = useUiStore((state) => state.startDragging);
  const stopDragging = useUiStore((state) => state.stopDragging);
  const droppedRef = useRef(false);

  useEffect(() => {
    void syncStock();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onDragStart = () => {
      droppedRef.current = false;
      startDragging();
    };
    const onDrop = () => {
      droppedRef.current = true;
    };
    const onDragEnd = () => {
      stopDragging(droppedRef.current);
    };
    document.addEventListener('dragstart', onDragStart);
    document.addEventListener('drop', onDrop);
    document.addEventListener('dragend', onDragEnd);
    return () => {
      document.removeEventListener('dragstart', onDragStart);
      document.removeEventListener('drop', onDrop);
      document.removeEventListener('dragend', onDragEnd);
    };
  }, [startDragging, stopDragging]);

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
      <ScrollToTop />
    </div>
  );
}
