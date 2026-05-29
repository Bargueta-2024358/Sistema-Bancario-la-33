export const Input = ({
  label,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className="space-y-2">

      {label && (
        <label className="text-sm font-medium text-[#5f5342]">
          {label}
        </label>
      )}

      <input
        className={`
          w-full rounded-2xl
          border border-[#e6dccd]
          bg-white
          px-4 py-3
          text-sm text-[#3f3528]
          outline-none
          shadow-[inset_0_1px_3px_rgba(0,0,0,0.05)]
          transition-all

          focus:border-[#fada28]
          focus:ring-2
          focus:ring-[#fada28]/30

          placeholder:text-[#b3a58a]

          ${className}
        `}
        {...props}
      />

      {error && (
        <p className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};