import { useState, useRef, useEffect } from 'react';
import { 
  FileText, Undo, Redo, Download, Printer, Search, 
  Table, Image as ImageIcon, Link as LinkIcon, CheckSquare, 
  Minus, HelpCircle, Keyboard, Info, FilePlus, Copy, Trash2
} from 'lucide-react';

const MenuDropdown = ({ label, items, isOpen, onToggle, onClose }) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen, onClose]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={onToggle}
        className={`px-2.5 py-1 text-xs font-medium rounded-md transition select-none ${
          isOpen ? 'bg-blue-100 text-blue-900 font-semibold' : 'text-slate-700 hover:bg-slate-200/60'
        }`}
      >
        {label}
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-1 z-50 min-w-[200px] rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl animate-in fade-in-50 zoom-in-95 duration-100">
          {items.map((item, idx) => {
            if (item.type === 'divider') {
              return <div key={idx} className="my-1 border-t border-slate-100" />;
            }

            return (
              <button
                key={idx}
                type="button"
                disabled={item.disabled}
                onClick={() => {
                  item.onClick?.();
                  onClose();
                }}
                className={`flex w-full items-center justify-between gap-3 rounded-lg px-2.5 py-1.5 text-left text-xs transition ${
                  item.disabled
                    ? 'opacity-40 cursor-not-allowed text-slate-400'
                    : 'text-slate-700 hover:bg-blue-50 hover:text-blue-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  {item.icon && <span className="text-slate-400">{item.icon}</span>}
                  <span>{item.label}</span>
                </div>
                {item.shortcut && (
                  <span className="text-[10px] text-slate-400 font-mono">{item.shortcut}</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

const EditorMenuBar = ({
  editor,
  onSave,
  onExportPdf,
  onExportDocx,
  onExportTxt,
  onExportMd,
  onExportHtml,
  onOpenFindReplace,
  onOpenWordCount,
  onOpenShortcuts,
  onOpenInsertLink,
  onOpenInsertImage,
  onNewDocument,
  onDeleteDocument,
  isGuest = false
}) => {
  const [activeMenu, setActiveMenu] = useState(null);

  const toggleMenu = (name) => {
    setActiveMenu((curr) => (curr === name ? null : name));
  };

  const closeMenu = () => setActiveMenu(null);

  const handlePrint = () => {
    window.print();
  };

  const handleInsertDate = () => {
    if (!editor) return;
    const dateStr = new Date().toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    editor.chain().focus().insertContent(dateStr).run();
  };

  const handleInsertTable = () => {
    if (!editor) return;
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  const fileItems = [
    { label: 'New Document', icon: <FilePlus size={14} />, onClick: onNewDocument },
    { type: 'divider' },
    { label: 'Save Document', icon: <FileText size={14} />, shortcut: 'Ctrl+S', onClick: onSave },
    { label: 'Download as PDF (.pdf)', icon: <Download size={14} />, onClick: onExportPdf },
    { label: 'Download as Word (.docx)', icon: <Download size={14} />, onClick: onExportDocx },
    { label: 'Download as Plain Text (.txt)', icon: <Download size={14} />, onClick: onExportTxt },
    { label: 'Download as Markdown (.md)', icon: <Download size={14} />, onClick: onExportMd },
    { label: 'Download as Web Page (.html)', icon: <Download size={14} />, onClick: onExportHtml },
    { type: 'divider' },
    { label: 'Print Document', icon: <Printer size={14} />, shortcut: 'Ctrl+P', onClick: handlePrint },
    ...(onDeleteDocument ? [
      { type: 'divider' },
      { label: isGuest ? 'Clear Draft' : 'Delete Document', icon: <Trash2 size={14} className="text-red-500" />, onClick: onDeleteDocument }
    ] : [])
  ];

  const editItems = [
    { label: 'Undo', icon: <Undo size={14} />, shortcut: 'Ctrl+Z', onClick: () => editor?.chain().focus().undo().run(), disabled: !editor?.can().undo() },
    { label: 'Redo', icon: <Redo size={14} />, shortcut: 'Ctrl+Y', onClick: () => editor?.chain().focus().redo().run(), disabled: !editor?.can().redo() },
    { type: 'divider' },
    { label: 'Select All', shortcut: 'Ctrl+A', onClick: () => editor?.chain().focus().selectAll().run() },
    { label: 'Find and Replace', icon: <Search size={14} />, shortcut: 'Ctrl+F', onClick: onOpenFindReplace }
  ];

  const viewItems = [
    { label: 'Word & Character Count', icon: <FileText size={14} />, shortcut: 'Ctrl+Shift+C', onClick: onOpenWordCount },
    { label: 'Print Preview (Full Page)', icon: <Printer size={14} />, onClick: handlePrint }
  ];

  const insertItems = [
    { label: 'Image', icon: <ImageIcon size={14} />, onClick: onOpenInsertImage },
    { label: 'Table (3x3)', icon: <Table size={14} />, onClick: handleInsertTable },
    { label: 'Link', icon: <LinkIcon size={14} />, shortcut: 'Ctrl+K', onClick: onOpenInsertLink },
    { label: 'Checklist / Task list', icon: <CheckSquare size={14} />, onClick: () => editor?.chain().focus().toggleTaskList().run() },
    { label: 'Horizontal Divider', icon: <Minus size={14} />, onClick: () => editor?.chain().focus().setHorizontalRule().run() },
    { type: 'divider' },
    { label: 'Current Date', onClick: handleInsertDate }
  ];

  const formatItems = [
    { label: 'Bold', shortcut: 'Ctrl+B', onClick: () => editor?.chain().focus().toggleBold().run() },
    { label: 'Italic', shortcut: 'Ctrl+I', onClick: () => editor?.chain().focus().toggleItalic().run() },
    { label: 'Underline', shortcut: 'Ctrl+U', onClick: () => editor?.chain().focus().toggleUnderline().run() },
    { label: 'Strikethrough', shortcut: 'Ctrl+Shift+X', onClick: () => editor?.chain().focus().toggleStrike().run() },
    { label: 'Subscript', onClick: () => editor?.chain().focus().toggleSubscript().run() },
    { label: 'Superscript', onClick: () => editor?.chain().focus().toggleSuperscript().run() },
    { type: 'divider' },
    { label: 'Align Left', onClick: () => editor?.chain().focus().setTextAlign('left').run() },
    { label: 'Align Center', onClick: () => editor?.chain().focus().setTextAlign('center').run() },
    { label: 'Align Right', onClick: () => editor?.chain().focus().setTextAlign('right').run() },
    { label: 'Justify', onClick: () => editor?.chain().focus().setTextAlign('justify').run() },
    { type: 'divider' },
    { label: 'Clear Formatting', onClick: () => editor?.chain().focus().unsetAllMarks().clearNodes().run() }
  ];

  const toolsItems = [
    { label: 'Word Count Statistics', icon: <FileText size={14} />, onClick: onOpenWordCount },
    { label: 'Keyboard Shortcuts', icon: <Keyboard size={14} />, onClick: onOpenShortcuts }
  ];

  const helpItems = [
    { label: 'Keyboard Shortcuts', icon: <Keyboard size={14} />, onClick: onOpenShortcuts },
    { type: 'divider' },
    { label: 'About DocuEase', icon: <Info size={14} />, onClick: () => alert('DocuEase - Production Ready Google Docs Clone built with React, Vite, Tailwind, TipTap, Node.js & MongoDB.') }
  ];

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-slate-200/80 bg-slate-50/70 px-4 py-1 editor-menubar no-print">
      <MenuDropdown label="File" items={fileItems} isOpen={activeMenu === 'file'} onToggle={() => toggleMenu('file')} onClose={closeMenu} />
      <MenuDropdown label="Edit" items={editItems} isOpen={activeMenu === 'edit'} onToggle={() => toggleMenu('edit')} onClose={closeMenu} />
      <MenuDropdown label="View" items={viewItems} isOpen={activeMenu === 'view'} onToggle={() => toggleMenu('view')} onClose={closeMenu} />
      <MenuDropdown label="Insert" items={insertItems} isOpen={activeMenu === 'insert'} onToggle={() => toggleMenu('insert')} onClose={closeMenu} />
      <MenuDropdown label="Format" items={formatItems} isOpen={activeMenu === 'format'} onToggle={() => toggleMenu('format')} onClose={closeMenu} />
      <MenuDropdown label="Tools" items={toolsItems} isOpen={activeMenu === 'tools'} onToggle={() => toggleMenu('tools')} onClose={closeMenu} />
      <MenuDropdown label="Help" items={helpItems} isOpen={activeMenu === 'help'} onToggle={() => toggleMenu('help')} onClose={closeMenu} />
    </div>
  );
};

export default EditorMenuBar;
