// components/Dashboard.jsx
import { useState, useEffect } from 'react';
import { getAccountBalance, getTransactions } from '../utils/api';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import leafImg from '../assets/leaf.png'; // adjust


export const Dashboard = () => {
  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showBalance, setShowBalance] = useState(false);
  const [notifications, setNotifications] = useState([]);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        const balanceData = await getAccountBalance();
        const transactionsData = await getTransactions(5);
        
        setBalance(balanceData.balance);
        setTransactions(transactionsData.transactions);
        
        // Sample notifications - in a real app, these would come from the backend
        setNotifications([
          {
            id: 1,
            type: 'security',
            message: 'New login detected from Chrome on Windows',
            timestamp: new Date().toISOString(),
          },
          {
            id: 2,
            type: 'transaction',
            message: 'Payment of $250.00 received',
            timestamp: new Date(Date.now() - 86400000).toISOString(),
          },
        ]);
        
      } catch (error) {
        setError('Failed to load dashboard data');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  const toggleBalanceVisibility = () => {
    setShowBalance(!showBalance);
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading dashboard...</div>
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
      {/* Hero Section with Background Image */}
      <div className="relative overflow-hidden rounded-lg shadow-lg">
        <img src={leafImg} alt="Description" className="absolute inset-0 w-full h-full object-cover bg-center opacity-80" />
        {/* Content overlay */}
        <div className="relative z-10 flex flex-col justify-center h-full p-8">
          <h1 className="text-6xl leading-18 font-bold text-blue-900 max-w-3xl mb-4">Personal Banking, Reinvented for Your Safety</h1>
          <p className="text-blue-900 text-lg max-w-xl">
            Access your finances anytime, anywhere with our secure online banking platform.
          </p>
        </div>
      </div>
      
      {/* Balance Card */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-600 rounded-lg shadow-lg overflow-hidden p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-white">Current Balance</h2>
          <button
            onClick={toggleBalanceVisibility}
            className="p-1 rounded-md hover:bg-blue-700 focus:outline-none"
          >
            {showBalance ? (
              <EyeSlashIcon className="h-5 w-5 text-white" />
            ) : (
              <EyeIcon className="h-5 w-5 text-white" />
            )}
          </button>
        </div>
        <div className="mt-2">
          {showBalance ? (
            <p className="text-3xl font-bold text-white">${parseFloat(balance).toFixed(2)}</p>
          ) : (
            <p className="text-3xl font-bold text-white">$****.**</p>
          )}
        </div>
      </div>
      
      {/* Three Navigation Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-900">Transactions</h3>
            <div className="bg-blue-100 p-2 rounded-full">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-4">View and manage your recent transactions</p>
          <a href="/transactions" className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium">
            View all
            <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-900">Fund Transfers</h3>
            <div className="bg-green-100 p-2 rounded-full">
              <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-4">Send money securely</p>
          <a href="/transfers" className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium">
            Start transfer
            <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-900">Security</h3>
            <div className="bg-yellow-100 p-2 rounded-full">
              <svg className="w-5 h-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-4">View alerts login messages</p>
          <a href="/security" className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium">
            Security center
            <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
      
      {/* Recent Transactions Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900">Recent Transactions</h2>
        {transactions.length > 0 ? (
          <div className="mt-4 space-y-3">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div>
                  <p className="font-medium text-gray-900">{transaction.description}</p>
                  <p className="text-sm text-gray-500">{new Date(transaction.timestamp).toLocaleDateString()}</p>
                </div>
                <p className={`font-medium ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                  {transaction.type === 'credit' ? '+' : '-'}${parseFloat(transaction.amount).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-gray-500">No recent transactions found.</p>
        )}
        <div className="mt-4">
          <a href="/transactions" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            View all transactions →
          </a>
        </div>
      </div>
      
      {/* Security Alerts Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900">Security Alerts & Notifications</h2>
        {notifications.length > 0 ? (
          <div className="mt-4 space-y-3">
            {notifications.map((notification) => (
              <div key={notification.id} className="flex items-start p-3 bg-gray-50 rounded-md">
                <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full mr-3 ${
                  notification.type === 'security' ? 'bg-yellow-100' : 'bg-blue-100'
                }`}>
                  {notification.type === 'security' ? (
                    <svg className="w-4 h-4 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{notification.message}</p>
                  <p className="text-sm text-gray-500">{new Date(notification.timestamp).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-gray-500">No new notifications.</p>
        )}
      </div>
    </div>
  );
};