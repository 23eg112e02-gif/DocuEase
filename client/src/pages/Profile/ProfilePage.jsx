import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import { useAuth } from '../../hooks/useAuth.js';

const ProfilePage = () => {
  const { user, logout } = useAuth();

  return (
    <Card className="mx-auto max-w-2xl space-y-4">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent-600">Account profile</p>
        <h1 className="text-3xl font-bold text-ink-900">{user?.name}</h1>
      </div>
      <div className="space-y-2 text-sm text-slate-600">
        <p>Email: {user?.email}</p>
        <p>Member since: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}</p>
      </div>
      <Button onClick={logout}>Logout</Button>
    </Card>
  );
};

export default ProfilePage;
