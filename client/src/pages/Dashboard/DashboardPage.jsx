import { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import DocumentTable from '../../components/dashboard/DocumentTable.jsx';
import { api } from '../../services/api.js';
import { createDocument, duplicateDocument, deleteDocument } from '../../services/documentService.js';
import { exportDocx, exportPdf } from '../../services/exportService.js';
import { formatDateTime, truncateText, titleCase } from '../../utils/formatter.js';
import { DOCUMENT_TEMPLATES } from '../../utils/templates.js';
import {
  Plus, Search, LayoutGrid, List as ListIcon, MoreVertical, 
  Copy, Trash2, Download, FileText, Upload, Clock, Filter,
  FilePlus, ExternalLink, Sparkles
} from 'lucide-react';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ documents: [], uploads: [], stats: { documentCount: 0, uploadCount: 0 } });
  
  // Dashboard UI state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'draft' | 'published' | 'archived'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [activeMenuDocId, setActiveMenuDocId] = useState(null);
  const [actionMessage, setActionMessage] = useState('');

  const loadDashboard = async () => {
    try {
      const res = await api.get('/dashboard');
      setData(res.data.data);
    } catch (_e) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  // Filter documents
  const filteredDocuments = useMemo(() => {
    return (data.documents || []).filter((doc) => {
      const matchesSearch = !searchQuery.trim() || 
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.content?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [data.documents, searchQuery, statusFilter]);

  const handleCreateFromTemplate = async (template) => {
    try {
      const doc = await createDocument({
        title: template.title,
        content: template.content,
        status: 'draft',
        source: 'manual'
      });
      navigate(`/documents/${doc.document._id}`);
    } catch (_e) {
      alert('Error creating document from template');
    }
  };

  const handleDuplicate = async (docId) => {
    setActiveMenuDocId(null);
    try {
      await duplicateDocument(docId);
      await loadDashboard();
      setActionMessage('Document duplicated successfully');
      setTimeout(() => setActionMessage(''), 3000);
    } catch (_e) {
      alert('Error duplicating document');
    }
  };

  const handleDelete = async (docId) => {
    setActiveMenuDocId(null);
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await deleteDocument(docId);
        await loadDashboard();
        setActionMessage('Document deleted');
        setTimeout(() => setActionMessage(''), 3000);
      } catch (_e) {
        alert('Error deleting document');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-slate-600">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          Loading your Google Docs workspace...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-6">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-blue-600">Workspace</span>
          <h1 className="text-3xl font-bold text-slate-900">Documents Dashboard</h1>
        </div>

        <div className="flex items-center gap-3">
          <Button as={Link} to="/documents/new" variant="primary" className="flex items-center gap-2">
            <Plus size={16} />
            <span>Blank Document</span>
          </Button>
          <Button as={Link} to="/uploads" variant="secondary" className="flex items-center gap-2">
            <Upload size={16} />
            <span>Import File</span>
          </Button>
        </div>
      </div>

      {actionMessage && (
        <div className="rounded-xl bg-blue-50 border border-blue-200 p-3 text-xs text-blue-800 animate-in fade-in">
          {actionMessage}
        </div>
      )}

      {/* Google Docs Template Gallery */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Start a new document</h2>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {DOCUMENT_TEMPLATES.map((tmpl) => (
            <div
              key={tmpl.id}
              onClick={() => handleCreateFromTemplate(tmpl)}
              className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-4 shadow-xs transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md flex flex-col justify-between min-h-[140px]"
            >
              <div className="space-y-2">
                <div className="h-12 w-10 rounded-lg border border-slate-200 bg-slate-50 p-2 shadow-xs group-hover:border-blue-200 group-hover:bg-blue-50/50 transition">
                  <div className="h-1.5 w-6 rounded bg-slate-300 group-hover:bg-blue-400 mb-1" />
                  <div className="h-1 w-4 rounded bg-slate-200 mb-1" />
                  <div className="h-1 w-5 rounded bg-slate-200" />
                </div>
                <h3 className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition">
                  {tmpl.title}
                </h3>
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-2">{tmpl.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Document Library Section: Search, Filters, View Modes */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <h2 className="text-xl font-bold text-slate-900">Recent Documents</h2>

          {/* Search bar */}
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-4 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Status Filter */}
            <div className="flex rounded-xl bg-slate-100 p-1">
              {['all', 'draft', 'published', 'archived'].map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold capitalize transition ${
                    statusFilter === status
                      ? 'bg-white text-blue-600 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            {/* View Mode Switcher */}
            <div className="flex rounded-xl bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                title="Grid view"
                className={`p-1.5 rounded-lg transition ${
                  viewMode === 'grid' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <LayoutGrid size={15} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                title="Table view"
                className={`p-1.5 rounded-lg transition ${
                  viewMode === 'table' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <ListIcon size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* View Mode: Grid View Cards */}
        {viewMode === 'grid' ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredDocuments.map((doc) => (
              <div
                key={doc._id}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-xs transition hover:border-blue-300 hover:shadow-md"
              >
                <Link to={`/documents/${doc._id}`} className="space-y-3 block">
                  {/* Card Preview Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                        <FileText size={18} />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition truncate max-w-[160px]">
                          {doc.title}
                        </h3>
                        <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          doc.status === 'published' ? 'bg-emerald-50 text-emerald-700' :
                          doc.status === 'archived' ? 'bg-slate-100 text-slate-600' : 'bg-blue-50 text-blue-700'
                        }`}>
                          {doc.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Document snippet preview */}
                  <p className="text-xs text-slate-500 line-clamp-3 min-h-[48px] bg-slate-50/60 p-2 rounded-xl border border-slate-100">
                    {doc.content?.replace(/<[^>]+>/g, '') || 'Empty document...'}
                  </p>
                </Link>

                {/* Footer info & 3-dots Menu */}
                <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {formatDateTime(doc.updatedAt)}
                  </span>

                  {/* 3-dots Menu */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuDocId(activeMenuDocId === doc._id ? null : doc._id);
                      }}
                      className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                    >
                      <MoreVertical size={15} />
                    </button>

                    {activeMenuDocId === doc._id && (
                      <div className="absolute right-0 bottom-full mb-1 z-30 w-44 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl text-xs space-y-1">
                        <Link
                          to={`/documents/${doc._id}`}
                          className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                        >
                          <ExternalLink size={14} /> Open Document
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDuplicate(doc._id)}
                          className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-slate-700 hover:bg-blue-50 hover:text-blue-700 text-left"
                        >
                          <Copy size={14} /> Duplicate
                        </button>
                        <button
                          type="button"
                          onClick={() => exportPdf({ documentId: doc._id, title: doc.title, content: doc.content })}
                          className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-slate-700 hover:bg-blue-50 hover:text-blue-700 text-left"
                        >
                          <Download size={14} /> Export PDF
                        </button>
                        <button
                          type="button"
                          onClick={() => exportDocx({ documentId: doc._id, title: doc.title, content: doc.content })}
                          className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-slate-700 hover:bg-blue-50 hover:text-blue-700 text-left"
                        >
                          <Download size={14} /> Export Word
                        </button>
                        <div className="my-1 border-t border-slate-100" />
                        <button
                          type="button"
                          onClick={() => handleDelete(doc._id)}
                          className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-red-600 hover:bg-red-50 text-left"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {!filteredDocuments.length && (
              <div className="col-span-full rounded-2xl border border-dashed border-slate-300 p-12 text-center">
                <FileText className="mx-auto text-slate-400" size={32} />
                <h3 className="mt-2 text-sm font-bold text-slate-700">No documents found</h3>
                <p className="text-xs text-slate-500 mt-1">Create a new document or pick a template above.</p>
              </div>
            )}
          </div>
        ) : (
          <DocumentTable documents={filteredDocuments} />
        )}
      </section>

      {/* Uploads Quick Summary */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Upload size={18} className="text-blue-600" />
            <h2 className="text-lg font-bold text-slate-900">Uploaded Files ({data.stats.uploadCount})</h2>
          </div>
          <Button as={Link} to="/uploads" variant="secondary" className="text-xs px-3 py-1.5">
            Manage Files
          </Button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {data.uploads.slice(0, 3).map((upload) => (
            <div key={upload._id} className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs space-y-1">
              <p className="font-bold text-slate-800 truncate">{upload.originalName}</p>
              <p className="text-slate-500">{upload.fileType}</p>
              <p className="text-[10px] text-slate-400">{formatDateTime(upload.createdAt)}</p>
            </div>
          ))}
          {!data.uploads.length && (
            <p className="text-xs text-slate-400 py-2">No files uploaded yet.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
