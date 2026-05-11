export const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">

      <div className="
        w-full
        max-w-2xl
        overflow-hidden
        rounded-[30px]
        border border-[#d9ccb8]
        bg-[#f4ede2]
        shadow-[0_30px_70px_rgba(0,0,0,0.12)]
      ">

        {/* HEADER */}
        <div className="border-b border-[#d9ccb8] px-6 py-5">

          <h2 className="text-3xl font-bold text-[#3f3528]">
            {title}
          </h2>

          {subtitle && (
            <p className="mt-1 text-sm text-[#7b6b57]">
              {subtitle}
            </p>
          )}
        </div>

        {/* CONTENT */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};