// pages/DashboardPage.jsx
import { Dashboard } from '../components/Dashboard';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
  const { currentUser, login } = useAuth();
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Welcome, <span className="text-blue-900 mr-3">{currentUser?.firstName} {currentUser?.lastName}!</span></h1>
      <Dashboard />
    </div>
  );
};

export default DashboardPage;