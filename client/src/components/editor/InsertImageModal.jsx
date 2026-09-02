import { useState, useRef } from 'react';
import Button from '../common/Button.jsx';
import Input from '../common/Input.jsx';
import { X, Image as ImageIcon, Upload, Globe } from 'lucide-react';

const InsertImageModal = ({ isOpen, onClose, onInsert }) => {
  const [tab, setTab] = useState('url'); // 'url' | 'upload'
  const [url, setUrl] = useState('');
  const [alt, setAlt] = useState('');
  const [preview, setPreview] = useState('');
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result);
      if (!alt) setAlt(file.name.replace(/\.[^/.]+$/, ''));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalUrl = tab === 'url' ? url.trim() : preview;
    if (!finalUrl) return;

    onInsert({ url: finalUrl, alt: alt.trim() || 'Image' });
    onClose();
    setUrl('');
    setPreview('');
    setAlt('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <ImageIcon size={18} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Insert Image</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex rounded-xl bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setTab('url')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
              tab === 'url' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Globe size={14} className="inline mr-1.5" />
            From Web URL
          </button>
          <button
            type="button"
            onClick={() => setTab('upload')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
              tab === 'upload' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Upload size={14} className="inline mr-1.5" />
            Upload File
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === 'url' ? (
            <Input
              label="Image URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/image.png"
              autoFocus
              required
            />
          ) : (
            <div className="space-y-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-blue-500 transition hover:bg-blue-50/50"
              >
                {preview ? (
                  <img src={preview} alt="Preview" className="max-h-40 mx-auto rounded-lg shadow-sm" />
                ) : (
                  <div className="space-y-1">
                    <Upload className="mx-auto text-slate-400" size={24} />
                    <p className="text-sm font-medium text-slate-700">Click to choose an image from device</p>
                    <p className="text-xs text-slate-500">PNG, JPG, GIF, WebP up to 5MB</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <Input
            label="Alt Text / Caption (optional)"
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            placeholder="Image description"
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={tab === 'url' ? !url : !preview}>
              Insert Image
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InsertImageModal;
