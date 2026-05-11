export const Button = ({
  children,
  variant = 'primary',
  className = '',
  ...props
}) => {
  const variants = {

    primary:
      `
      bg-[#fada28]
      hover:bg-[#f2cf1d]
      text-[#3f3528]
      font-semibold
      shadow-[0_10px_25px_rgba(250,218,40,0.28)]
      `,

    secondary:
      `
      bg-white
      border border-[#d9ccb8]
      text-[#5f5342]
      hover:bg-[#f8f1e7]
      `,

    danger:
      `
      bg-[#e7b7ac]
      hover:bg-[#dda89b]
      text-[#6b2d22]
      font-medium
      `,
  };

  return (
    <button
      className={`
        px-5 py-3
        rounded-2xl
        transition-all duration-200
        hover:scale-[1.01]
        disabled:opacity-60
        disabled:cursor-not-allowed
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};