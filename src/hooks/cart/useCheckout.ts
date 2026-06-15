import { useCart } from './useCart';
import { useStockSync } from './useStockSync';
import { useAuth } from '../auth/useAuth';
import { useToast } from '../ui/useToast';
import { useUiStore } from '../../store/ui.store';
import { useCartStore } from '../../store/cart.store';
import { useCheckoutStore } from '../../store/checkout.store';

export function useCheckout() {
  const { clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const { syncStock } = useStockSync();

  const pendingCheckout = useUiStore((state) => state.pendingCheckout);
  const setPendingCheckout = useUiStore((state) => state.setPendingCheckout);
  const openLoginModal = useUiStore((state) => state.openLoginModal);
  const closeCart = useUiStore((state) => state.closeCart);
  const openCheckout = useUiStore((state) => state.openCheckout);
  const closeCheckout = useUiStore((state) => state.closeCheckout);

  const setCheckoutStep = useCheckoutStore((state) => state.setStep);
  const resetCheckout = useCheckoutStore((state) => state.reset);
  const setCartSnapshot = useCheckoutStore((state) => state.setCartSnapshot);

  const startCheckout = async () => {
    await syncStock();

    if (useCartStore.getState().items.length === 0) {
      addToast('Tu carrito quedó vacío tras actualizar el stock disponible.', 'info');
      return;
    }

    setCheckoutStep('address');
    openCheckout();
  };

  const confirmPurchase = () => {
    closeCart();

    if (!isAuthenticated) {
      setPendingCheckout(true);
      openLoginModal();
      return;
    }

    void startCheckout();
  };

  const completePurchase = () => {
    const snapshot = useCheckoutStore.getState().cartSnapshot;

    clearCart();

    if (snapshot) {
      useCartStore.getState().setItems(snapshot);
      setCartSnapshot(null);
    }

    closeCheckout();
    resetCheckout();
    addToast('¡Compra confirmada! Gracias por tu pedido.', 'success');
  };

  const cancelCheckout = () => {
    const snapshot = useCheckoutStore.getState().cartSnapshot;

    if (snapshot) {
      useCartStore.getState().setItems(snapshot);
      setCartSnapshot(null);
    }

    closeCheckout();
    resetCheckout();
  };

  return {
    confirmPurchase,
    completePurchase,
    startCheckout,
    cancelCheckout,
    pendingCheckout,
    setPendingCheckout,
  };
}
