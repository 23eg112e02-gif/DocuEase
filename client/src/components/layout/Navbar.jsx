import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import Button from '../common/Button.jsx';
import { NAV_LINKS } from '../../utils/constants.js';
import { useAuth } from '../../hooks/useAuth.js';
import { 
  FileText, User, LogOut, LayoutDashboard, 
  Upload, Menu, X, Plus, Sparkles, HardDrive
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const dropdownRef = useRef(null);
  const visibleNavLinks = user ? NAV_LINKS.filter((link) => link.to !== '/guest') : NAV_LINKS;

  useEffect(() => {
    const handleOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const handleLogout = async () => {
    setShowUserDropdown(false);
    await logout();
    navigate('/');
  };

  const getInitials = (name = '') => {
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join('') || 'U';
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md no-print">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs group-hover:bg-blue-700 transition">
              <FileText size={20} />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tight text-slate-900 leading-none">
                Docu<span className="text-blue-600">Ease</span>
              </span>
              <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase">Google Docs Clone</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 md:flex">
            {visibleNavLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Right side auth & profile */}
        <div className="flex items-center gap-3">
          {/* Quick Guest Mode button */}
          {!user ? (
            <Link
              to="/guest"
              className="hidden sm:flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-800 hover:bg-amber-100 transition"
            >
              <HardDrive size={13} />
              <span>Guest Mode</span>
            </Link>
          ) : null}

          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2 rounded-full p-1 pl-2 hover:bg-slate-100 transition border border-slate-200/80"
              >
                <span className="hidden sm:inline text-xs font-bold text-slate-700 max-w-[120px] truncate">
                  {user.name}
                </span>
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-[11px] font-black text-white">
                  {getInitials(user.name)}
                </div>
              </button>

              {showUserDropdown && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl animate-in fade-in-50 zoom-in-95 text-xs space-y-1">
                  <div className="px-3 py-2 border-b border-slate-100 mb-1">
                    <p className="font-bold text-slate-900 truncate">{user.name}</p>
                    <p className="text-slate-400 text-[11px] truncate">{user.email}</p>
                  </div>

                  <Link
                    to="/dashboard"
                    onClick={() => setShowUserDropdown(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition font-medium"
                  >
                    <LayoutDashboard size={15} />
                    <span>My Dashboard</span>
                  </Link>

                  <Link
                    to="/documents/new"
                    onClick={() => setShowUserDropdown(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition font-medium"
                  >
                    <Plus size={15} />
                    <span>New Document</span>
                  </Link>

                  <Link
                    to="/uploads"
                    onClick={() => setShowUserDropdown(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition font-medium"
                  >
                    <Upload size={15} />
                    <span>Manage Uploads</span>
                  </Link>

                  <Link
                    to="/profile"
                    onClick={() => setShowUserDropdown(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition font-medium"
                  >
                    <User size={15} />
                    <span>Account Profile</span>
                  </Link>

                  <div className="my-1 border-t border-slate-100" />

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-red-600 hover:bg-red-50 transition font-medium text-left"
                  >
                    <LogOut size={15} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" as={Link} to="/login" className="text-xs px-3 py-1.5">
                Sign In
              </Button>
              <Button as={Link} to="/register" variant="primary" className="text-xs px-3.5 py-1.5">
                Get Started
              </Button>
            </div>
          )}

          {/* Mobile hamburger menu */}
          <button
            type="button"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 md:hidden"
          >
            {showMobileMenu ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown drawer */}
      {showMobileMenu && (
        <div className="border-t border-slate-200 bg-white px-4 py-3 md:hidden space-y-2 text-xs font-semibold">
          {visibleNavLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setShowMobileMenu(false)}
              className="block rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-100"
            >
              {link.label}
            </Link>
          ))}
          {!user ? (
            <Link
              to="/guest"
              onClick={() => setShowMobileMenu(false)}
              className="block rounded-lg px-3 py-2 text-amber-800 bg-amber-50"
            >
              Open Guest Editor
            </Link>
          ) : null}
        </div>
      )}
    </header>
  );
};

export default Navbar;
