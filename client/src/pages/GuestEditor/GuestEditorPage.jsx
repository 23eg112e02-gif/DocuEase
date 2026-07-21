import { useEditorContext } from '../../context/useEditorContext.js';
import { useMemo } from 'react';
import Card from '../../components/common/Card.jsx';
import Input from '../../components/common/Input.jsx';
import RichTextEditor from '../../editor/RichTextEditor.jsx';
import ExportActions from '../../components/export/ExportActions.jsx';
import { exportDocx, exportPdf } from '../../services/exportService.js';

const GuestEditorPage = () => {
  const { guestDocument, setGuestTitle, setGuestContent, resetGuestDocument } = useEditorContext();

  const exportPayload = useMemo(
    () => ({
      title: guestDocument.title,
      content: guestDocument.content
    }),
    [guestDocument.content, guestDocument.title]
  );

  return (
    <div className="space-y-6">
      <Card className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent-600">Guest mode</p>
            <h1 className="text-3xl font-bold text-ink-900">Edit instantly without signing in</h1>
            <p className="text-sm text-slate-600">This editor is browser-local only. Nothing is persisted to MongoDB.</p>
          </div>
          <ExportActions
            onPdf={() => exportPdf(exportPayload)}
            onDocx={() => exportDocx(exportPayload)}
          />
        </div>
        <Input label="Document title" value={guestDocument.title} onChange={(event) => setGuestTitle(event.target.value)} />
      </Card>

      <RichTextEditor value={guestDocument.content} onChange={setGuestContent} placeholder="Write as a guest..." />

      <div className="flex justify-end">
        <button
          type="button"
          onClick={resetGuestDocument}
          className="text-sm font-semibold text-slate-500 transition hover:text-accent-600"
        >
          Reset guest draft
        </button>
      </div>
    </div>
  );
};

export default GuestEditorPage;
