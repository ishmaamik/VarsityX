import React from "react";

const PaymentFail = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-100">
      <div className="bg-white p-8 rounded shadow-md text-center">
        <h1 className="text-3xl font-bold text-red-700 mb-4">
          Payment Failed ❌
        </h1>
        <p className="text-gray-700">
          Oops! Something went wrong during your payment process.
        </p>
        <a
          href="/"
          className="mt-6 inline-block px-6 py-2 bg-red-600 text-white font-semibold rounded hover:bg-red-700"
        >
          Try Again
        </a>
      </div>
    </div>
  );
};

export default PaymentFail;
