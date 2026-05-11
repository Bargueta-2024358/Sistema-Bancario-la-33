export const Badge = ({
  active,
}) => {
  return (
    <span
      className={`
        px-3 py-1 rounded-full text-xs font-semibold
        ${
          active
            ? 'bg-green-500/20 text-green-400'
            : 'bg-red-500/20 text-red-400'
        }
      `}
    >
      {active ? 'Activo' : 'Inactivo'}
    </span>
  );
};