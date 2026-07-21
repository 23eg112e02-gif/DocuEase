import { Link } from 'react-router-dom';
import Button from '../../components/common/Button.jsx';
import Card from '../../components/common/Card.jsx';
import { useAuth } from '../../hooks/useAuth.js';

const FeatureCard = ({ title, description }) => (
  <Card className="space-y-3">
    <h3 className="text-lg font-semibold text-ink-900">{title}</h3>
    <p className="text-sm leading-6 text-slate-600">{description}</p>
  </Card>
);

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-10">
      <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div className="space-y-6">
          <span className="inline-flex rounded-full border border-accent-500/20 bg-accent-500/10 px-4 py-1 text-xs font-bold uppercase tracking-[0.25em] text-accent-600">
            Hybrid document editor
          </span>
          <h1 className="max-w-2xl text-5xl font-bold tracking-tight text-ink-900 sm:text-6xl">
            Write quickly as a guest or build a persistent document library with an account.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-slate-600">
            DocuEase keeps guest editing fully local while giving registered users document storage, uploads,
            dashboard history, and export tools backed by MongoDB.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button as={Link} to="/guest">
              Start Guest Editing
            </Button>
            <Button as={Link} to={user ? '/dashboard' : '/register'} variant="secondary">
              {user ? 'Open Dashboard' : 'Create Account'}
            </Button>
          </div>
        </div>
        <Card className="space-y-4 p-8 shadow-glow">
          <div className="rounded-3xl bg-ink-900 p-6 text-white">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Status</p>
            <p className="mt-3 text-2xl font-bold">Guest content stays local.</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Account content is protected, persisted, and exportable. Guest work never touches MongoDB.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Card className="p-4">
              <p className="text-sm font-semibold text-ink-900">Exports</p>
              <p className="text-sm text-slate-600">PDF and DOCX generation</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm font-semibold text-ink-900">Auth</p>
              <p className="text-sm text-slate-600">Secure httpOnly cookies</p>
            </Card>
          </div>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <FeatureCard title="Guest Mode" description="Open the editor immediately, write freely, and export locally without creating an account." />
        <FeatureCard title="Account Mode" description="Save documents, import files, keep a history, and resume work later from the dashboard." />
        <FeatureCard title="Deployment Ready" description="The project is split into client and server workspaces with environment files and production-friendly structure." />
      </section>
    </div>
  );
};

export default HomePage;
