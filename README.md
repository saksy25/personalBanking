# Personal Banking

A full-stack personal banking application built with modern web technologies to manage your financial accounts, transactions, and banking operations.

## Features

- 💰 **Account Management** - Create and manage multiple bank accounts
- 💸 **Transactions** - Deposit, withdraw, and transfer funds between accounts
- 📊 **Dashboard** - View account balances and transaction history
- 🔐 **Secure Authentication** - User registration and login functionality
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices

## Tech Stack

### Frontend
- JavaScript
- HTML5 & CSS3
- Modern UI framework for responsive design

### Backend
- Node.js
- Express.js (or your backend framework)
- RESTful API architecture

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Git

### Installation

1. Clone the repository
```bash
git clone https://github.com/saksy25/personalBanking.git
cd personalBanking
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd ../frontend
npm install
```

### Configuration

1. Create a `.env` file in the backend directory with the following variables:
```env
PORT=5000
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
```

2. Update any configuration files as needed for your environment

### Running the Application

1. Start the backend server
```bash
cd backend
npm start
```

2. In a new terminal, start the frontend
```bash
cd frontend
npm start
```

3. Open your browser and navigate to `http://localhost:3000` (or your configured port)

## Project Structure

```
personalBanking/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Accounts
- `GET /api/accounts` - Get all user accounts
- `POST /api/accounts` - Create new account
- `GET /api/accounts/:id` - Get account details

### Transactions
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions/deposit` - Deposit funds
- `POST /api/transactions/withdraw` - Withdraw funds
- `POST /api/transactions/transfer` - Transfer between accounts

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Project Link: [https://github.com/saksy25/personalBanking](https://github.com/saksy25/personalBanking)

## Acknowledgments

- Thanks to all contributors who have helped with this project
- Inspired by modern banking applications and best practices in financial software development
