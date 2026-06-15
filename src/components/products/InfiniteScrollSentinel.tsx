import { useEffect, useRef } from 'react';
import { useIntersectionObserver } from '../../hooks/ui/useIntersectionObserver';

interface InfiniteScrollSentinelProps {
  onIntersect: () => void;
  enabled: boolean;
}

export function InfiniteScrollSentinel({ onIntersect, enabled }: InfiniteScrollSentinelProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const isIntersecting = useIntersectionObserver(sentinelRef, { rootMargin: '200px' });

  useEffect(() => {
    if (isIntersecting && enabled) {
      onIntersect();
    }
  }, [isIntersecting, enabled, onIntersect]);

  return <div ref={sentinelRef} aria-hidden="true" className="h-1 w-full" />;
}
