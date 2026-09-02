import { cn } from '../../utils/helpers.js';

const PresenceStack = ({ users = [] }) => {
  if (users.length === 0) {
    return (
      <div className="inline-flex items-center rounded-full border border-slate-200 bg-white/90 px-3 py-1 text-xs font-semibold text-slate-500">
        No collaborators online
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-3">
      <div className="flex -space-x-2">
        {users.slice(0, 6).map((user) => (
          <div
            key={user.id}
            title={user.name}
            className={cn(
              'inline-flex h-9 w-9 items-center justify-center rounded-full border-2 border-white text-[11px] font-bold text-white shadow-md ring-1 ring-black/5',
              'transition-transform hover:z-10 hover:scale-110'
            )}
            style={{ backgroundColor: user.color }}
          >
            {user.initials}
          </div>
        ))}
      </div>
      {users.length > 6 ? <span className="text-xs font-semibold text-slate-600">+{users.length - 6} online</span> : null}
    </div>
  );
};

export default PresenceStack;
