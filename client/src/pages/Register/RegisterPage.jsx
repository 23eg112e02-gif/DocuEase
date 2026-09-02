import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import AuthForm from '../../components/auth/AuthForm.jsx';
import Input from '../../components/common/Input.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { createDocument } from '../../services/documentService.js';

const RegisterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
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
      await register(form);

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

      navigate('/dashboard', { replace: true });
    } catch (requestError) {
      setError(requestError?.response?.data?.message || 'Unable to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthForm
      title="Create your account"
      subtitle="Save documents, collaborate in real-time, and access your dashboard."
      actionLabel={loading ? 'Creating account...' : 'Create Free Account'}
      onSubmit={handleSubmit}
      footer={
        <>
          Already registered? <Link to="/login" state={location.state} className="font-semibold text-blue-600 hover:underline">Log in</Link>
        </>
      }
    >
      {error ? <div className="rounded-xl bg-red-50 p-3 text-xs text-red-700 border border-red-200">{error}</div> : null}
      <Input label="Name" name="name" type="text" autoComplete="name" value={form.name} onChange={handleChange} required />
      <Input label="Email" name="email" type="email" autoComplete="email" value={form.email} onChange={handleChange} required />
      <Input label="Password" name="password" type="password" autoComplete="new-password" value={form.password} onChange={handleChange} required />
    </AuthForm>
  );
};

export default RegisterPage;
