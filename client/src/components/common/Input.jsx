const Input = ({ label, error, className = '', ...props }) => (
  <label className="block space-y-2 text-sm text-slate-700">
    {label ? <span className="font-medium text-ink-800">{label}</span> : null}
    <input
      className={`w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm text-ink-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 ${className}`}
      {...props}
    />
    {error ? <span className="block text-xs text-rose-600">{error}</span> : null}
  </label>
);

export default Input;
