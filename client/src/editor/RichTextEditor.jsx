import { useEffect, useState, useMemo } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import { TableCell } from '@tiptap/extension-table/cell';
import { TableHeader } from '@tiptap/extension-table/header';
import { TableRow } from '@tiptap/extension-table/row';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';

import EditorMenuBar from '../components/editor/EditorMenuBar.jsx';
import EditorToolbar from '../components/editor/EditorToolbar.jsx';
import InsertLinkModal from '../components/editor/InsertLinkModal.jsx';
import InsertImageModal from '../components/editor/InsertImageModal.jsx';
import FindReplaceModal from '../components/editor/FindReplaceModal.jsx';
import WordCountModal from '../components/editor/WordCountModal.jsx';
import KeyboardShortcutsModal from '../components/editor/KeyboardShortcutsModal.jsx';
import SelectionBubbleMenu from '../components/editor/SelectionBubbleMenu.jsx';
import { cn } from '../utils/helpers.js';
import { FileText, Eye, CheckCircle2, Clock, Sparkles } from 'lucide-react';

const RichTextEditor = ({
  value = '',
  onChange,
  placeholder = 'Type @ to insert, or write your document here...',
  className = '',
  collaboration,
  onSeedApplied,
  onSave,
  onExportPdf,
  onExportDocx,
  onExportTxt,
  onExportMd,
  onExportHtml,
  onNewDocument,
  onDeleteDocument,
  isGuest = false,
  saveStatus = ''
}) => {
  const collaborationEnabled = Boolean(collaboration?.enabled && collaboration?.provider && collaboration?.ydoc);

  // Modals state
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isFindReplaceOpen, setIsFindReplaceOpen] = useState(false);
  const [isWordCountOpen, setIsWordCountOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: !collaborationEnabled,
        heading: {
          levels: [1, 2, 3]
        }
      }),
      Underline,
      Subscript,
      Superscript,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline cursor-pointer hover:text-blue-800'
        }
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph']
      }),
      Placeholder.configure({
        placeholder
      }),
      Image.configure({
        inline: true,
        allowBase64: true
      }),
      Table.configure({
        resizable: true
      }),
      TableRow,
      TableHeader,
      TableCell,
      TaskList,
      TaskItem.configure({
        nested: true
      }),
      CharacterCount,
      ...(collaborationEnabled
        ? [
            Collaboration.configure({ document: collaboration.ydoc }),
            CollaborationCursor.configure({
              provider: collaboration.provider,
              user: collaboration.user
            })
          ]
        : [])
    ],
    content: collaborationEnabled ? undefined : value,
    onUpdate: ({ editor: currentEditor }) => {
      onChange?.(currentEditor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'outline-none focus:outline-none'
      }
    }
  }, [collaborationEnabled, collaboration?.provider, collaboration?.ydoc, collaboration?.user?.id]);

  // Synchronize non-collab value changes
  useEffect(() => {
    if (!collaborationEnabled && editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '', false);
    }
  }, [value, editor, collaborationEnabled]);

  // Handle seed applied for collaborative documents
  useEffect(() => {
    if (!editor || !collaborationEnabled || !collaboration?.canSeed) {
      return;
    }

    if (editor.isEmpty && value) {
      editor.commands.setContent(value, false);
      onSeedApplied?.();
    }
  }, [editor, collaborationEnabled, collaboration?.canSeed, value, onSeedApplied]);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleGlobalKeys = (e) => {
      // Ctrl+S or Cmd+S -> Save
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        onSave?.();
      }
      // Ctrl+F or Cmd+F -> Find & Replace
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        setIsFindReplaceOpen(true);
      }
      // Ctrl+Shift+C -> Word count
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        setIsWordCountOpen(true);
      }
      // Ctrl+K -> Insert link
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsLinkModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleGlobalKeys);
    return () => window.removeEventListener('keydown', handleGlobalKeys);
  }, [onSave]);

  const handleApplyLink = ({ url, text }) => {
    if (!editor) return;
    if (text && editor.state.selection.empty) {
      editor.chain().focus().insertContent(`<a href="${url}">${text}</a>`).run();
    } else {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const handleInsertImage = ({ url, alt }) => {
    if (!editor) return;
    editor.chain().focus().setImage({ src: url, alt }).run();
  };

  // Live document statistics
  const wordCount = editor?.storage?.characterCount?.words?.() ?? (editor?.getText().trim() ? editor.getText().trim().split(/\s+/).length : 0);
  const charCount = editor?.storage?.characterCount?.characters?.() ?? (editor?.getText().length || 0);
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  if (!editor) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-slate-200 bg-white p-8">
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          Loading Google Docs editor...
        </div>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col rounded-2xl border border-slate-200/90 bg-white shadow-xl overflow-hidden', className)}>
      {/* Menu Bar: File, Edit, View, Insert, Format, Tools, Help */}
      <EditorMenuBar
        editor={editor}
        onSave={onSave}
        onExportPdf={onExportPdf}
        onExportDocx={onExportDocx}
        onExportTxt={onExportTxt}
        onExportMd={onExportMd}
        onExportHtml={onExportHtml}
        onOpenFindReplace={() => setIsFindReplaceOpen(true)}
        onOpenWordCount={() => setIsWordCountOpen(true)}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onOpenInsertLink={() => setIsLinkModalOpen(true)}
        onOpenInsertImage={() => setIsImageModalOpen(true)}
        onNewDocument={onNewDocument}
        onDeleteDocument={onDeleteDocument}
        isGuest={isGuest}
      />

      {/* Formatting Toolbar */}
      <EditorToolbar
        editor={editor}
        onOpenInsertLink={() => setIsLinkModalOpen(true)}
        onOpenInsertImage={() => setIsImageModalOpen(true)}
      />

      {/* Bubble Menu on text selection */}
      <SelectionBubbleMenu editor={editor} />

      {/* Google Docs Canvas Workspace (Grey desktop background with centered white paper sheet) */}
      <div className="min-h-[750px] bg-[#f0f4f9] px-4 py-8 sm:px-8 overflow-y-auto flex flex-col items-center">
        {/* Paper Sheet */}
        <div
          style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
          className="docs-page-canvas w-full max-w-[850px] min-h-[1050px] bg-white rounded-sm shadow-md hover:shadow-lg transition-shadow border border-slate-200/70"
        >
          <EditorContent editor={editor} />
        </div>
      </div>

      {/* Google Docs Editor Footer Stats Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-white px-4 py-2 text-xs text-slate-500 editor-footer no-print">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setIsWordCountOpen(true)}
            className="flex items-center gap-1.5 hover:text-blue-600 transition"
          >
            <FileText size={13} />
            <span>{wordCount.toLocaleString()} words &bull; {charCount.toLocaleString()} chars</span>
          </button>
          <span className="hidden sm:inline-flex items-center gap-1">
            <Clock size={13} />
            <span>{readingTime} min read</span>
          </span>
          {saveStatus && (
            <span className="hidden md:inline-flex items-center gap-1 text-slate-600 font-medium">
              <CheckCircle2 size={13} className="text-emerald-500" />
              <span>{saveStatus}</span>
            </span>
          )}
        </div>

        {/* Zoom Controls & Help */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Eye size={13} />
            <select
              value={zoomLevel}
              onChange={(e) => setZoomLevel(Number(e.target.value))}
              className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-700 outline-none cursor-pointer hover:bg-slate-200"
            >
              <option value="75">75%</option>
              <option value="90">90%</option>
              <option value="100">100%</option>
              <option value="110">110%</option>
              <option value="125">125%</option>
              <option value="150">150%</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => setIsShortcutsOpen(true)}
            className="flex items-center gap-1 text-slate-400 hover:text-slate-700 transition"
            title="Shortcuts"
          >
            <Sparkles size={13} />
            <span className="hidden sm:inline">Shortcuts</span>
          </button>
        </div>
      </div>

      {/* Modals & Dialogs */}
      <InsertLinkModal
        isOpen={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
        onSave={handleApplyLink}
        initialText={editor.state.doc.textBetween(editor.state.selection.from, editor.state.selection.to)}
      />

      <InsertImageModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        onInsert={handleInsertImage}
      />

      <FindReplaceModal
        isOpen={isFindReplaceOpen}
        onClose={() => setIsFindReplaceOpen(false)}
        editor={editor}
      />

      <WordCountModal
        isOpen={isWordCountOpen}
        onClose={() => setIsWordCountOpen(false)}
        editor={editor}
      />

      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </div>
  );
};

export default RichTextEditor;
