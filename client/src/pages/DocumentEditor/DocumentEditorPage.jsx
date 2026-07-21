import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Card from '../../components/common/Card.jsx';
import Input from '../../components/common/Input.jsx';
import Button from '../../components/common/Button.jsx';
import RichTextEditor from '../../editor/RichTextEditor.jsx';
import ExportActions from '../../components/export/ExportActions.jsx';
import { useDocument } from '../../hooks/useDocument.js';
import { createDocument, updateDocument } from '../../services/documentService.js';
import { exportDocx, exportPdf } from '../../services/exportService.js';
import { DOCUMENT_STATUSES } from '../../utils/constants.js';

const emptyDocument = {
  title: 'Untitled Document',
  content: '',
  status: 'draft'
};

const DocumentEditorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { document, loading } = useDocument(id);
  const [form, setForm] = useState(emptyDocument);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (document) {
      setForm({
        title: document.title || '',
        content: document.content || '',
        status: document.status || 'draft',
        source: document.source || 'manual'
      });
    }
  }, [document]);

  const updateField = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      if (id === 'new') {
        const result = await createDocument(form);
        navigate(`/documents/${result.document._id}`, { replace: true });
        setMessage('Document created');
      } else {
        await updateDocument(id, form);
        setMessage('Document saved');
      }
    } catch (error) {
      setMessage(error?.response?.data?.message || 'Unable to save document');
    } finally {
      setSaving(false);
    }
  };

  const exportPayload = {
    documentId: id !== 'new' ? id : undefined,
    title: form.title,
    content: form.content
  };

  if (loading) {
    return <div className="p-8 text-sm text-slate-600">Loading document...</div>;
  }

  return (
    <div className="space-y-6">
      <Card className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent-600">Account editor</p>
            <h1 className="text-3xl font-bold text-ink-900">{id === 'new' ? 'New document' : 'Edit document'}</h1>
            <p className="text-sm text-slate-600">Changes here are stored in MongoDB for the current account.</p>
          </div>
          <ExportActions onPdf={() => exportPdf(exportPayload)} onDocx={() => exportDocx(exportPayload)} />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Title" value={form.title} onChange={(event) => updateField('title', event.target.value)} />
          <label className="block space-y-2 text-sm text-slate-700">
            <span className="font-medium text-ink-800">Status</span>
            <select
              value={form.status}
              onChange={(event) => updateField('status', event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm text-ink-900 shadow-sm outline-none transition focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20"
            >
              {DOCUMENT_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>
        </div>
        {message ? <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">{message}</div> : null}
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save document'}
        </Button>
      </Card>

      <RichTextEditor value={form.content} onChange={(html) => updateField('content', html)} placeholder="Write your document here..." />
    </div>
  );
};

export default DocumentEditorPage;
