import Button from '../common/Button.jsx';
import { X, Keyboard } from 'lucide-react';

const SHORTCUTS = [
  { key: 'Ctrl + B / ⌘ + B', action: 'Bold text' },
  { key: 'Ctrl + I / ⌘ + I', action: 'Italicize text' },
  { key: 'Ctrl + U / ⌘ + U', action: 'Underline text' },
  { key: 'Ctrl + Shift + X', action: 'Strikethrough' },
  { key: 'Ctrl + Z / ⌘ + Z', action: 'Undo last action' },
  { key: 'Ctrl + Y / ⌘ + Shift + Z', action: 'Redo action' },
  { key: 'Ctrl + S / ⌘ + S', action: 'Save document' },
  { key: 'Ctrl + P / ⌘ + P', action: 'Print / Export to PDF' },
  { key: 'Ctrl + F / ⌘ + F', action: 'Find and Replace' },
  { key: 'Ctrl + Shift + C', action: 'Word count' },
  { key: 'Ctrl + Shift + 7', action: 'Numbered list' },
  { key: 'Ctrl + Shift + 8', action: 'Bulleted list' },
  { key: 'Ctrl + Shift + 9', action: 'Task checklist' },
  { key: 'Ctrl + Alt + 1', action: 'Heading 1' },
  { key: 'Ctrl + Alt + 2', action: 'Heading 2' },
  { key: 'Ctrl + Alt + 0', action: 'Normal text' }
];

const KeyboardShortcutsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Keyboard size={18} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Keyboard Shortcuts</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 pr-1 text-sm">
          {SHORTCUTS.map((shortcut, i) => (
            <div key={i} className="flex items-center justify-between py-2.5">
              <span className="text-slate-700">{shortcut.action}</span>
              <kbd className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-800 shadow-sm">
                {shortcut.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="primary" onClick={onClose}>
            Got it
          </Button>
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcutsModal;
