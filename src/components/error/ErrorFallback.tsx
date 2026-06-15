import { Button } from '../ui/Button';

interface ErrorFallbackProps {
  onReset: () => void;
}

export function ErrorFallback({ onReset }: ErrorFallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-4 py-16 text-center">
      <p className="text-lg font-semibold text-brand-dark">Algo salió mal</p>
      <p className="max-w-sm text-sm text-brand-dark/60">
        Ocurrió un error inesperado al renderizar esta página. Intenta nuevamente.
      </p>
      <Button variant="primary" onClick={onReset}>
        Reintentar
      </Button>
    </div>
  );
}
