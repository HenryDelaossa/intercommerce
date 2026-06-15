interface EmptyStateProps {
  title: string;
  description?: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16 text-center text-brand-dark">
      <p className="text-lg font-semibold">{title}</p>
      {description && <p className="text-sm text-brand-dark/60">{description}</p>}
    </div>
  );
}
