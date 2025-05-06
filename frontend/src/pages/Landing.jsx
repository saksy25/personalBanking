import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SecureBankLanding() {
    const navigate = useNavigate();
    const handleLogin = () => {
        navigate('/login');
      };
      const handleSignUp = () => {
        navigate('/register');
      };
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation Bar */}
      <nav className="bg-blue-700 text-white p-4 flex justify-between items-center">
        <div className="font-bold text-xl">SecureBank</div>
        <div className="space-x-4">
          <button onClick={handleLogin} className="hover:underline">Login</button>
          <button onClick={handleSignUp} className="hover:underline">Sign up</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gray-100 py-12 px-6 md:px-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold text-blue-700 mb-4">
              Banking at your Fingertips
            </h1>
            <p className="text-lg mb-6">Your Convenience Our motto!</p>
            <button onClick={handleSignUp} className="bg-blue-700 text-white px-6 py-2 rounded flex items-center">
              Get Started
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <div className="md:w-1/2">
            <img
              src="/api/placeholder/600/400"
              alt="Woman using laptop and smartphone"
              className="rounded-lg w-full"
            />
          </div>
        </div>
      </section>

      {/* Security Guidelines Section */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-red-600 text-center mb-8">
            Safe And Secure Guidelines
          </h2>
          <div className="border border-gray-300 rounded-lg p-6">
            <ul className="list-disc pl-6 space-y-3">
              <li>Use Virtual keyboard feature while logging into your internet banking account.</li>
              <li>Always logout when you exit Net Banking.Do not directly close the browser.</li>
              <li>
                Phishing is a fraudulent attempt,usually made through emails/calls/SMS to capture
                your confidential data like NetBanking id/Password, mobile no, email Id /
                Password,Card no /PIN/CVV no etc.Please report immediately on
                antiphishing[Dot]ciso[At]the [rate]unionbankofindia[Dot] bank if you receive any such
                email/SMS or Phone call.
              </li>
              <li>
                Be sure the URL you are accessing has 'https://'. The 's' indicates secured and the site
                uses encryption.
              </li>
              <li>Regularly update Browser and Antivirus with latest available definitions.</li>
              <li>Always check the last log-in date and time in the post login page.</li>
              <li>Ensure firewall is on and Antivirus is scanning the system regularly.</li>
            </ul>
            <div className="flex justify-end mt-4">
              <div className="text-green-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What's New Section */}
      <section className="py-6 px-6 bg-gray-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-blue-700 text-center mb-8">
            WhatsNew?
          </h2>
          
          {/* Security Features Banner */}
          <div className="relative overflow-hidden rounded-lg mb-12">
            <img 
              src="/api/placeholder/1200/400" 
              alt="Security Features" 
              className="w-full h-64 object-cover bg-blue-900"
            />
            <div className="absolute inset-0 flex items-center p-8 bg-black bg-opacity-40">
              <div className="text-white">
                <h3 className="text-3xl font-bold mb-2">Security features</h3>
                <h3 className="text-3xl font-bold mb-2">that we provide</h3>
                <h3 className="text-3xl font-bold">you!</h3>
              </div>
            </div>
          </div>
          
          {/* Login History Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
            {Array(8).fill().map((_, i) => (
              <div key={i} className="bg-white p-4 flex flex-col items-center shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-gray-200 w-16 h-16 flex items-center justify-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <span className="text-blue-700 text-sm">Login History</span>
              </div>
            )).slice(0, 8)}
          </div>
        </div>
      </section>

      {/* Help Section */}
      <section className="py-12 px-6 bg-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gray-200 rounded-lg p-6 flex flex-col md:flex-row items-center">
            <div className="md:w-2/3 mb-6 md:mb-0">
              <h2 className="text-2xl font-bold mb-4">
                Don't Know Where To Find What?
              </h2>
              <div className="flex items-start">
                <div className="mr-4 text-blue-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-blue-700 mb-2">
                    Ask Your Secure Bot!
                  </h3>
                  <p>Always there to help you...</p>
                </div>
              </div>
            </div>
            <div className="md:w-1/3">
              <img
                src="/api/placeholder/300/300"
                alt="Man thinking with laptop"
                className="rounded-lg w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-700 text-white py-4 mt-auto">
        <div className="container mx-auto text-center">
          <p>SecureBank©2025</p>
        </div>
      </footer>
    </div>
  );
}