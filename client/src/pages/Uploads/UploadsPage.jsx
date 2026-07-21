import { useEffect, useState } from 'react';
import Card from '../../components/common/Card.jsx';
import UploadForm from '../../components/upload/UploadForm.jsx';
import { listUploads, uploadFile } from '../../services/uploadService.js';
import { formatDateTime } from '../../utils/formatter.js';

const UploadsPage = () => {
  const [uploads, setUploads] = useState([]);
  const [file, setFile] = useState(null);
  const [importAsDocument, setImportAsDocument] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const refreshUploads = async () => {
    const data = await listUploads();
    setUploads(data.uploads || []);
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
    try {
      await uploadFile(formData);
      setFile(null);
      setImportAsDocument(false);
      await refreshUploads();
      setMessage('Upload complete');
    } catch (error) {
      setMessage(error?.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <UploadForm
        onSubmit={handleSubmit}
        onFileChange={(event) => setFile(event.target.files?.[0] || null)}
        importAsDocument={importAsDocument}
        onImportToggle={(event) => setImportAsDocument(event.target.checked)}
        fileName={file?.name || ''}
        loading={loading}
      />
      <Card className="space-y-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent-600">Upload history</p>
          <h1 className="text-3xl font-bold text-ink-900">Recent files</h1>
        </div>
        {message ? <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">{message}</div> : null}
        <div className="space-y-3">
          {uploads.map((upload) => (
            <Card key={upload._id} className="p-4">
              <p className="font-semibold text-ink-900">{upload.originalName}</p>
              <p className="text-sm text-slate-600">{upload.fileType}</p>
              <p className="mt-2 text-xs text-slate-500">{formatDateTime(upload.createdAt)}</p>
            </Card>
          ))}
          {!uploads.length ? <p className="text-sm text-slate-500">No uploads yet.</p> : null}
        </div>
      </Card>
    </div>
  );
};

export default UploadsPage;
