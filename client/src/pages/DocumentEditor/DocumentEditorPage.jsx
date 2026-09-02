import { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import RichTextEditor from '../../editor/RichTextEditor.jsx';
import PresenceStack from '../../components/editor/PresenceStack.jsx';
import ShareModal from '../../components/editor/ShareModal.jsx';
import { useDocument } from '../../hooks/useDocument.js';
import { useCollaboration } from '../../hooks/useCollaboration.js';
import { useAuth } from '../../hooks/useAuth.js';
import { createDocument, updateDocument, deleteDocument } from '../../services/documentService.js';
import { exportDocx, exportHtml, exportMd, exportPdf, exportTxt } from '../../services/exportService.js';
import { DOCUMENT_STATUSES } from '../../utils/constants.js';
import { 
  Cloud, CloudCheck, Star, Share2, ArrowLeft, 
  CheckCircle2, RefreshCw, AlertCircle, FileText
} from 'lucide-react';

const emptyDocument = {
  title: 'Untitled Document',
  content: '',
  status: 'draft'
};

const DocumentEditorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { document, loading } = useDocument(id);
  
  const [form, setForm] = useState(emptyDocument);
  const [saveStatus, setSaveStatus] = useState('Saved to Cloud'); // 'Saving...', 'Saved to Cloud', 'Unsaved changes'
  const [isStarred, setIsStarred] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [seedReady, setSeedReady] = useState(false);
  const autoSaveTimerRef = useRef(null);

  const collaborationEnabled = Boolean(id && id !== 'new' && user?.id);
  const { ydoc, provider, collaborators, connectionStatus, isSynced, collaborationUser } = useCollaboration({
    enabled: collaborationEnabled,
    documentId: id,
    user
  });

  // Sync state from server document
  useEffect(() => {
    if (document) {
      setForm({
        title: document.title || 'Untitled Document',
        content: document.content || '',
        status: document.status || 'draft',
        source: document.source || 'manual'
      });
      setSaveStatus('Saved to Cloud');
    }
  }, [document]);

  // Collaborative seeding
  useEffect(() => {
    if (!collaborationEnabled || !ydoc || !document?.content || !isSynced) {
      return;
    }

    const fragment = ydoc.getXmlFragment('default');
    setSeedReady(fragment.length === 0);
  }, [collaborationEnabled, ydoc, document?.content, isSynced]);

  // Debounced auto-save function
  const triggerAutoSave = useCallback((updatedForm) => {
    if (id === 'new') return; // Don't auto-save before initial creation
    
    setSaveStatus('Saving...');
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    autoSaveTimerRef.current = setTimeout(async () => {
      try {
        await updateDocument(id, updatedForm);
        setSaveStatus('Saved to Cloud');
      } catch (_e) {
        setSaveStatus('Error saving');
      }
    }, 1200);
  }, [id]);

  const updateField = (key, value) => {
    setForm((current) => {
      const next = { ...current, [key]: value };
      triggerAutoSave(next);
      return next;
    });
  };

  const handleManualSave = async () => {
    setSaveStatus('Saving...');
    try {
      if (id === 'new') {
        const result = await createDocument(form);
        navigate(`/documents/${result.document._id}`, { replace: true });
      } else {
        await updateDocument(id, form);
      }
      setSaveStatus('Saved to Cloud');
    } catch (_e) {
      setSaveStatus('Error saving');
    }
  };

  const handleDelete = async () => {
    if (id === 'new') {
      navigate('/dashboard');
      return;
    }

    if (window.confirm('Are you sure you want to delete this document?')) {
      await deleteDocument(id);
      navigate('/dashboard');
    }
  };

  const exportPayload = {
    documentId: id !== 'new' ? id : undefined,
    title: form.title || 'Untitled Document',
    content: form.content
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-sm text-slate-500">
        <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
        <p>Loading document from MongoDB...</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-w-7xl mx-auto px-2 sm:px-4 py-2">
      {/* Google Docs Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white px-4 py-2.5 rounded-2xl border border-slate-200/80 shadow-xs no-print">
        <div className="flex items-center gap-3 min-w-0">
          {/* Docs Icon / Back link */}
          <Link
            to="/dashboard"
            className="p-1.5 rounded-xl hover:bg-slate-100 text-blue-600 transition"
            title="Back to Dashboard"
          >
            <ArrowLeft size={18} />
          </Link>

          <div className="p-2 rounded-xl bg-blue-50 text-blue-600 hidden sm:block">
            <FileText size={20} />
          </div>

          <div className="space-y-0.5 min-w-0">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={form.title}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="Untitled document"
                className="text-base sm:text-lg font-bold text-slate-900 bg-transparent hover:bg-slate-100 focus:bg-white px-1.5 py-0.5 rounded-lg border border-transparent focus:border-blue-400 outline-none transition truncate max-w-[200px] sm:max-w-md"
              />
              <button
                type="button"
                onClick={() => setIsStarred(!isStarred)}
                className={`p-1 rounded-lg transition ${
                  isStarred ? 'text-amber-400 fill-amber-400' : 'text-slate-300 hover:text-slate-500'
                }`}
                title={isStarred ? 'Starred' : 'Star document'}
              >
                <Star size={16} fill={isStarred ? 'currentColor' : 'none'} />
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="flex items-center gap-1 font-medium text-slate-600">
                {saveStatus === 'Saving...' ? (
                  <>
                    <RefreshCw size={12} className="animate-spin text-blue-600" />
                    <span>Saving...</span>
                  </>
                ) : saveStatus === 'Saved to Cloud' ? (
                  <>
                    <CheckCircle2 size={12} className="text-emerald-500" />
                    <span>Saved to Cloud</span>
                  </>
                ) : (
                  <>
                    <AlertCircle size={12} className="text-amber-500" />
                    <span>Unsaved</span>
                  </>
                )}
              </span>

              <span>&bull;</span>

              {/* Status pill select */}
              <select
                value={form.status}
                onChange={(e) => updateField('status', e.target.value)}
                className="bg-transparent text-[11px] font-semibold uppercase tracking-wider text-slate-500 hover:text-slate-800 outline-none cursor-pointer"
              >
                {DOCUMENT_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Right side actions: Presence avatars & Share button */}
        <div className="flex items-center gap-3">
          <PresenceStack users={collaborators} />

          <button
            type="button"
            onClick={() => setIsShareModalOpen(true)}
            className="flex items-center gap-2 rounded-full bg-blue-600 hover:bg-blue-700 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:shadow-md"
          >
            <Share2 size={14} />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Full Google Docs Rich Text Editor */}
      <RichTextEditor
        value={form.content}
        onChange={(html) => updateField('content', html)}
        placeholder="Write your document here, format text, insert tables, images, checklists..."
        collaboration={{
          enabled: collaborationEnabled,
          provider,
          ydoc,
          user: collaborationUser,
          canSeed: seedReady
        }}
        onSeedApplied={() => setSeedReady(false)}
        onSave={handleManualSave}
        onExportPdf={() => exportPdf(exportPayload)}
        onExportDocx={() => exportDocx(exportPayload)}
        onExportTxt={() => exportTxt(exportPayload)}
        onExportMd={() => exportMd(exportPayload)}
        onExportHtml={() => exportHtml(exportPayload)}
        onNewDocument={() => navigate('/documents/new')}
        onDeleteDocument={handleDelete}
        isGuest={false}
        saveStatus={saveStatus}
      />

      {/* Share & Collaboration Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        documentId={id}
        title={form.title}
        collaborators={collaborators}
        status={form.status}
      />
    </div>
  );
};

export default DocumentEditorPage;
