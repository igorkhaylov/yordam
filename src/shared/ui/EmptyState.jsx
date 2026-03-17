export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {Icon && (
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#ECF7FF]">
          <Icon size={32} className="text-[#1F98FA]" />
        </div>
      )}
      <h3 className="mb-2 text-lg font-semibold text-[#071A34]">{title}</h3>
      {description && (
        <p className="mb-6 max-w-sm text-sm text-[#6D7685]">{description}</p>
      )}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="rounded-xl bg-[#1F98FA] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1780d4]"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
