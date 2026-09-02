import { useEffect, useState } from 'react';
import Button from '../common/Button.jsx';
import { X, History, RotateCcw, Loader2, Clock } from 'lucide-react';
import { listVersions, restoreVersion } from '../../services/documentService.js';

const VersionHistoryModal = ({ isOpen, onClose, documentId, onRestored }) => {
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [restoringId, setRestoringId] = useState(null);
  const [error, setError] = useState('');

  const load = async () => {
    if (!documentId || documentId === 'new') return;
    setLoading(true);
    setError('');
    try {
      const data = await listVersions(documentId);
      setVersions(data.versions || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load versions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, documentId]);

  if (!isOpen) return null;

  const handleRestore = async (versionId) => {
    if (!window.confirm('Restore this version? Current content will be saved as a new history entry first.')) {
      return;
    }
    setRestoringId(versionId);
    setError('');
    try {
      const data = await restoreVersion(documentId, versionId);
      onRestored?.(data.document);
      await load();
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to restore version');
    } finally {
      setRestoringId(null);
    }
  };

  const formatDate = (iso) => {
    if (!iso) return '';
    try {
      return new Date(iso).toLocaleString();
    } catch {
      return iso;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-violet-50 text-violet-600">
              <History size={18} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Version History</h3>
              <p className="text-xs text-slate-500">Last {versions.length} snapshots (max 30)</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>

        {error && (
          <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>
        )}

        {loading ? (
          <div className="flex justify-center py-8 text-slate-400">
            <Loader2 className="animate-spin" size={20} />
          </div>
        ) : versions.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-8">No versions yet. Edit and save the document to create history.</p>
        ) : (
          <div className="space-y-2">
            {versions.map((v) => (
              <div
                key={v._id}
                className="rounded-xl border border-slate-150 bg-slate-50 p-3 flex items-start justify-between gap-3"
              >
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Clock size={12} />
                    <span>{formatDate(v.createdAt)}</span>
                    {v.label && (
                      <span className="bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded text-[10px] font-semibold">
                        {v.label}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-slate-800 truncate">{v.title}</p>
                  <p className="text-[11px] text-slate-500 line-clamp-2">{v.preview || 'Empty content'}</p>
                  {v.savedBy?.name && (
                    <p className="text-[10px] text-slate-400">by {v.savedBy.name}</p>
                  )}
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  className="text-xs shrink-0"
                  disabled={restoringId === v._id}
                  onClick={() => handleRestore(v._id)}
                >
                  {restoringId === v._id ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <>
                      <RotateCcw size={13} className="mr-1" /> Restore
                    </>
                  )}
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end pt-2 border-t border-slate-100">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VersionHistoryModal;
