import clsx from 'clsx';
import { useEffect, useState } from 'react';

const SHOW_THRESHOLD = 600;

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SHOW_THRESHOLD);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Volver arriba"
      className={clsx(
        'fixed bottom-6 right-6 z-[70] flex h-10 w-10 items-center justify-center rounded-full bg-brand-primary text-brand-light shadow-lg transition-all duration-300 hover:bg-orange-600',
        visible ? 'opacity-100 translate-y-0' : 'pointer-events-none opacity-0 translate-y-4',
      )}
    >
      ↑
    </button>
  );
}
