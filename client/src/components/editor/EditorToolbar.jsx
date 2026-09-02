import { useState, useRef, useEffect } from 'react';
import {
  Bold, Italic, Underline, Strikethrough, Code, Link as LinkIcon, 
  Image as ImageIcon, Table, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, CheckSquare, Quote, Minus, Undo, Redo, Printer,
  Highlighter, Palette, ChevronDown, Plus, Trash2, Rows, Columns
} from 'lucide-react';

const FONT_FAMILIES = [
  { label: 'Default Font', value: '' },
  { label: 'Arial', value: 'Arial, sans-serif' },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Times New Roman', value: '"Times New Roman", Times, serif' },
  { label: 'Courier New', value: '"Courier New", Courier, monospace' },
  { label: 'Trebuchet MS', value: '"Trebuchet MS", sans-serif' },
  { label: 'Inter', value: 'Inter, sans-serif' },
  { label: 'Roboto', value: 'Roboto, sans-serif' }
];

const TEXT_COLORS = [
  '#000000', '#434343', '#666666', '#999999', '#b7b7b7', '#cccccc', '#d9d9d9', '#efefef', '#f3f3f3', '#ffffff',
  '#980000', '#ff0000', '#ff9900', '#ffff00', '#00ff00', '#00ffff', '#4a86e8', '#0000ff', '#9900ff', '#ff00ff',
  '#e6b8af', '#f4cccc', '#fce5cd', '#fff2cc', '#d9ead3', '#d0e0e3', '#c9daf8', '#cfe2f3', '#d9d2e9', '#ead1dc',
  '#cc4125', '#e06666', '#f6b26b', '#ffd966', '#93c47d', '#76a5af', '#6d9eeb', '#6fa8dc', '#8e7cc3', '#c27ba0',
  '#a61c1c', '#cc0000', '#e69138', '#f1c232', '#6aa84f', '#45818e', '#3c78d8', '#3d85c6', '#674ea7', '#a64d79'
];

const HIGHLIGHT_COLORS = [
  '#ffff00', '#00ff00', '#00ffff', '#ff00ff', '#ff9900', '#e06666', '#9fc5e8', '#b6d7a8', '#ffe599', 'transparent'
];

const ToolbarButton = ({ active, disabled, onClick, title, children, className = '' }) => (
  <button
    type="button"
    disabled={disabled}
    onClick={onClick}
    title={title}
    className={`flex items-center justify-center h-7 w-7 rounded-md text-xs transition select-none ${
      active
        ? 'bg-blue-100 text-blue-800 font-bold'
        : 'text-slate-700 hover:bg-slate-200/80 hover:text-slate-900'
    } ${disabled ? 'opacity-30 cursor-not-allowed' : ''} ${className}`}
  >
    {children}
  </button>
);

const ToolbarDivider = () => <div className="h-5 w-[1px] bg-slate-300 mx-1 self-center" />;

