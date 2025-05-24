import React from "react";

const PaymentSuccess = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100">
      <div className="bg-white p-8 rounded shadow-md text-center">
        <h1 className="text-3xl font-bold text-green-700 mb-4">
          Payment Successful 🎉
        </h1>
        <p className="text-gray-700">
          Thank you! Your payment has been processed successfully.
        </p>
        <a
          href="/"
          className="mt-6 inline-block px-6 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700"
        >
          Go to Home
        </a>
      </div>
    </div>
  );
};

export default PaymentSuccess;
