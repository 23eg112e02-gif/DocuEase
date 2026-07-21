import Button from '../common/Button.jsx';
import Card from '../common/Card.jsx';

const UploadForm = ({ onSubmit, onFileChange, importAsDocument, onImportToggle, fileName, loading }) => (
  <Card className="space-y-5">
    <div>
      <h2 className="text-xl font-semibold text-ink-900">Upload file</h2>
      <p className="text-sm text-slate-600">Import PDF, DOCX, or TXT files into your account.</p>
    </div>
    <form className="space-y-4" onSubmit={onSubmit}>
      <input
        type="file"
        accept=".pdf,.docx,.txt"
        onChange={onFileChange}
        className="block w-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-700"
      />
      {fileName ? <p className="text-sm text-slate-600">Selected: {fileName}</p> : null}
      <label className="flex items-center gap-3 text-sm text-slate-700">
        <input type="checkbox" checked={importAsDocument} onChange={onImportToggle} />
        Import the parsed content as a document
      </label>
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Uploading...' : 'Upload'}
      </Button>
    </form>
  </Card>
);

export default UploadForm;
