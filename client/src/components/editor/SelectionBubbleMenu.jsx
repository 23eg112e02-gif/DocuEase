import { BubbleMenu } from '@tiptap/react';
import Button from '../common/Button.jsx';
import { cn } from '../../utils/helpers.js';

const BubbleAction = ({ active, onClick, children }) => (
  <Button
    variant={active ? 'primary' : 'secondary'}
    className={cn('h-8 rounded-full px-3 text-xs shadow-none', active && 'ring-0')}
    onClick={onClick}
    type="button"
  >
    {children}
  </Button>
);

const SelectionBubbleMenu = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <BubbleMenu
      editor={editor}
      shouldShow={({ editor: currentEditor }) => currentEditor.isEditable && !currentEditor.state.selection.empty}
      tippyOptions={{ duration: 120, placement: 'top', offset: [0, 10] }}
    >
      <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/95 px-2 py-2 shadow-xl backdrop-blur-md">
        <BubbleAction active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
          Bold
        </BubbleAction>
        <BubbleAction active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>
          Italic
        </BubbleAction>
        <BubbleAction active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}>
          Underline
        </BubbleAction>
        <BubbleAction active={editor.isActive('code')} onClick={() => editor.chain().focus().toggleCode().run()}>
          Code
        </BubbleAction>
      </div>
    </BubbleMenu>
  );
};

export default SelectionBubbleMenu;