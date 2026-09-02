import { useState } from 'react';
import Button from '../common/Button.jsx';
import { Search, X, Replace, ArrowRight } from 'lucide-react';

const FindReplaceModal = ({ isOpen, onClose, editor }) => {
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [matchCount, setMatchCount] = useState(null);

  if (!isOpen || !editor) return null;

  const handleFind = () => {
    if (!findText) return;
    const content = editor.getText();
    const regex = new RegExp(findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    const matches = content.match(regex);
    setMatchCount(matches ? matches.length : 0);
  };

  const handleReplaceAll = () => {
    if (!findText) return;
    const html = editor.getHTML();
    const regex = new RegExp(findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    const replaced = html.replace(regex, replaceText);
    editor.commands.setContent(replaced, false);
    setMatchCount(0);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 w-96 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-5 duration-150">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
          <Search size={16} className="text-blue-600" />
          Find & Replace
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
        >
          <X size={16} />
        </button>
      </div>

      <div className="mt-3 space-y-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Find text..."
            value={findText}
            onChange={(e) => {
              setFindText(e.target.value);
              setMatchCount(null);
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleFind()}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            autoFocus
          />
          {matchCount !== null && (
            <span className="absolute right-3 top-2 text-[10px] font-semibold text-slate-500">
              {matchCount} match{matchCount === 1 ? '' : 'es'}
            </span>
          )}
        </div>

        <input
          type="text"
          placeholder="Replace with..."
          value={replaceText}
          onChange={(e) => setReplaceText(e.target.value)}
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />

        <div className="flex items-center justify-between pt-1">
          <Button type="button" variant="secondary" onClick={handleFind} className="px-3 py-1.5 text-xs">
            Find Matches
          </Button>
          <Button type="button" variant="primary" onClick={handleReplaceAll} className="px-3 py-1.5 text-xs">
            Replace All
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FindReplaceModal;
