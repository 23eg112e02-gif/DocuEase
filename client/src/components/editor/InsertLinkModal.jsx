import { useState } from 'react';
import Button from '../common/Button.jsx';
import Input from '../common/Input.jsx';
import { X, Link as LinkIcon, ExternalLink } from 'lucide-react';

const InsertLinkModal = ({ isOpen, onClose, onSave, initialUrl = '', initialText = '' }) => {
  const [url, setUrl] = useState(initialUrl);
  const [text, setText] = useState(initialText);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url.trim()) return;
    let formattedUrl = url.trim();
    if (!/^https?:\/\//i.test(formattedUrl) && !formattedUrl.startsWith('#') && !formattedUrl.startsWith('mailto:')) {
      formattedUrl = `https://${formattedUrl}`;
    }
    onSave({ url: formattedUrl, text });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <LinkIcon size={18} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Insert Link</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Link Text (optional)"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Display text"
          />
          <Input
            label="URL Address"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            autoFocus
            required
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Apply Link
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InsertLinkModal;
