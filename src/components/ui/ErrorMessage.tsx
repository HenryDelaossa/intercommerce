import { ApiError } from '../../services/http/httpClient';
import { Button } from './Button';

interface ErrorMessageProps {
  error: unknown;
  onRetry?: () => void;
  notFoundTitle?: string;
  notFoundDescription?: string;
}

export function ErrorMessage({
  error,
  onRetry,
  notFoundTitle = 'No encontrado',
  notFoundDescription = 'El recurso que buscas no existe o fue eliminado.',
}: ErrorMessageProps) {
  const isNotFound = error instanceof ApiError && error.status === 404;

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <p className="text-lg font-semibold text-brand-dark">
        {isNotFound ? notFoundTitle : 'Algo salió mal'}
      </p>
      <p className="max-w-sm text-sm text-brand-dark/60">
        {isNotFound
          ? notFoundDescription
          : 'Ocurrió un error al cargar la información. Intenta nuevamente.'}
      </p>
      {!isNotFound && onRetry && (
        <Button variant="primary" onClick={onRetry}>
          Reintentar
        </Button>
      )}
    </div>
  );
}
