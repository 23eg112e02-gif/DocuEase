import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthForm from '../../components/auth/AuthForm.jsx';
import Input from '../../components/common/Input.jsx';
import { forgotPasswordRequest } from '../../services/authService.js';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const response = await forgotPasswordRequest({ email });
      setMessage(response?.message || 'If an account exists, password reset instructions have been sent.');
    } catch (requestError) {
      setError(requestError?.response?.data?.message || 'Unable to request a password reset');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthForm
      title="Reset your password"
      subtitle="Enter your email and we will send reset instructions if an account exists."
      actionLabel={loading ? 'Sending...' : 'Send reset link'}
      onSubmit={handleSubmit}
      footer={<Link to="/login" className="font-semibold text-blue-600 hover:underline">Back to sign in</Link>}
    >
      {message ? <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-700">{message}</div> : null}
      {error ? <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">{error}</div> : null}
      <Input label="Email" name="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
    </AuthForm>
  );
};

export default ForgotPasswordPage;
