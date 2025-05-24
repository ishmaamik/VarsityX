import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, AlertTriangle, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const PaymentStatus = () => {
  const [status, setStatus] = useState('loading');
  const [transaction, setTransaction] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const transactionId = params.get('transactionId');

  useEffect(() => {
    const fetchTransactionStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `http://localhost:5000/api/payment/status/${transactionId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTransaction(response.data.transaction);
        setStatus(response.data.transaction.status.toLowerCase());
      } catch (error) {
        console.error('Error fetching transaction status:', error);
        toast.error('Failed to fetch transaction status');
        setStatus('error');
      }
    };

    if (transactionId) {
      fetchTransactionStatus();
    }
  }, [transactionId]);

  const getStatusContent = () => {
    switch (status) {
      case 'completed':
        return {
          icon: <CheckCircle className="w-16 h-16 text-green-500" />,
          title: 'Payment Successful',
          message: 'Your payment has been processed successfully.',
          buttonText: 'View Orders'
        };
      case 'failed':
        return {
          icon: <XCircle className="w-16 h-16 text-red-500" />,
          title: 'Payment Failed',
          message: 'Your payment could not be processed. Please try again.',
          buttonText: 'Try Again'
        };
      case 'cancelled':
        return {
          icon: <AlertTriangle className="w-16 h-16 text-yellow-500" />,
          title: 'Payment Cancelled',
          message: 'You have cancelled the payment process.',
          buttonText: 'Return to Cart'
        };
      case 'error':
        return {
          icon: <AlertTriangle className="w-16 h-16 text-red-500" />,
          title: 'Error',
          message: 'An error occurred while processing your payment.',
          buttonText: 'Return to Cart'
        };
      default:
        return {
          icon: <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />,
          title: 'Processing',
          message: 'Please wait while we process your payment...',
          buttonText: ''
        };
    }
  };

  const handleButtonClick = () => {
    switch (status) {
      case 'completed':
        navigate('/orders');
        break;
      case 'failed':
      case 'cancelled':
      case 'error':
        navigate('/cart');
        break;
      default:
        break;
    }
  };

  const content = getStatusContent();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 text-center">
          <div className="flex justify-center mb-6">{content.icon}</div>
          <h2 className="text-2xl font-bold mb-2">{content.title}</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{content.message}</p>

          {transaction && status === 'completed' && (
            <div className="mb-6 text-left bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Transaction Details</h3>
              <div className="space-y-2 text-sm">
                <p>Transaction ID: {transaction._id}</p>
                <p>Amount: ৳{transaction.totalAmount}</p>
                <p>Date: {new Date(transaction.createdAt).toLocaleString()}</p>
                <p>Payment Method: {transaction.paymentDetails?.card_type || 'N/A'}</p>
              </div>
            </div>
          )}

          {content.buttonText && (
            <button
              onClick={handleButtonClick}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {content.buttonText}
            </button>
          )}

          <button
            onClick={() => navigate('/marketplace')}
            className="mt-4 flex items-center justify-center w-full text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Marketplace
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentStatus; 