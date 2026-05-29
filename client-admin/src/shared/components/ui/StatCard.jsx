export const StatCard = ({ label, value, hint, accent }) => (
  <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5 shadow-sm">
    <p className="text-xs uppercase tracking-wider text-[var(--text-muted)]">{label}</p>
    <p className={`mt-2 text-2xl font-bold ${accent || 'text-[var(--text-h)]'}`}>{value}</p>
    {hint && <p className="mt-1 text-xs text-[var(--text-muted)]">{hint}</p>}
  </div>
);
