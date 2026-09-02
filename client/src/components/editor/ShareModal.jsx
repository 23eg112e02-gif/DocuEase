import { useEffect, useState } from 'react';
import Button from '../common/Button.jsx';
import { X, Share2, Copy, Check, Users, ShieldCheck, UserPlus, Trash2, Loader2 } from 'lucide-react';
import { listCollaborators, shareDocument, unshareDocument } from '../../services/documentService.js';

const ShareModal = ({ isOpen, onClose, documentId, title, collaborators: liveCollaborators = [] }) => {
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('editor');
  const [loading, setLoading] = useState(false);
  const [inviting, setInviting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [owner, setOwner] = useState(null);
  const [permanentCollaborators, setPermanentCollaborators] = useState([]);
  const [isOwner, setIsOwner] = useState(false);

  const shareUrl = documentId && documentId !== 'new'
    ? `${window.location.origin}/documents/${documentId}`
    : '';

  const loadCollaborators = async () => {
    if (!documentId || documentId === 'new') return;
    setLoading(true);
    setError('');
    try {
      const data = await listCollaborators(documentId);
      setOwner(data.owner || null);
      setPermanentCollaborators(data.collaborators || []);
      setIsOwner(Boolean(data.isOwner));
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load collaborators');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && documentId && documentId !== 'new') {
      loadCollaborators();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, documentId]);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setInviting(true);
    setError('');
    setSuccess('');
    try {
      await shareDocument(documentId, { email: email.trim(), role });
      setSuccess(`Shared with ${email.trim()} as ${role}`);
      setEmail('');
      await loadCollaborators();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to share document');
    } finally {
      setInviting(false);
    }
  };

  const handleRemove = async (userId) => {
    if (!window.confirm('Remove this collaborator?')) return;
    setError('');
    setSuccess('');
    try {
      await unshareDocument(documentId, userId);
      setSuccess('Collaborator removed');
      await loadCollaborators();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to remove collaborator');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
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

        {/* Share Link */}
        {shareUrl && (
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
                    <Copy size={13} className="mr-1" /> Copy
                  </>
                )}
              </Button>
            </div>
            <p className="text-[11px] text-slate-500 flex items-center gap-1">
              <ShieldCheck size={13} className="text-blue-500" />
              Only people you invite (or the owner) can open and edit this document.
            </p>
          </div>
        )}

        {/* Invite form - owner only */}
        {isOwner && (
          <form onSubmit={handleInvite} className="space-y-2 pt-1 border-t border-slate-100">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <UserPlus size={14} />
              Invite by email
            </label>
            <div className="flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-blue-400"
              />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="rounded-xl border border-slate-200 px-2 py-2 text-xs outline-none bg-white"
              >
                <option value="editor">Editor</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>
            <Button type="submit" disabled={inviting} className="w-full text-xs">
              {inviting ? (
                <>
                  <Loader2 size={13} className="animate-spin mr-1" /> Inviting...
                </>
              ) : (
                'Invite'
              )}
            </Button>
          </form>
        )}

        {error && (
          <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>
        )}
        {success && (
          <p className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">{success}</p>
        )}

        {/* Permanent collaborators */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <Users size={14} className="text-slate-500" />
            People with access
          </span>

          {loading ? (
            <div className="flex items-center justify-center py-4 text-slate-400">
              <Loader2 size={16} className="animate-spin" />
            </div>
          ) : (
            <div className="max-h-48 overflow-y-auto space-y-1.5">
              {owner && (
                <div className="flex items-center justify-between rounded-lg bg-slate-50 p-2 text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="h-7 w-7 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                      {(owner.name || 'O').slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-slate-800 truncate">{owner.name}</p>
                      <p className="text-[10px] text-slate-500 truncate">{owner.email}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full shrink-0">
                    Owner
                  </span>
                </div>
              )}

              {permanentCollaborators.map((c) => {
                const u = c.user || {};
                const uid = u._id || c.user;
                return (
                  <div key={String(uid)} className="flex items-center justify-between rounded-lg bg-slate-50 p-2 text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="h-7 w-7 rounded-full bg-slate-500 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                        {(u.name || 'U').slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-slate-800 truncate">{u.name || 'User'}</p>
                        <p className="text-[10px] text-slate-500 truncate">{u.email || ''}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full capitalize">
                        {c.role || 'editor'}
                      </span>
                      {isOwner && (
                        <button
                          type="button"
                          onClick={() => handleRemove(uid)}
                          className="p-1 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50"
                          title="Remove"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}

              {!owner && permanentCollaborators.length === 0 && (
                <p className="text-xs text-slate-400 py-2 text-center">No collaborators yet.</p>
              )}
            </div>
          )}
        </div>

        {/* Live session presence */}
        {liveCollaborators.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <span className="text-xs font-semibold text-slate-700">
              Active in this session ({liveCollaborators.length})
            </span>
            <div className="space-y-1.5">
              {liveCollaborators.map((collab, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg bg-emerald-50 p-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div
                      style={{ backgroundColor: collab.color || '#2b6fe8' }}
                      className="h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                    >
                      {collab.initials || 'U'}
                    </div>
                    <span className="font-medium text-slate-800">{collab.name || 'Collaborator'}</span>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-600 bg-white px-2 py-0.5 rounded-full">
                    Online
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

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
