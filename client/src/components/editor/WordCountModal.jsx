import Button from '../common/Button.jsx';
import { X, FileText } from 'lucide-react';

const WordCountModal = ({ isOpen, onClose, editor }) => {
  if (!isOpen || !editor) return null;

  const text = editor.getText();
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const characters = text.length;
  const charactersWithoutSpaces = text.replace(/\s/g, '').length;
  const paragraphs = text.split(/\n+/).filter(Boolean).length || (text ? 1 : 0);
  const readingTimeMinutes = Math.ceil(words / 200);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <FileText size={18} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Word Count</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3 text-sm text-slate-700">
          <div className="flex justify-between py-1 border-b border-slate-50">
            <span className="font-medium text-slate-500">Words</span>
            <span className="font-bold text-slate-900">{words.toLocaleString()}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-50">
            <span className="font-medium text-slate-500">Characters</span>
            <span className="font-bold text-slate-900">{characters.toLocaleString()}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-50">
            <span className="font-medium text-slate-500">Characters (no spaces)</span>
            <span className="font-bold text-slate-900">{charactersWithoutSpaces.toLocaleString()}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-50">
            <span className="font-medium text-slate-500">Paragraphs</span>
            <span className="font-bold text-slate-900">{paragraphs.toLocaleString()}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-50">
            <span className="font-medium text-slate-500">Estimated Reading Time</span>
            <span className="font-bold text-slate-900">{readingTimeMinutes} min</span>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="primary" onClick={onClose} className="px-5">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WordCountModal;
