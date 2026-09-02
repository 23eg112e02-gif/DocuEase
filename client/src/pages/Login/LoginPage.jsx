import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import AuthForm from '../../components/auth/AuthForm.jsx';
import Input from '../../components/common/Input.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { createDocument } from '../../services/documentService.js';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form);

      // If came from guest mode, migrate guest draft
      if (location.state?.fromGuest) {
        try {
          const raw = localStorage.getItem('docuease_guest_document');
          if (raw) {
            const guestDoc = JSON.parse(raw);
            if (guestDoc.content) {
              const res = await createDocument({
                title: guestDoc.title || 'Migrated Guest Document',
                content: guestDoc.content,
                status: 'draft',
                source: 'manual'
              });
              navigate(`/documents/${res.document._id}`, { replace: true });
              return;
            }
          }
        } catch (_e) {}
      }

      navigate(location.state?.from?.pathname || '/dashboard', { replace: true });
    } catch (requestError) {
      setError(requestError?.response?.data?.message || 'Unable to log in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthForm
      title="Welcome back"
      subtitle="Sign in to access your persistent Google Docs, uploads, and collaborative files."
      actionLabel={loading ? 'Logging in...' : 'Sign In'}
      onSubmit={handleSubmit}
      footer={
        <>
          No account yet? <Link to="/register" state={location.state} className="font-semibold text-blue-600 hover:underline">Create one</Link>
        </>
      }
    >
      {error ? <div className="rounded-xl bg-red-50 p-3 text-xs text-red-700 border border-red-200">{error}</div> : null}
      <Input label="Email" name="email" type="email" autoComplete="email" value={form.email} onChange={handleChange} required />
      <Input label="Password" name="password" type="password" autoComplete="current-password" value={form.password} onChange={handleChange} required />
    </AuthForm>
  );
};

export default LoginPage;
