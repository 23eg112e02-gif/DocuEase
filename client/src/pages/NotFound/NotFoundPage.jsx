import { Link } from 'react-router-dom';
import Button from '../../components/common/Button.jsx';

const NotFoundPage = () => (
  <div className="mx-auto max-w-2xl rounded-[32px] border border-white/60 bg-white/80 p-10 text-center shadow-lg backdrop-blur-md">
    <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent-600">404</p>
    <h1 className="mt-3 text-4xl font-bold text-ink-900">Page not found</h1>
    <p className="mt-4 text-sm text-slate-600">The page you requested does not exist.</p>
    <div className="mt-6 flex justify-center gap-3">
      <Button as={Link} to="/">
        Go home
      </Button>
    </div>
  </div>
);

export default NotFoundPage;
