import { useState } from 'react';
import Button from '../common/Button.jsx';
import { X, Share2, Copy, Check, Users, ShieldCheck, Globe } from 'lucide-react';

const ShareModal = ({ isOpen, onClose, documentId, title, collaborators = [], status = 'draft' }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareUrl = `${window.location.origin}/documents/${documentId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Share2 size={18} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Share Document</h3>
              <p className="text-xs text-slate-500 truncate max-w-[240px]">{title || 'Untitled Document'}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>

        {/* Share Link Copy Box */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-700">Collaboration Link</label>
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-1.5 pl-3">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="w-full bg-transparent text-xs text-slate-700 outline-none select-all"
            />
            <Button
              type="button"
              variant={copied ? 'secondary' : 'primary'}
              onClick={handleCopy}
              className="px-3 py-1 text-xs shrink-0"
            >
              {copied ? (
                <>
                  <Check size={13} className="text-emerald-600 mr-1" /> Copied
                </>
              ) : (
                <>
                  <Copy size={13} className="mr-1" /> Copy Link
                </>
              )}
            </Button>
          </div>
          <p className="text-[11px] text-slate-500 flex items-center gap-1">
            <ShieldCheck size={13} className="text-blue-500" />
            Authenticated users with this link can collaborate in real-time.
          </p>
        </div>

        {/* Active Collaborators */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Users size={14} className="text-slate-500" />
              Active in this session ({collaborators.length})
            </span>
          </div>

          <div className="max-h-36 overflow-y-auto space-y-1.5">
            {collaborators.map((collab, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg bg-slate-50 p-2 text-xs">
                <div className="flex items-center gap-2">
                  <div
                    style={{ backgroundColor: collab.color || '#2b6fe8' }}
                    className="h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-xs"
                  >
                    {collab.initials || 'U'}
                  </div>
                  <span className="font-medium text-slate-800">{collab.name || 'Collaborator'}</span>
                </div>
                <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Online
                </span>
              </div>
            ))}

            {collaborators.length === 0 && (
              <p className="text-xs text-slate-400 py-2 text-center">No other collaborators active right now.</p>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-100">
          <Button variant="secondary" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
