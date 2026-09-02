import { FloatingMenu } from '@tiptap/react';
import { cn } from '../../utils/helpers.js';

const SlashCommandMenu = ({ editor, open, commands, activeIndex, onPick, query }) => {
  if (!editor || !open) {
    return null;
  }

  return (
    <FloatingMenu
      editor={editor}
      shouldShow={() => open}
      tippyOptions={{ duration: 120, placement: 'right-start', offset: [0, 12] }}
    >
      <div className="w-[340px] overflow-hidden rounded-[24px] border border-slate-200 bg-white/96 shadow-2xl backdrop-blur-md">
        <div className="border-b border-slate-100 px-4 py-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-accent-600">Slash commands</p>
          <p className="mt-1 text-sm text-slate-500">Start with / to insert structure quickly</p>
        </div>
        <div className="max-h-72 overflow-y-auto p-2">
          {commands.length > 0 ? (
            commands.map((command, index) => (
              <button
                key={command.label}
                type="button"
                className={cn(
                  'flex w-full items-start gap-3 rounded-2xl px-3 py-3 text-left transition',
                  index === activeIndex ? 'bg-accent-50 text-ink-900' : 'hover:bg-slate-50'
                )}
                onMouseDown={(event) => {
                  event.preventDefault();
                  onPick(index);
                }}
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-xs font-bold text-white">
                  {command.shortcut}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-ink-900">{command.label}</div>
                  <div className="mt-0.5 text-xs text-slate-500">{command.description}</div>
                </div>
              </button>
            ))
          ) : (
            <div className="px-3 py-4 text-sm text-slate-500">No commands match “{query}”</div>
          )}
        </div>
      </div>
    </FloatingMenu>
  );
};

export default SlashCommandMenu;