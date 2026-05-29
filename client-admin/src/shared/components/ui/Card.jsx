export const Card = ({
  children,
  className = '',
}) => {
  return (
    <div
      className={`
        bg-[#1A1A1A]
        border border-[#333333]
        rounded-2xl
        p-5
        shadow-lg
        ${className}
      `}
    >
      {children}
    </div>
  );
};