const EditorToolbar = ({
  editor,
  onOpenInsertLink,
  onOpenInsertImage
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [showTableMenu, setShowTableMenu] = useState(false);

  const colorRef = useRef(null);
  const highlightRef = useRef(null);
  const tableRef = useRef(null);

  useEffect(() => {
    const handleOutside = (e) => {
      if (colorRef.current && !colorRef.current.contains(e.target)) setShowColorPicker(false);
      if (highlightRef.current && !highlightRef.current.contains(e.target)) setShowHighlightPicker(false);
      if (tableRef.current && !tableRef.current.contains(e.target)) setShowTableMenu(false);
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  if (!editor) return null;

  // Formatting state getters
  const isHeading1 = editor.isActive('heading', { level: 1 });
  const isHeading2 = editor.isActive('heading', { level: 2 });
  const isHeading3 = editor.isActive('heading', { level: 3 });

  const getCurrentHeading = () => {
    if (isHeading1) return 'Heading 1';
    if (isHeading2) return 'Heading 2';
    if (isHeading3) return 'Heading 3';
    return 'Normal text';
  };

  const handleHeadingChange = (e) => {
    const val = e.target.value;
    if (val === 'h1') editor.chain().focus().toggleHeading({ level: 1 }).run();
    else if (val === 'h2') editor.chain().focus().toggleHeading({ level: 2 }).run();
    else if (val === 'h3') editor.chain().focus().toggleHeading({ level: 3 }).run();
    else editor.chain().focus().setParagraph().run();
  };

  const isTableActive = editor.isActive('table');

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-slate-200 bg-white px-3 py-1.5 editor-toolbar no-print sticky top-0 z-20 shadow-xs">
      {/* Undo & Redo & Print */}
      <ToolbarButton
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        title="Undo (Ctrl+Z)"
      >
        <Undo size={15} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        title="Redo (Ctrl+Y)"
      >
        <Redo size={15} />
      </ToolbarButton>
      <ToolbarButton onClick={() => window.print()} title="Print (Ctrl+P)">
        <Printer size={15} />
      </ToolbarButton>

      <ToolbarDivider />

      {/* Heading Style Select */}
      <select
        value={isHeading1 ? 'h1' : isHeading2 ? 'h2' : isHeading3 ? 'h3' : 'p'}
        onChange={handleHeadingChange}
        className="h-7 rounded-md border border-transparent bg-slate-100 px-2 text-xs font-medium text-slate-700 hover:bg-slate-200/80 outline-none cursor-pointer"
      >
        <option value="p">Normal text</option>
        <option value="h1">Heading 1</option>
        <option value="h2">Heading 2</option>
        <option value="h3">Heading 3</option>
      </select>

      <ToolbarDivider />

      {/* Basic Text Formatting */}
      <ToolbarButton
        active={editor.isActive('bold')}
        onClick={() => editor.chain().focus().toggleBold().run()}
        title="Bold (Ctrl+B)"
      >
        <Bold size={15} />
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive('italic')}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        title="Italic (Ctrl+I)"
      >
        <Italic size={15} />
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive('underline')}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        title="Underline (Ctrl+U)"
      >
        <Underline size={15} />
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive('strike')}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        title="Strikethrough"
      >
        <Strikethrough size={15} />
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive('code')}
        onClick={() => editor.chain().focus().toggleCode().run()}
        title="Inline Code"
      >
        <Code size={15} />
      </ToolbarButton>

      {/* Text Color Picker */}
      <div className="relative" ref={colorRef}>
        <ToolbarButton
          onClick={() => setShowColorPicker(!showColorPicker)}
          title="Text Color"
          className="flex items-center gap-0.5"
        >
          <Palette size={15} />
        </ToolbarButton>
        {showColorPicker && (
          <div className="absolute left-0 top-full mt-1 z-50 w-52 rounded-xl border border-slate-200 bg-white p-2.5 shadow-xl grid grid-cols-10 gap-1">
            {TEXT_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                style={{ backgroundColor: color }}
                onClick={() => {
                  editor.chain().focus().setColor(color).run();
                  setShowColorPicker(false);
                }}
                className="h-4 w-4 rounded-sm border border-slate-300 hover:scale-125 transition"
              />
            ))}
          </div>
        )}
      </div>

      {/* Highlight Color Picker */}
      <div className="relative" ref={highlightRef}>
        <ToolbarButton
          active={editor.isActive('highlight')}
          onClick={() => setShowHighlightPicker(!showHighlightPicker)}
          title="Highlight Color"
        >
          <Highlighter size={15} />
        </ToolbarButton>
        {showHighlightPicker && (
          <div className="absolute left-0 top-full mt-1 z-50 w-44 rounded-xl border border-slate-200 bg-white p-2.5 shadow-xl grid grid-cols-5 gap-1.5">
            {HIGHLIGHT_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                style={{ backgroundColor: color === 'transparent' ? '#ffffff' : color }}
                onClick={() => {
                  if (color === 'transparent') {
                    editor.chain().focus().unsetHighlight().run();
                  } else {
                    editor.chain().focus().toggleHighlight({ color }).run();
                  }
                  setShowHighlightPicker(false);
                }}
                className="h-6 w-6 rounded-md border border-slate-300 hover:scale-110 transition flex items-center justify-center text-[10px] font-bold text-slate-600"
              >
                {color === 'transparent' ? '✕' : ''}
              </button>
            ))}
          </div>
        )}
      </div>

      <ToolbarDivider />

      {/* Links & Images */}
      <ToolbarButton
        active={editor.isActive('link')}
        onClick={onOpenInsertLink}
        title="Insert Link (Ctrl+K)"
      >
        <LinkIcon size={15} />
      </ToolbarButton>
      <ToolbarButton onClick={onOpenInsertImage} title="Insert Image">
        <ImageIcon size={15} />
      </ToolbarButton>

      {/* Table Dropdown & Table controls */}
      <div className="relative" ref={tableRef}>
        <ToolbarButton
          active={isTableActive}
          onClick={() => setShowTableMenu(!showTableMenu)}
          title="Table options"
          className="flex items-center gap-0.5"
        >
          <Table size={15} />
          <ChevronDown size={10} className="text-slate-400" />
        </ToolbarButton>

        {showTableMenu && (
          <div className="absolute left-0 top-full mt-1 z-50 w-48 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl text-xs space-y-1">
            {!isTableActive ? (
              <button
                type="button"
                onClick={() => {
                  editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
                  setShowTableMenu(false);
                }}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-slate-700 hover:bg-blue-50 hover:text-blue-700"
              >
                <Plus size={14} /> Insert 3x3 Table
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    editor.chain().focus().addRowAfter().run();
                    setShowTableMenu(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                >
                  <Rows size={14} /> Add Row Below
                </button>
                <button
                  type="button"
                  onClick={() => {
                    editor.chain().focus().addColumnAfter().run();
                    setShowTableMenu(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                >
                  <Columns size={14} /> Add Column Right
                </button>
                <button
                  type="button"
                  onClick={() => {
                    editor.chain().focus().deleteRow().run();
                    setShowTableMenu(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                >
                  <Trash2 size={14} /> Delete Row
                </button>
                <button
                  type="button"
                  onClick={() => {
                    editor.chain().focus().deleteColumn().run();
                    setShowTableMenu(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                >
                  <Trash2 size={14} /> Delete Column
                </button>
                <div className="my-1 border-t border-slate-100" />
                <button
                  type="button"
                  onClick={() => {
                    editor.chain().focus().deleteTable().run();
                    setShowTableMenu(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={14} /> Delete Table
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <ToolbarDivider />

      {/* Alignment */}
      <ToolbarButton
        active={editor.isActive({ textAlign: 'left' })}
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        title="Align Left"
      >
        <AlignLeft size={15} />
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive({ textAlign: 'center' })}
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        title="Align Center"
      >
        <AlignCenter size={15} />
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive({ textAlign: 'right' })}
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        title="Align Right"
      >
        <AlignRight size={15} />
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive({ textAlign: 'justify' })}
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
        title="Justify"
      >
        <AlignJustify size={15} />
      </ToolbarButton>

      <ToolbarDivider />

      {/* Lists */}
      <ToolbarButton
        active={editor.isActive('bulletList')}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        title="Bulleted list (Ctrl+Shift+8)"
      >
        <List size={15} />
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive('orderedList')}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        title="Numbered list (Ctrl+Shift+7)"
      >
        <ListOrdered size={15} />
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive('taskList')}
        onClick={() => editor.chain().focus().toggleTaskList().run()}
        title="Checklist / Task list (Ctrl+Shift+9)"
      >
        <CheckSquare size={15} />
      </ToolbarButton>

      <ToolbarDivider />

      {/* Blocks */}
      <ToolbarButton
        active={editor.isActive('blockquote')}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        title="Blockquote"
      >
        <Quote size={15} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        title="Horizontal Line"
      >
        <Minus size={15} />
      </ToolbarButton>
    </div>
  );
};

export default EditorToolbar;
