import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import DocumentTable from '../../components/dashboard/DocumentTable.jsx';
import { api } from '../../services/api.js';
import { formatDateTime } from '../../utils/formatter.js';

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ documents: [], uploads: [], stats: { documentCount: 0, uploadCount: 0 } });

  useEffect(() => {
    let mounted = true;

    api
      .get('/dashboard')
      .then((response) => {
        if (mounted) {
          setData(response.data.data);
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return <div className="p-8 text-sm text-slate-600">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent-600">Account dashboard</p>
          <h1 className="text-4xl font-bold text-ink-900">Your documents and uploads</h1>
        </div>
        <div className="flex gap-3">
          <Button as={Link} to="/documents/new">
            New document
          </Button>
          <Button as={Link} to="/uploads" variant="secondary">
            Manage uploads
          </Button>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-sm text-slate-600">Documents</p>
          <p className="mt-2 text-3xl font-bold text-ink-900">{data.stats.documentCount}</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-600">Uploads</p>
          <p className="mt-2 text-3xl font-bold text-ink-900">{data.stats.uploadCount}</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-600">Latest activity</p>
          <p className="mt-2 text-sm font-semibold text-ink-900">
            {data.documents[0] ? formatDateTime(data.documents[0].updatedAt) : 'No activity yet'}
          </p>
        </Card>
      </section>

      <DocumentTable documents={data.documents} />

      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ink-900">Upload history</h2>
          <Button as={Link} to="/uploads" variant="secondary" className="px-3 py-1.5 text-xs">
            View all
          </Button>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {data.uploads.map((upload) => (
            <Card key={upload._id} className="p-4">
              <p className="font-semibold text-ink-900">{upload.originalName}</p>
              <p className="text-sm text-slate-600">{upload.fileType}</p>
              <p className="mt-2 text-xs text-slate-500">{formatDateTime(upload.createdAt)}</p>
            </Card>
          ))}
          {!data.uploads.length ? <p className="text-sm text-slate-500">No uploads yet.</p> : null}
        </div>
      </Card>
    </div>
  );
};

export default DashboardPage;
