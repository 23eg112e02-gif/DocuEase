import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import AuthForm from '../../components/auth/AuthForm.jsx';
import Input from '../../components/common/Input.jsx';
import { useAuth } from '../../hooks/useAuth.js';

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
      subtitle="Log in to access persistent documents, uploads, and dashboard history."
      actionLabel={loading ? 'Logging in...' : 'Login'}
      onSubmit={handleSubmit}
      footer={
        <>
          No account yet? <Link to="/register" className="font-semibold text-accent-600">Create one</Link>
        </>
      }
    >
      {error ? <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}
      <Input label="Email" name="email" type="email" autoComplete="email" value={form.email} onChange={handleChange} required />
      <Input label="Password" name="password" type="password" autoComplete="current-password" value={form.password} onChange={handleChange} required />
    </AuthForm>
  );
};

export default LoginPage;
