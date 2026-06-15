import { useUiStore } from '../../store/ui.store';
import { useBuyNow } from '../../hooks/cart/useBuyNow';
import { Button } from '../ui/Button';

export function BuyNowConfirmModal() {
  const isOpen = useUiStore((state) => state.isBuyNowModalOpen);
  const { pendingBuyNowItem, confirmIncludeCart, confirmOnlyThisItem, cancelBuyNow } = useBuyNow();

  if (!isOpen || !pendingBuyNowItem) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Confirmar compra"
    >
      <div className="w-full max-w-sm rounded-lg bg-brand-light p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-brand-dark">Ya tienes productos en tu carrito</h2>
        <p className="mt-2 text-sm text-brand-dark/70">
          ¿Quieres incluirlos en esta compra junto con "{pendingBuyNowItem.title}", o comprar solo
          este producto?
        </p>

        <div className="mt-4 flex flex-col gap-2">
          <Button onClick={confirmIncludeCart}>Incluir mi carrito y este producto</Button>
          <Button variant="secondary" onClick={confirmOnlyThisItem}>
            Comprar solo este producto
          </Button>
          <Button variant="ghost" onClick={cancelBuyNow}>
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
}
