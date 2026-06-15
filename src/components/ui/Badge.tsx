interface BadgeProps {
  count: number;
}

export function Badge({ count }: BadgeProps) {
  if (count <= 0) return null;

  return (
    <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-primary px-1 text-xs font-bold text-brand-light">
      {count > 99 ? '99+' : count}
    </span>
  );
}
