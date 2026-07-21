import Button from '../common/Button.jsx';

const ExportActions = ({ onPdf, onDocx, className = '' }) => (
  <div className={`flex flex-wrap gap-3 ${className}`}>
    <Button type="button" variant="secondary" onClick={onPdf}>
      Export PDF
    </Button>
    <Button type="button" onClick={onDocx}>
      Export DOCX
    </Button>
  </div>
);

export default ExportActions;
