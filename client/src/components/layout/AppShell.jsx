import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';

const AppShell = () => (
  <div className="docuease-shell min-h-screen text-ink-900">
    <Navbar />
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Outlet />
    </main>
  </div>
);

export default AppShell;
