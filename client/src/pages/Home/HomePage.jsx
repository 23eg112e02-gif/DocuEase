import { Link } from 'react-router-dom';
import Button from '../../components/common/Button.jsx';
import Card from '../../components/common/Card.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { 
  FileText, Users, Download, ShieldCheck, Zap, 
  Sparkles, ArrowRight, Table, HardDrive, CheckCircle2
} from 'lucide-react';

const FeatureCard = ({ icon, title, description }) => (
  <Card className="space-y-3 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 hover:shadow-md transition p-6">
    <div className="p-3 rounded-xl bg-blue-50 text-blue-600 inline-block">
      {icon}
    </div>
    <h3 className="text-base font-bold text-slate-900">{title}</h3>
    <p className="text-xs leading-relaxed text-slate-600">{description}</p>
  </Card>
);

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-16 max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center pt-4">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-bold text-blue-700 shadow-xs">
            <Sparkles size={14} className="text-blue-600" />
            <span>Next-Gen Google Docs Clone</span>
          </div>

          <h1 className="max-w-2xl text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl sm:leading-tight">
            Create, collaborate, and export with <span className="text-blue-600">DocuEase</span>.
          </h1>

          <p className="max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            Experience effortless document editing. Write immediately in <strong>Guest Mode</strong> with 100% browser-local privacy, or log in for <strong>Cloud Persistence</strong>, multi-user real-time collaboration, and rich exports.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button as={Link} to="/guest" variant="primary" className="px-6 py-3 text-sm shadow-md hover:shadow-lg flex items-center gap-2">
              <HardDrive size={16} />
              <span>Start Guest Editing</span>
              <ArrowRight size={16} />
            </Button>
            <Button as={Link} to={user ? '/dashboard' : '/register'} variant="secondary" className="px-6 py-3 text-sm flex items-center gap-2">
              <Users size={16} />
              <span>{user ? 'Go to Dashboard' : 'Create Free Account'}</span>
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-4 text-xs font-semibold text-slate-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={16} className="text-emerald-500" /> No signup required for guests
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={16} className="text-emerald-500" /> Real-time CRDT sync
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={16} className="text-emerald-500" /> PDF & DOCX export
            </span>
          </div>
        </div>

        {/* Hero Interactive Card Preview */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl space-y-4 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-400" />
              <div className="h-3 w-3 rounded-full bg-amber-400" />
              <div className="h-3 w-3 rounded-full bg-emerald-400" />
              <span className="text-xs font-bold text-slate-700 ml-2">Project Proposal.docx</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">
              Live Sync Active
            </span>
          </div>

          <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
            <div className="h-4 w-3/4 bg-slate-200 rounded animate-pulse" />
            <div className="h-3 w-full bg-slate-200/70 rounded" />
            <div className="h-3 w-5/6 bg-slate-200/70 rounded" />
            <div className="h-20 bg-white rounded-xl border border-slate-200 p-3 shadow-2xs space-y-2">
              <div className="flex items-center gap-2">
                <Table size={14} className="text-blue-600" />
                <span className="font-bold text-slate-800">Sprint Milestones</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-[10px] text-slate-500">
                <div className="bg-slate-50 p-1.5 rounded">Core Editor &bull; Done</div>
                <div className="bg-slate-50 p-1.5 rounded">Yjs Collab &bull; Done</div>
                <div className="bg-slate-50 p-1.5 rounded">Deploy Ready &bull; Done</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="rounded-xl bg-blue-50 p-3 text-center">
              <p className="text-xs font-bold text-blue-900">Guest Mode</p>
              <p className="text-[11px] text-blue-700">Instant Local Draft</p>
            </div>
            <div className="rounded-xl bg-slate-100 p-3 text-center">
              <p className="text-xs font-bold text-slate-900">Account Mode</p>
              <p className="text-[11px] text-slate-600">MongoDB Persistent</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="space-y-6 pt-4">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Features</span>
          <h2 className="text-3xl font-extrabold text-slate-900">Everything you need from Google Docs</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            A complete suite of editing, collaboration, and export tools engineered for modern teams.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon={<HardDrive size={22} />}
            title="Hybrid Flow (Guest & Account)"
            description="Start editing in milliseconds with no barrier to entry. Easily migrate your work to a cloud account anytime."
          />
          <FeatureCard
            icon={<Users size={22} />}
            title="Real-Time Collaboration"
            description="Collaborate with team members over WebSockets with live cursor tracking, presence badges, and conflict-free CRDT sync."
          />
          <FeatureCard
            icon={<Download size={22} />}
            title="Multi-Format Exporters"
            description="Download pristine formatted PDF, Word (.docx), Plain Text (.txt), Markdown (.md), and HTML files with a single click."
          />
          <FeatureCard
            icon={<FileText size={22} />}
            title="Document Templates"
            description="Jumpstart your workflow with templates for Meeting Notes, Project Proposals, Resumes, and Weekly Status Reports."
          />
          <FeatureCard
            icon={<Table size={22} />}
            title="Rich Formatting & Tables"
            description="Format text with headings, fonts, colors, highlights, task checklists, resizable tables, and embedded images."
          />
          <FeatureCard
            icon={<Zap size={22} />}
            title="Deploy-Ready Architecture"
            description="Production-tuned for Vercel (Client) and Render (Server) with cross-origin resilience and automated token refresh."
          />
        </div>
      </section>
    </div>
  );
};

export default HomePage;
