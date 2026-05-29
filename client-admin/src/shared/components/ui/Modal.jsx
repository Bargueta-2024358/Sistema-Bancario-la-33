export const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-lg',
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={onClose}
      role="presentation"
    >
      <div
        className={`
          w-full ${maxWidth}
          max-h-[min(90vh,720px)]
          flex flex-col
          overflow-hidden
          rounded-[30px]
          border border-[#d9ccb8]
          bg-[#f4ede2]
          shadow-[0_30px_70px_rgba(0,0,0,0.12)]
          my-auto
        `}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex shrink-0 items-start justify-between border-b border-[#d9ccb8] px-6 py-4">
          <div>
            <h2 className="text-2xl font-bold text-[#3f3528]">{title}</h2>
            {subtitle && (
              <p className="mt-1 text-sm text-[#7b6b57]">{subtitle}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="ml-4 rounded-xl px-3 py-1 text-xl leading-none text-[#7b6b57] hover:bg-[#efe4d3] hover:text-[#3f3528]"
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
};
