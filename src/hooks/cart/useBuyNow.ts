import { useAuth } from '../auth/useAuth';
import { useToast } from '../ui/useToast';
import { useCheckout } from './useCheckout';
import { useCartStore } from '../../store/cart.store';
import { useUiStore } from '../../store/ui.store';
import { useCheckoutStore } from '../../store/checkout.store';
import type { Product } from '../../types/product';

export function useBuyNow() {
  const { addToast } = useToast();
  const { isAuthenticated } = useAuth();
  const { startCheckout } = useCheckout();

  const setPendingCheckout = useUiStore((state) => state.setPendingCheckout);
  const openLoginModal = useUiStore((state) => state.openLoginModal);
  const openBuyNowModal = useUiStore((state) => state.openBuyNowModal);
  const closeBuyNowModal = useUiStore((state) => state.closeBuyNowModal);

  const pendingBuyNowItem = useCheckoutStore((state) => state.pendingBuyNowItem);
  const setPendingBuyNowItem = useCheckoutStore((state) => state.setPendingBuyNowItem);
  const setCartSnapshot = useCheckoutStore((state) => state.setCartSnapshot);

  const proceedToCheckout = async () => {
    if (!isAuthenticated) {
      setPendingCheckout(true);
      openLoginModal();
      return;
    }

    await startCheckout();
  };

  const buyNow = (product: Product, quantity: number) => {
    if (product.stock <= 0 || quantity > product.stock) {
      addToast(`No hay suficiente stock disponible de ${product.title}.`, 'error');
      return;
    }

    const buyItem = {
      id: product.id,
      title: product.title,
      price: product.price,
      thumbnail: product.thumbnail,
      quantity,
      stock: product.stock,
    };

    const cartItems = useCartStore.getState().items;

    if (cartItems.length === 0) {
      useCartStore.getState().addCartItem(buyItem);
      void proceedToCheckout();
      return;
    }

    setPendingBuyNowItem(buyItem);
    openBuyNowModal();
  };

  const confirmIncludeCart = () => {
    if (!pendingBuyNowItem) return;

    useCartStore.getState().addCartItem(pendingBuyNowItem);
    setPendingBuyNowItem(null);
    closeBuyNowModal();
    void proceedToCheckout();
  };

  const confirmOnlyThisItem = () => {
    if (!pendingBuyNowItem) return;

    setCartSnapshot(useCartStore.getState().items);
    useCartStore.getState().setItems([pendingBuyNowItem]);
    setPendingBuyNowItem(null);
    closeBuyNowModal();
    void proceedToCheckout();
  };

  const cancelBuyNow = () => {
    setPendingBuyNowItem(null);
    closeBuyNowModal();
  };

  return { buyNow, confirmIncludeCart, confirmOnlyThisItem, cancelBuyNow, pendingBuyNowItem };
}
