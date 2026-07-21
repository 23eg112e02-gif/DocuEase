import { cn } from '../../utils/helpers.js';

const Card = ({ className = '', children, ...props }) => (
  <section className={cn('rounded-[28px] border border-white/60 bg-white/80 p-6 shadow-lg backdrop-blur-md', className)} {...props}>
    {children}
  </section>
);

export default Card;
