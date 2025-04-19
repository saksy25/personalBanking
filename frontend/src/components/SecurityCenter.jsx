// components/SecurityCenter.jsx
import { useState, useEffect } from 'react';
import { getLoginHistory } from '../utils/api';

export const SecurityCenter = () => {
  const [loginHistory, setLoginHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchLoginHistory = async () => {
      try {
        setLoading(true);
        const data = await getLoginHistory();
        setLoginHistory(data.loginHistory);
      } catch (error) {
        setError('Failed to load login history');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLoginHistory();
  }, []);
  
  const lastSuccessfulLogin = loginHistory.find(login => login.status === 'success');
  const recentFailedLogins = loginHistory.filter(login => login.status === 'failed').slice(0, 3);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading security information...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4">
        {error}
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900">Security Status</h2>
        <div className="mt-4">
          {lastSuccessfulLogin && (
            <div className="flex items-start space-x-3 mb-4">
              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-green-100">
                <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">Last successful login</h3>
                <p className="text-sm text-gray-500">
                  {new Date(lastSuccessfulLogin.timestamp).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">
                  {lastSuccessfulLogin.device} - {lastSuccessfulLogin.location}
                </p>
              </div>
            </div>
          )}
          
          {recentFailedLogins.length > 0 && (
            <div className="mt-2">
              <h3 className="text-sm font-medium text-gray-900">Recent failed login attempts</h3>
              <div className="mt-2 space-y-2">
                {recentFailedLogins.map((login, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-red-100">
                      <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">
                        {new Date(login.timestamp).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        {login.device} - {login.location}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900">Login History</h2>
        <div className="mt-4 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Device / Browser
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loginHistory.map((login, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(login.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {login.device}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {login.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        login.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {login.status === 'success' ? 'Success' : 'Failed'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
