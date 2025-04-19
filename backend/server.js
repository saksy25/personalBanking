// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'your-secure-jwt-secret-key';

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory database (in a real app, use a real database)
const users = [];
const transactions = {};
const loginHistory = {};
const loginAttempts = {};
const mfaCodes = {};
const sessions = {};

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
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

// Helper function to generate a random account number
const generateAccountNumber = () => {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
};

// Helper function to generate MFA code
const generateMFACode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Helper function to record login history
const recordLoginHistory = (userId, status, deviceInfo, location) => {
  if (!loginHistory[userId]) {
    loginHistory[userId] = [];
  }
  
  loginHistory[userId].push({
    timestamp: new Date().toISOString(),
    status,
    device: deviceInfo || 'Unknown device',
    location: location || 'Unknown location',
  });
};

// Configure nodemailer with your email service
const transporter = nodemailer.createTransport({
    service: 'gmail',  // or another service
    auth: {
      user: 'sakshisalunke1111@gmail.com',
      pass: 'vzsy oxmr wasd zwru'
    }
  });

// Helper function to send MFA code via email (mock implementation)
const sendMFACode = async (email, code) => {
//   console.log(`Sending MFA code ${code} to ${email}`);
//   // In a real app, you would use nodemailer to send actual emails
//   return true;
try {
    await transporter.sendMail({
      from: 'your-app-name <your-email@gmail.com>',
      to: email,
      subject: 'Your verification code',
      text: `Your verification code is: ${code}`,
      html: `<p>Your verification code is: <strong>${code}</strong></p>`
    });
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
};

// Authentication routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user
    const userId = uuidv4();
    const accountNumber = generateAccountNumber();
    const newUser = {
      id: userId,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      accountNumber,
      createdAt: new Date().toISOString(),
    };
    
    users.push(newUser);
    
    // Initialize account balance and transactions
    transactions[userId] = {
      balance: 10000, // Starting with $10,000
      transactions: [
        {
          id: uuidv4(),
          type: 'credit',
          amount: '10000.00',
          description: 'Initial deposit',
          timestamp: new Date().toISOString(),
        }
      ]
    };
    
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
    const user = users.find(user => user.email === email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    
    // Check for too many login attempts
    if (loginAttempts[email] && loginAttempts[email].attempts >= 3 && 
        loginAttempts[email].lastAttempt > Date.now() - 15 * 60 * 1000) {
      return res.status(403).json({ message: 'Account locked due to too many login attempts. Try again after 15 minutes.' });
    }
    
    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      // Record failed attempt
      if (!loginAttempts[email]) {
        loginAttempts[email] = { attempts: 0, lastAttempt: Date.now() };
      }
      loginAttempts[email].attempts += 1;
      loginAttempts[email].lastAttempt = Date.now();
      
      recordLoginHistory(user.id, 'failed', req.headers['user-agent'], 'IP: ' + req.ip);
      
      return res.status(400).json({ 
        message: 'Invalid email or password',
        attemptsLeft: 3 - loginAttempts[email].attempts
      });
    }
    
    // Reset login attempts
    if (loginAttempts[email]) {
      loginAttempts[email].attempts = 0;
    }
    
    // Generate MFA code and send it
    const mfaCode = generateMFACode();
    mfaCodes[email] = {
      code: mfaCode,
      expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
    };
    
    await sendMFACode(email, mfaCode);
    
    res.json({ requiresMFA: true, email });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/verify-mfa', (req, res) => {
  try {
    const { email, code } = req.body;
    
    // Find user
    const user = users.find(user => user.email === email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid request' });
    }
    
    // Verify MFA code
    if (!mfaCodes[email] || mfaCodes[email].code !== code || mfaCodes[email].expiresAt < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired verification code' });
    }
    
    // Clear MFA code
    delete mfaCodes[email];
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    // Record successful login
    recordLoginHistory(user.id, 'success', req.headers['user-agent'], 'IP: ' + req.ip);
    
    // Create session
    const sessionId = uuidv4();
    sessions[sessionId] = {
      userId: user.id,
      expiresAt: Date.now() + 60 * 60 * 1000 // 1 hour
    };
    
    // Return user data (excluding password)
    const { password, ...userData } = user;
    
    res.json({
      user: userData,
      token
    });
  } catch (error) {
    console.error('MFA verification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/auth/verify', authenticateToken, (req, res) => {
  try {
    const user = users.find(user => user.id === req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const { password, ...userData } = user;
    res.json(userData);
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/refresh', authenticateToken, (req, res) => {
  try {
    const user = users.find(user => user.id === req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Generate new JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    res.json({ token });
  } catch (error) {
    console.error('Session refresh error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Account routes
app.get('/api/account/balance', authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;
    const userTransactions = transactions[userId];
    
    if (!userTransactions) {
      return res.status(404).json({ message: 'Account not found' });
    }
    
    res.json({ balance: userTransactions.balance });
  } catch (error) {
    console.error('Balance fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/account/transactions', authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;
    const limit = req.query.limit ? parseInt(req.query.limit) : null;
    const userTransactions = transactions[userId];
    
    if (!userTransactions) {
      return res.status(404).json({ message: 'Account not found' });
    }
    
    let transactionList = [...userTransactions.transactions].sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    );
    
    if (limit) {
      transactionList = transactionList.slice(0, limit);
    }
    
    res.json({ transactions: transactionList });
  } catch (error) {
    console.error('Transaction fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/account/transfer', authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;
    const { recipientName, recipientAccount, amount, description } = req.body;
    const transferAmount = parseFloat(amount);
    
    // Validate amount
    if (isNaN(transferAmount) || transferAmount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }
    
    const userTransactions = transactions[userId];
    if (!userTransactions) {
      return res.status(404).json({ message: 'Account not found' });
    }
    
    // Check if sufficient balance
    if (userTransactions.balance < transferAmount) {
      return res.status(400).json({ message: 'Insufficient funds' });
    }
    
    // Create debit transaction
    const debitTransaction = {
      id: uuidv4(),
      type: 'debit',
      amount: transferAmount.toFixed(2),
      description: description || `Transfer to ${recipientName}`,
      reference: `TRF-${Math.floor(1000000 + Math.random() * 9000000)}`,
      timestamp: new Date().toISOString(),
    };
    
    // Update user balance and add transaction
    userTransactions.balance -= transferAmount;
    userTransactions.transactions.push(debitTransaction);
    
    res.json({
      message: 'Transfer successful',
      transaction: debitTransaction,
      newBalance: userTransactions.balance
    });
  } catch (error) {
    console.error('Transfer error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/security/login-history', authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;
    const userLoginHistory = loginHistory[userId] || [];
    
    res.json({ loginHistory: userLoginHistory });
  } catch (error) {
    console.error('Login history fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});