export const PageHeader = ({
  title,
  subtitle,
  action,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

      <div>
        <h1 className="text-3xl font-bold text-white">
          {title}
        </h1>

        <p className="text-sm text-[#A6A6A6] mt-1">
          {subtitle}
        </p>
      </div>

      {action}
    </div>
  );
};