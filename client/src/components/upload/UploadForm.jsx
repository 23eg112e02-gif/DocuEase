import { useState, useRef } from 'react';
import Button from '../common/Button.jsx';
import Card from '../common/Card.jsx';
import { Upload, FileType, CheckCircle, FileText } from 'lucide-react';

const UploadForm = ({ onSubmit, onFileChange, importAsDocument, onImportToggle, fileName, loading }) => {
  const fileInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      onFileChange({ target: { files: [file] } });
    }
  };

  return (
    <Card className="space-y-5 rounded-2xl border border-slate-200 shadow-xs">
      <div>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
            <Upload size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Upload & Import Files</h2>
            <p className="text-xs text-slate-500">PDF, Word (DOCX), and Plain Text (TXT)</p>
          </div>
        </div>
      </div>

      <form className="space-y-4" onSubmit={onSubmit}>
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition flex flex-col items-center justify-center gap-2 ${
            isDragOver
              ? 'border-blue-500 bg-blue-50/60'
              : fileName
              ? 'border-emerald-400 bg-emerald-50/40'
              : 'border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-slate-100/60'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            accept=".pdf,.docx,.txt"
            onChange={onFileChange}
            className="hidden"
          />

          {fileName ? (
            <>
              <CheckCircle className="text-emerald-500" size={32} />
              <p className="text-sm font-bold text-slate-800">{fileName}</p>
              <p className="text-xs text-slate-500">Click or drop to replace</p>
            </>
          ) : (
            <>
              <Upload className="text-slate-400" size={32} />
              <p className="text-sm font-bold text-slate-700">Drag & drop your file here, or browse</p>
              <p className="text-xs text-slate-500">Supports PDF, DOCX, TXT up to 10MB</p>
            </>
          )}
        </div>

        <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 border border-slate-200">
          <input
            type="checkbox"
            id="importCheck"
            checked={importAsDocument}
            onChange={onImportToggle}
            className="h-4 w-4 rounded text-blue-600 accent-blue-600 cursor-pointer"
          />
          <label htmlFor="importCheck" className="text-xs font-semibold text-slate-700 cursor-pointer select-none">
            Convert into an editable document automatically
          </label>
        </div>

        <Button type="submit" disabled={loading || !fileName} className="w-full">
          {loading ? 'Processing & Uploading...' : 'Upload & Process File'}
        </Button>
      </form>
    </Card>
  );
};

export default UploadForm;
