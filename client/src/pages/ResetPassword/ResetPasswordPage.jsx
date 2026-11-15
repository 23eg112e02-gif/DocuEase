import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import AuthForm from '../../components/auth/AuthForm.jsx';
import Input from '../../components/common/Input.jsx';
import { resetPasswordRequest } from '../../services/authService.js';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (password !== confirmation) {
      setError('Passwords do not match');
      return;
    }
    const token = searchParams.get('token');
    if (!token) {
      setError('This reset link is invalid');
      return;
    }
    setLoading(true);
    try {
      await resetPasswordRequest({ token, password });
      navigate('/login', { replace: true, state: { message: 'Password reset. Please sign in.' } });
    } catch (requestError) {
      setError(requestError?.response?.data?.message || 'Unable to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthForm
      title="Choose a new password"
      subtitle="Use at least eight characters with uppercase, lowercase, and a number."
      actionLabel={loading ? 'Updating...' : 'Reset password'}
      onSubmit={handleSubmit}
      footer={<Link to="/login" className="font-semibold text-blue-600 hover:underline">Back to sign in</Link>}
    >
      {error ? <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">{error}</div> : null}
      <Input label="New password" name="password" type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
      <Input label="Confirm password" name="confirmation" type="password" autoComplete="new-password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} required />
    </AuthForm>
  );
};

export default ResetPasswordPage;
