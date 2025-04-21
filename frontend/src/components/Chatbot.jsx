// components/Chatbot.jsx
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', text: 'Hi there! I\'m your SecureBank assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationContext, setConversationContext] = useState({
    topic: null,
    lastQuestion: null,
    awaitingFollowup: false
  });
  const messagesEndRef = useRef(null);
  const { currentUser } = useAuth();

  // Define API_URL directly
  const API_URL = 'http://localhost:5001/api';

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
  
    // Add user message
    const userMessage = { id: Date.now(), type: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    const userInput = input; // Store input before clearing
    setInput('');
    setIsTyping(true);
  
    try {
      // Process the message and get a response
      const botResponse = processBotResponse(userInput);
      
      // Add slight delay to simulate processing
      setTimeout(() => {
        setMessages(prev => [...prev, { id: Date.now(), type: 'bot', text: botResponse }]);
        setIsTyping(false);
      }, 600);
      
      // Only attempt API call if user is logged in (but don't wait for it)
      if (currentUser) {
        try {
          const token = localStorage.getItem('token');
          fetch(`${API_URL}/chatbot/query`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ message: userInput })
          }).then(response => {
            console.log("API response received:", response.status);
          }).catch(error => {
            console.error("API error (non-blocking):", error);
          });
        } catch (error) {
          console.error("API setup error (non-blocking):", error);
        }
      }
    } catch (error) {
      console.error("Chatbot error:", error);
      setMessages(prev => [...prev, { 
        id: Date.now(), 
        type: 'bot', 
        text: 'Sorry, I encountered an error. Please try again later.' 
      }]);
      setIsTyping(false);
    }
  };

  const processBotResponse = (userInput) => {
    const input = userInput.toLowerCase();
    const userName = currentUser?.firstName ? ` ${currentUser.firstName}` : '';
    
    // Handle follow-up responses based on conversation context
    if (conversationContext.awaitingFollowup) {
      // Handle affirmative responses to previous questions
      if (input.match(/yes|yeah|yep|sure|ok|okay|please|tell me more/)) {
        if (conversationContext.topic === 'transfer' && conversationContext.lastQuestion === 'limits_fees') {
          setConversationContext({
            topic: 'transfer',
            lastQuestion: 'provided_fees_info',
            awaitingFollowup: false
          });
          return 'Standard accounts have a daily transfer limit of $10,000. Premium accounts can transfer up to $50,000 daily. For internal transfers between SecureBank accounts, there are no fees. External transfers may incur a small fee of $1.50 for standard accounts, while premium accounts get 5 free external transfers per month. Is there anything else you\'d like to know about transfers?';
        }
        
        if (conversationContext.topic === 'support') {
          setConversationContext({
            topic: 'support',
            lastQuestion: 'provided_contact_info',
            awaitingFollowup: false
          });
          return 'You can contact our customer support team via email at support@securebank.com, by phone at 1-800-SECURE-BANK (available 24/7), or through the secure messaging system in your account dashboard under "Help & Support".';
        }
      }
      
      // Handle negative responses to previous questions
      if (input.match(/no|nope|nah|not now|later/)) {
        setConversationContext({
          topic: null,
          lastQuestion: null,
          awaitingFollowup: false
        });
        return 'Alright! Is there anything else I can assist you with today?';
      }
      
      // Handle goodbye/thank you
      if (input.match(/bye|goodbye|thank you|thanks|thankyou/)) {
        setConversationContext({
          topic: null,
          lastQuestion: null,
          awaitingFollowup: false
        });
        return 'You\'re welcome! Thank you for chatting with SecureBank assistant. Have a great day!';
      }
      
      // Handle "how" for support
      if (input === 'how' && conversationContext.topic === 'support') {
        setConversationContext({
          topic: 'support',
          lastQuestion: 'provided_contact_info',
          awaitingFollowup: false
        });
        return 'You can contact our customer support team via email at support@securebank.com, by phone at 1-800-SECURE-BANK (available 24/7), or through the secure messaging system in your account dashboard under "Help & Support".';
      }
    }
    
    // Initial topic identification
    
    // Check for greetings
    if (input.match(/hi|hello|hey/)) {
      setConversationContext({
        topic: 'greeting',
        lastQuestion: null,
        awaitingFollowup: false
      });
      return `Hello${userName}! How can I assist you today?`;
    }
    
    // Check for goodbye/thank you
    if (input.match(/bye|goodbye|thank you|thanks|thankyou/)) {
      setConversationContext({
        topic: null,
        lastQuestion: null,
        awaitingFollowup: false
      });
      return 'You\'re welcome! Thank you for chatting with SecureBank assistant. Have a great day!';
    }
    
    // Check for account balance related queries
    if (input.match(/balance|how much.*account|money in my account/)) {
      setConversationContext({
        topic: 'balance',
        lastQuestion: null,
        awaitingFollowup: false
      });
      return currentUser 
        ? 'You can check your current balance on the dashboard. Would you like me to guide you there?'
        : 'You need to be logged in to check your balance. Can I help you with the login process?';
    }
    
    // Check for transfer related queries
    if (input.match(/transfer|send money|payment/)) {
      setConversationContext({
        topic: 'transfer',
        lastQuestion: 'limits_fees',
        awaitingFollowup: true
      });
      return 'To transfer funds, go to the "Transfer" section and enter the recipient\'s details. Would you like to know more about our transfer limits or fees?';
    }
    
    // Check for security related queries
    if (input.match(/security|password|secure|protection|fraud|hack/)) {
      setConversationContext({
        topic: 'security',
        lastQuestion: null,
        awaitingFollowup: false
      });
      return 'SecureBank uses industry-leading security measures including encryption, MFA, and real-time monitoring. Is there a specific security concern you\'d like to discuss?';
    }
    
    // Check for fee related queries
    if (input.match(/fee|charge|cost/)) {
      setConversationContext({
        topic: 'fees',
        lastQuestion: null,
        awaitingFollowup: false
      });
      return 'SecureBank offers fee-free transfers between our customers. External transfers may incur a small fee depending on your account type. Would you like to know more about our fee structure?';
    }
    
    // Check for transaction related queries
    if (input.match(/transaction|history|activity/)) {
      setConversationContext({
        topic: 'transactions',
        lastQuestion: null,
        awaitingFollowup: false
      });
      return 'You can view your full transaction history in the "Transactions" section. You can also filter by transaction type or search for specific entries.';
    }
    
    // Check for login related queries
    if (input.match(/login|sign in|log in|signin|account access/)) {
      setConversationContext({
        topic: 'login',
        lastQuestion: null,
        awaitingFollowup: false
      });
      return 'To login, click the "Sign In" button at the top of the page and enter your email and password. If you\'re having trouble accessing your account, you can use the "Forgot Password" option.';
    }
    
    // Check for help with application features
    if (input.match(/how do i|how to|feature|function/)) {
      setConversationContext({
        topic: 'features',
        lastQuestion: null,
        awaitingFollowup: false
      });
      return 'Our application has several features including transfers, transaction history, and security settings. Which specific feature do you need help with?';
    }
    
    // Check for support or contact inquiries
    if (input.match(/support|help|contact|call|phone|email/)) {
      setConversationContext({
        topic: 'support',
        lastQuestion: 'contact_methods',
        awaitingFollowup: true
      });
      return 'I\'d be happy to help you contact our support team. Would you like me to provide you with our contact information?';
    }
    
    // Default response when we couldn't understand the user's intent
    setConversationContext({
      topic: null,
      lastQuestion: null,
      awaitingFollowup: false
    });
    
    const defaultResponses = [
      'I\'m not sure I understand. Could you rephrase that?',
      'Could you please provide more details about what you\'re looking for?',
      'I want to help you, but I need a bit more information. What specifically would you like to know?',
      'I\'m not sure what you\'re asking. Would you like help with transfers, account information, or security questions?'
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-white rounded-lg shadow-xl flex flex-col w-80 h-96 border border-gray-200">
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="font-medium">SecureBank Assistant</h3>
            <button onClick={toggleChatbot} className="text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto">
            {messages.map(message => (
              <div 
                key={message.id} 
                className={`mb-3 flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`p-3 rounded-lg max-w-[80%] ${
                    message.type === 'user' 
                      ? 'bg-blue-600 text-white rounded-br-none' 
                      : 'bg-gray-100 text-gray-800 rounded-bl-none'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start mb-3">
                <div className="bg-gray-100 text-gray-800 p-3 rounded-lg rounded-bl-none max-w-[80%]">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <form onSubmit={handleSubmit} className="border-t border-gray-200 p-3">
            <div className="flex">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 border border-gray-300 rounded-l-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Type a message..."
              />
              <button 
                type="submit"
                className="bg-blue-600 text-white px-4 rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button 
          onClick={toggleChatbot}
          className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      )}
    </div>
  );
};