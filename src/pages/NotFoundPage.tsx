import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 px-4 py-24 text-center">
      <h1 className="text-3xl font-bold text-brand-dark">404</h1>
      <p className="text-brand-dark/60">La página que buscas no existe.</p>
      <Link to="/">
        <Button variant="primary">Volver al catálogo</Button>
      </Link>
    </div>
  );
}
