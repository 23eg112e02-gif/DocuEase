import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import AuthForm from '../../components/auth/AuthForm.jsx';
import Input from '../../components/common/Input.jsx';
import { useAuth } from '../../hooks/useAuth.js';

const RegisterPage = () => {
  const navigate = useNavigate();
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
      subtitle="Save documents, keep uploads, and unlock the dashboard."
      actionLabel={loading ? 'Creating...' : 'Register'}
      onSubmit={handleSubmit}
      footer={
        <>
          Already registered? <Link to="/login" className="font-semibold text-accent-600">Log in</Link>
        </>
      }
    >
      {error ? <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}
      <Input label="Name" name="name" type="text" autoComplete="name" value={form.name} onChange={handleChange} required />
      <Input label="Email" name="email" type="email" autoComplete="email" value={form.email} onChange={handleChange} required />
      <Input label="Password" name="password" type="password" autoComplete="new-password" value={form.password} onChange={handleChange} required />
    </AuthForm>
  );
};

export default RegisterPage;
