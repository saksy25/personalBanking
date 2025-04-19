
// utils/chatbotData.js
export const chatbotHelpTopics = {
    login: {
      title: 'Login Help',
      responses: [
        'To log in, click on the "Login" button in the top right corner of the homepage.',
        'If you\'ve forgotten your password, click on the "Forgot Password" link on the login page.',
        'Our system uses two-factor authentication for additional security. You\'ll receive a verification code via email.',
        'If you\'re having trouble logging in, ensure caps lock is off and your email is entered correctly.',
        'For security reasons, your account may be temporarily locked after multiple failed login attempts.'
      ]
    },
    transfer: {
      title: 'Making Transfers',
      responses: [
        'To make a transfer, navigate to the "Transfer" section in your account dashboard.',
        'You\'ll need the recipient\'s full name and account number to make a transfer.',
        'Transfers between SecureBank accounts are typically processed immediately.',
        'There\'s a daily transfer limit of $10,000 for standard accounts.',
        'You can schedule recurring transfers by selecting the "Recurring" option in the transfer form.'
      ]
    },
    security: {
      title: 'Account Security',
      responses: [
        'We use encryption and secure connections to protect your data.',
        'Enable notifications to get alerts for any login attempts or transactions.',
        'Regularly check your login history in the Security Center.',
        'Never share your verification codes with anyone, even if they claim to be from SecureBank.',
        'We recommend using a unique, strong password for your banking account.'
      ]
    }
  };
  
  // Advanced version of processBotResponse with intent recognition
  export const advancedProcessBotResponse = (userInput, user) => {
    const input = userInput.toLowerCase();
    
    // Intent recognition patterns
    const intents = {
      greeting: /\b(hi|hello|hey|good morning|good afternoon|good evening)\b/i,
      farewell: /\b(bye|goodbye|see you|talk to you later)\b/i,
      thankYou: /\b(thanks|thank you|appreciate it)\b/i,
      checkBalance: /\b(balance|how much.*account|money in my account)\b/i,
      transfer: /\b(transfer|send money|payment|pay|wire)\b/i,
      security: /\b(security|password|secure|protection|fraud|hack|safety)\b/i,
      fees: /\b(fee|charge|cost|pricing)\b/i,
      transactions: /\b(transaction|history|activity|record)\b/i,
      help: /\b(help|support|assist|guide|how to|how do i)\b/i,
      contact: /\b(contact|call|phone|email|chat|human)\b/i,
      hours: /\b(hours|time|open|closed|available)\b/i,
    };
  
    // Check for matched intents
    for (const [intent, pattern] of Object.entries(intents)) {
      if (pattern.test(input)) {
        // Handle intent based on recognized pattern
        switch (intent) {
          case 'greeting':
            return `Hello${user ? `, ${user.firstName}` : ''}! How can I assist with your banking needs today?`;
            
          case 'farewell':
            return 'Thank you for chatting with SecureBank assistant. Have a great day!';
            
          case 'thankYou':
            return 'You\'re welcome! Is there anything else I can help you with today?';
            
          case 'checkBalance':
            return user 
              ? 'You can view your current balance on the dashboard. Your information is always kept secure and up-to-date.'
              : 'You\'ll need to login to check your balance. Would you like help with the login process?';
            
          case 'transfer':
            if (input.includes('how') || input.includes('work')) {
              return 'To make a transfer, go to the Transfer section and enter the recipient\'s details. You\'ll need their full name and account number. Would you like more specifics about transfer limits or processing times?';
            }
            return 'Our transfer service allows you to send money to other accounts securely. Would you like to know how to make a transfer?';
            
          case 'security':
            return 'Your security is our top priority. We use end-to-end encryption, two-factor authentication, and continuous monitoring to protect your account. Is there a specific security concern you have?';
            
          case 'fees':
            return 'SecureBank offers many fee-free services to our customers. Internal transfers are always free. Would you like to know about specific fees for other services?';
            
          case 'transactions':
            return 'You can view your full transaction history in the Transactions section. You can filter by date, amount, or transaction type for easier review.';
            
          case 'help':
            return 'I\'d be happy to help! Please let me know what specific feature or process you need assistance with, and I\'ll guide you through it step by step.';
            
          case 'contact':
            return 'You can reach our customer support team at support@securebank.com or call 1-800-SECURE-BANK (1-800-732-8732) during business hours.';
            
          case 'hours':
            return 'Our online banking services are available 24/7. Customer support is available Monday through Friday, 8AM to 8PM, and Saturday from 9AM to 5PM local time.';
        }
      }
    }
    
    // If no specific intent is matched, use context-aware general responses
    if (input.length < 5) {
      return 'Could you please provide more details so I can help you better?';
    }
    
    if (input.includes('?')) {
      return 'That\'s a good question. To give you the most accurate answer, could you specify which banking service you\'re asking about?';
    }
    
    // Default response for unrecognized intents
    return 'I\'m here to help with your banking needs. You can ask about account information, transfers, security, or any other banking services we offer.';
  };