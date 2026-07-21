import { cn } from '../../utils/helpers.js';

const variants = {
  primary: 'bg-accent-500 text-white shadow-glow hover:bg-accent-600',
  secondary: 'bg-white text-ink-800 border border-slate-200 hover:border-accent-500',
  ghost: 'bg-transparent text-ink-800 hover:bg-slate-100'
};

const Button = ({ className, variant = 'primary', as: Component = 'button', type = 'button', ...props }) => (
  <Component
    type={Component === 'button' ? type : undefined}
    className={cn(
      'inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2',
      variants[variant],
      className
    )}
    {...props}
  />
);

export default Button;
