import { useState } from 'react';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import Input from '../../components/common/Input.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { User, Lock, Mail, Calendar, CheckCircle2, AlertCircle, Shield } from 'lucide-react';

const ProfilePage = () => {
  const { user, updateProfile, changePassword, logout } = useAuth();

  // Profile edit state
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [passMsg, setPassMsg] = useState({ type: '', text: '' });

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    setProfileMsg({ type: '', text: '' });

    try {
      await updateProfile({ name, email });
      setProfileMsg({ type: 'success', text: 'Profile details updated successfully!' });
    } catch (err) {
      setProfileMsg({ type: 'error', text: err?.response?.data?.message || 'Failed to update profile' });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setIsChangingPass(true);
    setPassMsg({ type: '', text: '' });

    try {
      await changePassword({ currentPassword, newPassword });
      setPassMsg({ type: 'success', text: 'Password updated successfully!' });
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setPassMsg({ type: 'error', text: err?.response?.data?.message || 'Failed to change password' });
    } finally {
      setIsChangingPass(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-blue-600">Account Settings</span>
        <h1 className="text-3xl font-bold text-slate-900">User Profile</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Details Form */}
        <Card className="space-y-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
              <User size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Personal Information</h2>
              <p className="text-xs text-slate-500">Update your account name and email</p>
            </div>
          </div>

          {profileMsg.text && (
            <div className={`rounded-xl p-3 text-xs flex items-center gap-2 ${
              profileMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {profileMsg.type === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
              <span>{profileMsg.text}</span>
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <Input
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
              <Calendar size={13} />
              <span>Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recent'}</span>
            </div>

            <Button type="submit" disabled={isUpdatingProfile} className="w-full">
              {isUpdatingProfile ? 'Saving Changes...' : 'Save Profile'}
            </Button>
          </form>
        </Card>

        {/* Change Password Form */}
        <Card className="space-y-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
              <Lock size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Security & Password</h2>
              <p className="text-xs text-slate-500">Ensure your account has a strong password</p>
            </div>
          </div>

          {passMsg.text && (
            <div className={`rounded-xl p-3 text-xs flex items-center gap-2 ${
              passMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {passMsg.type === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
              <span>{passMsg.text}</span>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4">
            <Input
              label="Current Password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
            <Input
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimum 8 characters"
              required
            />

            <Button type="submit" variant="secondary" disabled={isChangingPass} className="w-full">
              {isChangingPass ? 'Updating...' : 'Update Password'}
            </Button>
          </form>

          <div className="border-t border-slate-100 pt-4">
            <Button variant="danger" onClick={logout} className="w-full bg-red-50 text-red-600 hover:bg-red-100 border border-red-200">
              Sign Out of DocuEase
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
