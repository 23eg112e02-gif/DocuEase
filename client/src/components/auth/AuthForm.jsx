import Card from '../common/Card.jsx';
import Button from '../common/Button.jsx';

const AuthForm = ({ title, subtitle, children, onSubmit, actionLabel, footer }) => (
  <Card className="mx-auto w-full max-w-lg space-y-6 p-8">
    <div className="space-y-2">
      <h1 className="text-3xl font-bold text-ink-900">{title}</h1>
      {subtitle ? <p className="text-sm text-slate-600">{subtitle}</p> : null}
    </div>
    <form className="space-y-4" onSubmit={onSubmit}>
      {children}
      <Button type="submit" className="w-full">
        {actionLabel}
      </Button>
    </form>
    {footer ? <div className="text-center text-sm text-slate-600">{footer}</div> : null}
  </Card>
);

export default AuthForm;
