import { Link } from 'react-router-dom';
import Card from '../common/Card.jsx';
import Button from '../common/Button.jsx';
import { formatDateTime, truncateText, titleCase } from '../../utils/formatter.js';

const DocumentTable = ({ documents = [] }) => (
  <Card className="overflow-hidden p-0">
    <div className="border-b border-slate-200 px-6 py-4">
      <h2 className="text-lg font-semibold text-ink-900">Documents</h2>
    </div>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
        <thead className="bg-slate-50 text-slate-500">
          <tr>
            <th className="px-6 py-3 font-medium">Title</th>
            <th className="px-6 py-3 font-medium">Status</th>
            <th className="px-6 py-3 font-medium">Updated</th>
            <th className="px-6 py-3 font-medium">Preview</th>
            <th className="px-6 py-3 font-medium" />
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {documents.map((document) => (
            <tr key={document._id}>
              <td className="px-6 py-4 font-medium text-ink-900">{document.title}</td>
              <td className="px-6 py-4 text-slate-600">{titleCase(document.status)}</td>
              <td className="px-6 py-4 text-slate-600">{formatDateTime(document.updatedAt)}</td>
              <td className="max-w-sm px-6 py-4 text-slate-600">{truncateText(document.content?.replace(/<[^>]+>/g, ''), 80)}</td>
              <td className="px-6 py-4">
                <Button as={Link} to={`/documents/${document._id}`} variant="secondary" className="px-3 py-1.5 text-xs">
                  Open
                </Button>
              </td>
            </tr>
          ))}
          {!documents.length ? (
            <tr>
              <td className="px-6 py-10 text-center text-slate-500" colSpan="5">
                No documents yet.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  </Card>
);

export default DocumentTable;
