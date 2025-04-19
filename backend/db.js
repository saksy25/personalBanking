// db.js - MongoDB connection and schema setup
const mongoose = require('mongoose');

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/securebanking', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

// Define schemas
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  accountNumber: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now }
});

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['credit', 'debit'], required: true },
  amount: { type: String, required: true },
  description: { type: String, required: true },
  reference: { type: String },
  timestamp: { type: Date, default: Date.now }
});

const balanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  balance: { type: Number, required: true, default: 0 }
});

const loginHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  timestamp: { type: Date, default: Date.now },
  status: { type: String, enum: ['success', 'failed'], required: true },
  device: { type: String },
  location: { type: String }
});

const loginAttemptSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  attempts: { type: Number, default: 0 },
  lastAttempt: { type: Date, default: Date.now }
});

const mfaCodeSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  code: { type: String, required: true },
  expiresAt: { type: Date, required: true }
});

const sessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  expiresAt: { type: Date, required: true }
});

// Create models
const User = mongoose.model('User', userSchema);
const Transaction = mongoose.model('Transaction', transactionSchema);
const Balance = mongoose.model('Balance', balanceSchema);
const LoginHistory = mongoose.model('LoginHistory', loginHistorySchema);
const LoginAttempt = mongoose.model('LoginAttempt', loginAttemptSchema);
const MFACode = mongoose.model('MFACode', mfaCodeSchema);
const Session = mongoose.model('Session', sessionSchema);

module.exports = {
  connectDB,
  User,
  Transaction,
  Balance,
  LoginHistory,
  LoginAttempt,
  MFACode,
  Session
};