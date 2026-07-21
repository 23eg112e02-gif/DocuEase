import { Link, NavLink } from 'react-router-dom';
import Button from '../common/Button.jsx';
import { NAV_LINKS } from '../../utils/constants.js';
import { useAuth } from '../../hooks/useAuth.js';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-white/60 bg-white/70 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-xl font-bold tracking-tight text-ink-900">
          DocuEase
        </Link>
        <nav className="hidden items-center gap-5 md:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-medium transition hover:text-accent-600 ${isActive ? 'text-accent-600' : 'text-slate-600'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden text-sm text-slate-600 sm:inline">{user.name}</span>
              <Button variant="secondary" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" as={Link} to="/login">
                Login
              </Button>
              <Button as={Link} to="/register">
                Register
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
