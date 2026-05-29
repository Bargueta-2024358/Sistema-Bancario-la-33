export const Select = ({
  label,
  error,
  children,
  className = '',
  ...props
}) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="text-sm text-[#A6A6A6]">
          {label}
        </label>
      )}

      <select
        className={`
          w-full px-4 py-3 rounded-xl
          bg-[#1A1A1A]
          border border-[#333333]
          text-[#F2F2F2]
          outline-none
          focus:border-[#fada28]
          transition-all
          ${className}
        `}
        {...props}
      >
        {children}
      </select>

      {error && (
        <p className="text-red-500 text-xs">
          {error}
        </p>
      )}
    </div>
  );
};