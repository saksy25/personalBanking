// server.js - Modified to use MongoDB
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');
const { connectDB, User, Transaction, Balance, LoginHistory, LoginAttempt, MFACode, Session } = require('./db');

const app = express();
const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secure-jwt-secret-key';

// Connect to MongoDB
connectDB();

app.use(cors());
app.use(bodyParser.json());

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Access denied' });
  }
  
  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

const generateAccountNumber = () => {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
};

const generateMFACode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const recordLoginHistory = async (userId, status, deviceInfo, location) => {
  await LoginHistory.create({
    userId,
    status,
    device: deviceInfo || 'Unknown device',
    location: location || 'Unknown location'
  });
};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-email-password'
  }
});

const sendMFACode = async (email, code) => {
  try {
    await transporter.sendMail({
      from: 'SecureBank <your-email@gmail.com>',
      to: email,
      subject: 'Your verification code',
      text: `Your verification code is: ${code}`,
      html: `<p>Your verification code is: <strong>${code}</strong></p>`
    });
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

app.post('/api/auth/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create account number
    const accountNumber = generateAccountNumber();
    
    // Create user
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      accountNumber
    });
    
    // Initialize balance with initial deposit
    await Balance.create({
      userId: newUser._id,
      balance: 10000
    });
    
    // Record initial deposit transaction
    await Transaction.create({
      userId: newUser._id,
      type: 'credit',
      amount: '10000.00',
      description: 'Initial deposit',
    });
    
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    
    // Check login attempts
    let loginAttempt = await LoginAttempt.findOne({ email });
    
    if (loginAttempt && loginAttempt.attempts >= 3 && 
        loginAttempt.lastAttempt > Date.now() - 15 * 60 * 1000) {
      return res.status(403).json({ 
        message: 'Account locked due to too many login attempts. Try again after 15 minutes.' 
      });
    }
    
    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      // Record failed attempt
      if (!loginAttempt) {
        loginAttempt = new LoginAttempt({ email });
      }
      
      loginAttempt.attempts += 1;
      loginAttempt.lastAttempt = Date.now();
      await loginAttempt.save();
      
      await recordLoginHistory(user._id, 'failed', req.headers['user-agent'], 'IP: ' + req.ip);
      
      return res.status(400).json({
        message: 'Invalid email or password',
        attemptsLeft: 3 - loginAttempt.attempts
      });
    }
    
    // Reset login attempts on successful password
    if (loginAttempt) {
      loginAttempt.attempts = 0;
      await loginAttempt.save();
    }
    
    // Generate and save MFA code
    const mfaCode = generateMFACode();
    await MFACode.findOneAndUpdate(
      { email },
      { 
        code: mfaCode,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000)
      },
      { upsert: true, new: true }
    );
    
    // Send MFA code
    await sendMFACode(email, mfaCode);
    
    res.json({ requiresMFA: true, email });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/verify-mfa', async (req, res) => {
  try {
    const { email, code } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid request' });
    }
    
    // Verify MFA code
    const mfaRecord = await MFACode.findOne({ email });
    if (!mfaRecord || mfaRecord.code !== code || mfaRecord.expiresAt < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired verification code' });
    }
    
    // Delete used MFA code
    await MFACode.deleteOne({ email });
    
    // Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    // Record successful login
    await recordLoginHistory(user._id, 'success', req.headers['user-agent'], 'IP: ' + req.ip);
    
    // Create session
    const sessionId = uuidv4();
    await Session.create({
      sessionId,
      userId: user._id,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000)
    });
    
    // Return user data (excluding password)
    const userData = user.toObject();
    delete userData.password;
    
    res.json({
      user: userData,
      token
    });
  } catch (error) {
    console.error('MFA verification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/auth/verify', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/refresh', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    res.json({ token });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/account/balance', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const balanceRecord = await Balance.findOne({ userId });
    if (!balanceRecord) {
      return res.status(404).json({ message: 'Account not found' });
    }
    
    res.json({ balance: balanceRecord.balance });
  } catch (error) {
    console.error('Balance fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/account/transactions', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = req.query.limit ? parseInt(req.query.limit) : null;
    
    let query = Transaction.find({ userId }).sort({ timestamp: -1 });
    
    if (limit) {
      query = query.limit(limit);
    }
    
    const transactions = await query.exec();
    
    res.json({ transactions });
  } catch (error) {
    console.error('Transactions fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/account/transfer', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { recipientName, recipientAccount, amount, description } = req.body;
    
    // Parse and validate the transfer amount
    const transferAmount = parseFloat(amount);
    if (isNaN(transferAmount) || transferAmount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }
    
    // Check sender's balance
    const senderBalance = await Balance.findOne({ userId });
    if (!senderBalance) {
      return res.status(404).json({ message: 'Sender account not found' });
    }
    
    if (senderBalance.balance < transferAmount) {
      return res.status(400).json({ message: 'Insufficient funds' });
    }
    
    // Find recipient user by account number
    const recipientUser = await User.findOne({ accountNumber: recipientAccount });
    if (!recipientUser) {
      return res.status(404).json({ message: 'Recipient account not found' });
    }
    
    // Check if recipient name matches (additional security check)
    if (recipientUser.firstName + ' ' + recipientUser.lastName !== recipientName) {
      return res.status(400).json({ message: 'Recipient name does not match account number' });
    }
    
    // Generate a unique reference number for this transaction
    const reference = `TRF-${Math.floor(1000000 + Math.random() * 9000000)}`;
    
    // Start transaction: debit sender
    const debitTransaction = await Transaction.create({
      userId,
      type: 'debit',
      amount: transferAmount.toFixed(2),
      description: description || `Transfer to ${recipientName}`,
      reference,
    });
    
    // Credit recipient
    await Transaction.create({
      userId: recipientUser._id,
      type: 'credit',
      amount: transferAmount.toFixed(2),
      description: `Transfer from ${req.user.firstName} ${req.user.lastName}`,
      reference,
    });
    
    // Update sender's balance
    senderBalance.balance -= transferAmount;
    await senderBalance.save();
    
    // Update recipient's balance
    const recipientBalance = await Balance.findOne({ userId: recipientUser._id });
    if (!recipientBalance) {
      // If recipient has no balance record yet, create one
      await Balance.create({
        userId: recipientUser._id,
        balance: transferAmount
      });
    } else {
      recipientBalance.balance += transferAmount;
      await recipientBalance.save();
    }
    
    res.json({
      message: 'Transfer successful',
      transaction: debitTransaction,
      newBalance: senderBalance.balance
    });
  } catch (error) {
    console.error('Transfer error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/security/login-history', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const loginHistory = await LoginHistory.find({ userId }).sort({ timestamp: -1 });
    
    res.json({ loginHistory });
  } catch (error) {
    console.error('Login history fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add to server.js

// Import necessary packages at the top of the file if not already imported
const natural = require('natural');
const tokenizer = new natural.WordTokenizer();

// Create a simple FAQ database
const faqData = [
  {
    keywords: ['password', 'forgot', 'reset', 'change'],
    question: 'How do I reset my password?',
    answer: 'To reset your password, click on the "Forgot Password" link on the login page, enter your email address, and follow the instructions sent to your email.'
  },
  {
    keywords: ['transfer', 'send', 'money', 'payment'],
    question: 'How do I transfer money?',
    answer: 'To transfer money, log into your account, navigate to the Transfer section, enter the recipient details and the amount, then confirm the transaction with your verification code.'
  },
  {
    keywords: ['login', 'sign in', 'unable', 'cannot', 'problem'],
    question: 'I cannot login to my account',
    answer: 'If you\'re having trouble logging in, make sure your caps lock is off, verify your email address is correct, and ensure you\'re using the right password. After multiple failed attempts, your account may be temporarily locked for security reasons.'
  },
  {
    keywords: ['fee', 'charge', 'cost'],
    question: 'What are the fees for using SecureBank?',
    answer: 'SecureBank offers free internal transfers between accounts. External transfers may incur a small fee depending on your account type and the transfer amount. Check our fee schedule in the account settings for detailed information.'
  },
  {
    keywords: ['security', 'safe', 'secure', 'protect'],
    question: 'How secure is my account?',
    answer: 'SecureBank employs bank-grade encryption, two-factor authentication, and continuous security monitoring. We also send alerts for any suspicious activity and provide a security center where you can monitor your account access history.'
  },
  {
    keywords: ['limit', 'maximum', 'transfer limit'],
    question: 'What are the transfer limits?',
    answer: 'Standard accounts have a daily transfer limit of $10,000. Premium accounts can transfer up to $50,000 daily. You can view and manage your limits in the Account Settings section.'
  },
  {
    keywords: ['contact', 'support', 'help', 'service'],
    question: 'How do I contact customer support?',
    answer: 'You can reach our customer support team via email at support@securebank.com, by phone at 1-800-SECURE-BANK during business hours, or through the secure messaging system in your account dashboard.'
  }
];

// Create an endpoint for chatbot interactions
app.post('/api/chatbot/query', authenticateToken, async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user.id;
    
    // Find the user to personalize responses
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Process the message and find the best matching FAQ
    const response = processMessage(message, user);
    
    // Log the interaction (optional)
    await logChatbotInteraction(userId, message, response);
    
    res.json({ response });
  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper function to process messages and find matching FAQs
function processMessage(message, user) {
  const tokens = tokenizer.tokenize(message.toLowerCase());
  
  // Check for simple greetings
  const greetings = ['hi', 'hello', 'hey', 'greetings'];
  if (tokens.some(token => greetings.includes(token))) {
    return `Hello, ${user.firstName}! How can I assist you with your banking needs today?`;
  }
  
  // Check for account specific queries
  if (message.toLowerCase().includes('my account') || 
      message.toLowerCase().includes('my balance')) {
    return `To protect your privacy, I can't display account information directly in chat. Please check your dashboard for up-to-date account details, ${user.firstName}.`;
  }
  
  // Search through FAQ data for matches
  let bestMatch = null;
  let highestScore = 0;
  
  faqData.forEach(faq => {
    const score = calculateMatchScore(tokens, faq.keywords);
    if (score > highestScore) {
      highestScore = score;
      bestMatch = faq;
    }
  });
  
  // If we found a good match, return the answer
  if (bestMatch && highestScore > 0.3) {
    return bestMatch.answer;
  }
  
  // Default response if no good match
  return "I'm not sure I understand your question. Could you rephrase it or select from common topics like transfers, account access, security, or fees?";
}

// Calculate match score between message tokens and FAQ keywords
function calculateMatchScore(tokens, keywords) {
  let matchCount = 0;
  tokens.forEach(token => {
    if (keywords.some(keyword => keyword.includes(token) || token.includes(keyword))) {
      matchCount++;
    }
  });
  
  return tokens.length > 0 ? matchCount / tokens.length : 0;
}

// Optional: Log chatbot interactions for analytics
async function logChatbotInteraction(userId, query, response) {
  try {
    // You could create a new model for this if you want to track interactions
    // For now, we'll just log to console
    console.log(`Chatbot interaction - User: ${userId}, Query: "${query}", Response: "${response}"`);
  } catch (error) {
    console.error('Error logging chatbot interaction:', error);
  }
}

// Create a schema for chatbot interactions if you want to store them
/*
const chatbotInteractionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  query: { type: String, required: true },
  response: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const ChatbotInteraction = mongoose.model('ChatbotInteraction', chatbotInteractionSchema);
*/

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});