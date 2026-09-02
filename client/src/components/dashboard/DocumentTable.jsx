import { Link } from 'react-router-dom';
import Card from '../common/Card.jsx';
import Button from '../common/Button.jsx';
import { formatDateTime, truncateText, titleCase } from '../../utils/formatter.js';
import { FileText, ExternalLink } from 'lucide-react';

const DocumentTable = ({ documents = [] }) => (
  <Card className="overflow-hidden p-0 rounded-2xl border border-slate-200">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
        <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider">
          <tr>
            <th className="px-6 py-3.5">Name</th>
            <th className="px-6 py-3.5">Status</th>
            <th className="px-6 py-3.5">Last modified</th>
            <th className="px-6 py-3.5">Preview</th>
            <th className="px-6 py-3.5 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {documents.map((document) => (
            <tr key={document._id} className="hover:bg-blue-50/40 transition">
              <td className="px-6 py-4 font-bold text-slate-900">
                <Link to={`/documents/${document._id}`} className="flex items-center gap-2 text-slate-900 hover:text-blue-600">
                  <FileText size={16} className="text-blue-500 shrink-0" />
                  <span className="truncate max-w-xs">{document.title}</span>
                </Link>
              </td>
              <td className="px-6 py-4">
                <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                  document.status === 'published' ? 'bg-emerald-50 text-emerald-700' :
                  document.status === 'archived' ? 'bg-slate-100 text-slate-600' : 'bg-blue-50 text-blue-700'
                }`}>
                  {titleCase(document.status)}
                </span>
              </td>
              <td className="px-6 py-4 text-slate-500 whitespace-nowrap">{formatDateTime(document.updatedAt)}</td>
              <td className="max-w-xs px-6 py-4 text-slate-500 truncate">
                {truncateText(document.content?.replace(/<[^>]+>/g, ''), 70) || 'Empty document'}
              </td>
              <td className="px-6 py-4 text-right">
                <Button as={Link} to={`/documents/${document._id}`} variant="secondary" className="px-3 py-1 text-xs">
                  <ExternalLink size={13} className="mr-1 inline" /> Open
                </Button>
              </td>
            </tr>
          ))}
          {!documents.length ? (
            <tr>
              <td className="px-6 py-12 text-center text-slate-400" colSpan="5">
                No documents found.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  </Card>
);

export default DocumentTable;
