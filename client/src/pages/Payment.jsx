import { useState } from "react";
import axios from "axios";

const Payment = () => {
  const [amount, setAmount] = useState(500);
  const [email, setEmail] = useState("");

  const handlePayment = async (method) => {
    try {
      const { data } = await axios.post(
        `http://localhost:5000/api/payment/${method}`,
        { amount, email }
      );
      window.location.href = data.url;
    } catch (err) {
      alert("Payment initiation failed");
    }
  };

  return (
    <div className="flex flex-col gap-4 items-center p-6">
      <h1 className="text-2xl font-bold">Select a Payment Method</h1>
      <input
        type="email"
        placeholder="Your Email"
        className="p-2 border rounded w-80"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount"
        className="p-2 border rounded w-80"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
      />
      <div className="flex gap-4">
        <button
          onClick={() => handlePayment("stripe")}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          Pay with Stripe
        </button>
        <button
          onClick={() => handlePayment("sslcommerz")}
          className="bg-yellow-500 text-black px-4 py-2 rounded"
        >
          Pay with SSLCommerz
        </button>
      </div>
    </div>
  );
};

export default Payment;
