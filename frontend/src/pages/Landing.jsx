import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import securityImg from '../assets/security.jpg';
import landingImg from '../assets/landing-bg.avif';
import helpImg from '../assets/help.png';

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
      <section className="relative py-12 px-6 mb-8">
        {/* Background Image */}
        <div className="absolute inset-0 z-0" style={{ minHeight: "450px" }}>
          <img
            src={landingImg}
            alt="Banking background"
            className="w-full h-full object-fill"
          />
          {/* Dark overlay to improve text readability */}
          <div className="absolute inset-0 bg-opacity-40"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="md:w-2/3 lg:w-1/2">
            <h1 className="text-4xl md:text-7xl leading-tight font-bold text-white mb-5">
              Banking at your Fingertips
            </h1>
            <p className="text-xl text-white mb-6">Your Convenience Our motto!</p>
            <button onClick={handleSignUp} className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded flex items-center transition duration-300">
              <span className='text-xl'>Get Started</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
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
              <li>Create complex passwords with a mix of letters, numbers, and special characters. Avoid using easily guessable information like your name or birthdate.</li>
              <li>Always verify your login with a one-time password (OTP) sent to your registered email for an added layer of security.</li>
              <li>Refrain from accessing your bank account over public or unsecured Wi-Fi networks to protect your sensitive data.</li>
              <li>Always log out from your account after use, especially on shared or public devices.</li>
              <li>Ensure the website URL starts with "https://" before entering any login or personal information.</li>
              <li>Always check the last log-in date and time in the post login page.</li>
              <li>Regularly check your account and transaction history for any unauthorized access or suspicious activity.</li>
            </ul>
            <div className="flex justify-end -mt-12">
              <div className="text-green-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" viewBox="0 0 20 20" fill="currentColor">
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
          <h2 className="text-6xl font-bold text-blue-700 text-center mb-8">
            WhatsNew?
          </h2>
          
          {/* Security Features Banner */}
          <div className="relative overflow-hidden rounded-lg mb-12">
            <img 
              src={securityImg} 
              alt="Security Features" 
              className="w-full object-cover bg-blue-900"
            />
            <div className="absolute inset-0 flex mt-7 ml-4 p-8 bg-opacity-40">
              <div className="text-white">
                <h1 className="text-7xl leading-20 font-bold text-white max-w-2xl mb-4">Security features that we provide you!</h1>
                <p className="pt-8 text-lg text-white max-w-xl">Safeguarding your data with advanced security measures designed to protect your account at every step</p>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <section className="py-8 px-6">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    title: "Secure Fund Transfers & Transaction history",
                    description: "Send money securely",
                    color: "green",
                    icon: "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                  },
                  {
                    title: "Login Security",
                    description: "Need the OTP every time you login",
                    color: "blue",
                    icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  },
                  {
                    title: "Account Security",
                    description: "Continuos 3 times wrong password submission results blocked account",
                    color: "purple",
                    icon: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  },
                  {
                    title: "Login History",
                    description: "Track your account access - success or failure",
                    color: "yellow",
                    icon: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  }
                ].map((feature, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{feature.title}</h3>
                      <div className={`bg-${feature.color}-100 p-2 rounded-full`}>
                        <svg className={`w-5 h-5 text-${feature.color}-600`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                        </svg>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </section>

      {/* Help Section */}
      <section className="py-12 px-6 bg-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="relative rounded-lg  overflow-hidden" style={{ minHeight: "300px" }}>
            {/* Background Image */}
            <img
              src={helpImg}
              alt="Man thinking with laptop"
              className="w-full h-full object-cover absolute inset-0"
            />
            
            {/* Content overlay */}
            <div className="relative z-10 p-6">
              <div className="md:w-2/3">
                <h2 className="text-5xl font-bold m-4">
                  Don't Know Where To Find What?
                </h2>
                <div className="flex items-start">
                  <div className="m-4 text-blue-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-4xl font-bold text-blue-700 m-2">
                      Ask Your Secure Bot!
                    </h3>
                    <p className="text-xl m-2">Always there to help you...</p>
                  </div>
                </div>
              </div>
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