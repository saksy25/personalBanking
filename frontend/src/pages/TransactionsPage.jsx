// pages/TransactionsPage.jsx
import { TransactionHistory } from '../components/AccountOperations';

const TransactionsPage = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Transaction History</h1>
      <TransactionHistory />
    </div>
  );
};

export default TransactionsPage;