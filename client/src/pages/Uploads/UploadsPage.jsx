import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import UploadForm from '../../components/upload/UploadForm.jsx';
import { listUploads, uploadFile, deleteUpload } from '../../services/uploadService.js';
import { formatDateTime } from '../../utils/formatter.js';
import { FileText, Trash2, FileCode, CheckCircle2, ArrowRight, ExternalLink } from 'lucide-react';

const UploadsPage = () => {
  const navigate = useNavigate();
  const [uploads, setUploads] = useState([]);
  const [file, setFile] = useState(null);
  const [importAsDocument, setImportAsDocument] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [importedDoc, setImportedDoc] = useState(null);

  const refreshUploads = async () => {
    try {
      const data = await listUploads();
      setUploads(data.uploads || []);
    } catch (_e) {}
  };

  useEffect(() => {
    refreshUploads();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setMessage('Choose a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('importAsDocument', String(importAsDocument));

    setLoading(true);
    setMessage('');
    setImportedDoc(null);
    try {
      const result = await uploadFile(formData);
      setFile(null);
      await refreshUploads();
      setMessage('File processed successfully');

      if (result.importedDocument?._id) {
        setImportedDoc(result.importedDocument);
      }
    } catch (error) {
      setMessage(error?.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (uploadId) => {
    if (window.confirm('Delete this uploaded file?')) {
      try {
        await deleteUpload(uploadId);
        await refreshUploads();
      } catch (_e) {
        alert('Failed to delete upload');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-blue-600">Files & Imports</span>
        <h1 className="text-3xl font-bold text-slate-900">Document Upload Hub</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4">
          <UploadForm
            onSubmit={handleSubmit}
            onFileChange={(event) => setFile(event.target.files?.[0] || null)}
            importAsDocument={importAsDocument}
            onImportToggle={(event) => setImportAsDocument(event.target.checked)}
            fileName={file?.name || ''}
            loading={loading}
          />

          {importedDoc && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 animate-in fade-in space-y-3">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                <CheckCircle2 size={18} />
                <span>Document Created Successfully!</span>
              </div>
              <p className="text-xs text-emerald-700">
                "{importedDoc.title}" has been added to your documents library.
              </p>
              <Button as={Link} to={`/documents/${importedDoc._id}`} variant="primary" className="text-xs">
                Open in Editor <ArrowRight size={14} className="ml-1 inline" />
              </Button>
            </div>
          )}
        </div>

        <Card className="space-y-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Upload History ({uploads.length})</h2>
              <p className="text-xs text-slate-500">Previously uploaded files in your account</p>
            </div>
          </div>

          {message && !importedDoc && (
            <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-700 border border-slate-200">
              {message}
            </div>
          )}

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {uploads.map((upload) => (
              <div
                key={upload._id}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 p-3 text-xs hover:bg-slate-100 transition"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-600 shrink-0">
                    <FileText size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 truncate max-w-xs">{upload.originalName}</p>
                    <p className="text-[11px] text-slate-500">{upload.fileType} &bull; {formatDateTime(upload.createdAt)}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDelete(upload._id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                  title="Delete record"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}

            {!uploads.length && (
              <div className="py-12 text-center text-slate-400">
                <FileCode size={32} className="mx-auto mb-2 text-slate-300" />
                <p className="text-xs">No files uploaded yet.</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default UploadsPage;
