import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useEditorContext } from '../../context/useEditorContext.js';
import { useAuth } from '../../hooks/useAuth.js';
import RichTextEditor from '../../editor/RichTextEditor.jsx';
import { createDocument } from '../../services/documentService.js';
import { exportDocx, exportHtml, exportMd, exportPdf, exportTxt } from '../../services/exportService.js';
import { 
  FileText, HardDrive, ArrowRight, UserPlus, 
  Sparkles, CheckCircle2, AlertCircle, LayoutTemplate
} from 'lucide-react';
import { DOCUMENT_TEMPLATES } from '../../utils/templates.js';

const GuestEditorPage = () => {
  const { guestDocument, setGuestTitle, setGuestContent, resetGuestDocument, lastSavedAt } = useEditorContext();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isSavingToAccount, setIsSavingToAccount] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [saveError, setSaveError] = useState('');

  const exportPayload = useMemo(
    () => ({
      title: guestDocument.title || 'Untitled Document',
      content: guestDocument.content || ''
    }),
    [guestDocument.content, guestDocument.title]
  );

  const handleSaveToAccount = async () => {
    if (!user) {
      // Prompt sign in / register, keeping current draft in localStorage
      navigate('/register', { state: { fromGuest: true } });
      return;
    }

    setIsSavingToAccount(true);
    setSaveError('');
    try {
      const result = await createDocument({
        title: guestDocument.title || 'Untitled Document',
        content: guestDocument.content || '',
        status: 'draft',
        source: 'manual'
      });
      // Redirect to newly saved account document
      navigate(`/documents/${result.document._id}`);
    } catch (err) {
      setSaveError(err?.response?.data?.message || 'Failed to save to account');
    } finally {
      setIsSavingToAccount(false);
    }
  };

  const handleApplyTemplate = (template) => {
    if (guestDocument.content && !window.confirm('Apply template? This will replace your current guest draft.')) {
      return;
    }
    setGuestTitle(template.title);
    setGuestContent(template.content);
    setShowTemplates(false);
  };

  const handleClearDraft = () => {
    if (window.confirm('Are you sure you want to clear this guest draft?')) {
      resetGuestDocument();
    }
  };

  return (
    <div className="space-y-3 max-w-7xl mx-auto px-2 sm:px-4 py-2">
      {/* Guest Mode Banner & Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white px-4 py-2.5 rounded-2xl border border-slate-200/80 shadow-xs no-print">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2 rounded-xl bg-amber-50 text-amber-600 hidden sm:block">
            <HardDrive size={20} />
          </div>

          <div className="space-y-0.5 min-w-0">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={guestDocument.title}
                onChange={(e) => setGuestTitle(e.target.value)}
                placeholder="Untitled document"
                className="text-base sm:text-lg font-bold text-slate-900 bg-transparent hover:bg-slate-100 focus:bg-white px-1.5 py-0.5 rounded-lg border border-transparent focus:border-amber-400 outline-none transition truncate max-w-[200px] sm:max-w-md"
              />
              <span className="rounded-full bg-amber-100 text-amber-800 font-bold text-[10px] px-2 py-0.5 uppercase tracking-wider">
                Guest Mode
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="flex items-center gap-1 font-medium text-emerald-600">
                <CheckCircle2 size={12} />
                <span>Saved to browser storage</span>
              </span>
              <span>&bull;</span>
              <button
                type="button"
                onClick={() => setShowTemplates(!showTemplates)}
                className="text-blue-600 font-semibold hover:underline flex items-center gap-1"
              >
                <LayoutTemplate size={12} />
                <span>Templates</span>
              </button>
            </div>
          </div>
        </div>

        {/* Action: Save to Account */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSaveToAccount}
            disabled={isSavingToAccount}
            className="flex items-center gap-2 rounded-full bg-blue-600 hover:bg-blue-700 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:shadow-md cursor-pointer"
          >
            {user ? (
              <>
                <Sparkles size={14} />
                <span>{isSavingToAccount ? 'Saving...' : 'Save to My Cloud Account'}</span>
              </>
            ) : (
              <>
                <UserPlus size={14} />
                <span>Save to Cloud Account</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Template selector drawer (if toggled) */}
      {showTemplates && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm animate-in fade-in duration-150 space-y-3 no-print">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Choose a Document Template</h4>
            <button
              type="button"
              onClick={() => setShowTemplates(false)}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              Close
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {DOCUMENT_TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.id}
                type="button"
                onClick={() => handleApplyTemplate(tmpl)}
                className="flex flex-col items-start p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 text-left transition"
              >
                <span className="text-sm font-bold text-slate-800">{tmpl.title}</span>
                <span className="text-[11px] text-slate-500 line-clamp-2 mt-1">{tmpl.description}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {saveError && (
        <div className="rounded-xl bg-red-50 p-3 text-xs text-red-700 flex items-center gap-2 border border-red-200">
          <AlertCircle size={14} />
          <span>{saveError}</span>
        </div>
      )}

      {/* Full Google Docs Rich Text Editor in Guest Mode */}
      <RichTextEditor
        value={guestDocument.content}
        onChange={setGuestContent}
        placeholder="Write freely as a guest without signing in. Everything is saved in your browser..."
        onExportPdf={() => exportPdf(exportPayload)}
        onExportDocx={() => exportDocx(exportPayload)}
        onExportTxt={() => exportTxt(exportPayload)}
        onExportMd={() => exportMd(exportPayload)}
        onExportHtml={() => exportHtml(exportPayload)}
        onNewDocument={handleClearDraft}
        onDeleteDocument={handleClearDraft}
        isGuest={true}
        saveStatus="Saved to browser"
      />
    </div>
  );
};

export default GuestEditorPage;
