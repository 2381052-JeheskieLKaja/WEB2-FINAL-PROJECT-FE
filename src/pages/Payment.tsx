// src/components/Payment.tsx
import React, { useState, FormEvent } from "react";

interface PaymentProps {
  amount: number;
  currency: string; // e.g., 'USD', 'EUR'
  onPaymentSuccess: (details: { transactionId: string }) => void;
  onPaymentError: (error: Error) => void;
  onAdd?: () => void;
  isEditable?: boolean;
}

const Payment: React.FC<PaymentProps> = ({
  amount,
  currency,
  onPaymentSuccess,
  onPaymentError,
  onAdd,
  isEditable = false
}) => {
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiryDate: "", // Expected format: MM/YY
    cvc: "",
    nameOnCard: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setCardDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value
    }));
    // Clear errors when user starts typing again
    if (error) setError(null);
    if (successMessage) setSuccessMessage(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulate successful payment
      onPaymentSuccess({
        transactionId: "tx_" + Math.random().toString(36).substr(2, 9)
      });
      setSuccessMessage("Payment successful!");
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Payment failed");
      setError(error.message);
      onPaymentError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-800 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Payment Details</h2>
        {isEditable && onAdd && (
          <button
            onClick={onAdd}
            className="px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition-colors"
          >
            Add
          </button>
        )}
      </div>

      <div className="mb-6">
        <p className="text-lg font-semibold text-gray-300">
          Amount to Pay:{" "}
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: currency
          }).format(amount)}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="cardNumber"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Card Number
          </label>
          <input
            type="text"
            id="cardNumber"
            name="cardNumber"
            value={cardDetails.cardNumber}
            onChange={handleInputChange}
            placeholder="1234 5678 9012 3456"
            className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
            required
            disabled={!isEditable}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="expiryDate"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Expiry Date (MM/YY)
            </label>
            <input
              type="text"
              id="expiryDate"
              name="expiryDate"
              value={cardDetails.expiryDate}
              onChange={handleInputChange}
              placeholder="MM/YY"
              className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
              required
              disabled={!isEditable}
            />
          </div>

          <div>
            <label
              htmlFor="cvc"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              CVC
            </label>
            <input
              type="text"
              id="cvc"
              name="cvc"
              value={cardDetails.cvc}
              onChange={handleInputChange}
              placeholder="123"
              className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
              required
              disabled={!isEditable}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="nameOnCard"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Name on Card
          </label>
          <input
            type="text"
            id="nameOnCard"
            name="nameOnCard"
            value={cardDetails.nameOnCard}
            onChange={handleInputChange}
            placeholder="John Doe"
            className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
            required
            disabled={!isEditable}
          />
        </div>

        {error && (
          <div className="p-3 bg-red-900/50 text-red-400 rounded-md">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="p-3 bg-green-900/50 text-green-400 rounded-md">
            {successMessage}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !isEditable}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            isLoading || !isEditable
              ? "bg-gray-900 cursor-not-allowed"
              : "bg-gray-600 hover:bg-gray-500"
          }`}
        >
          {isLoading ? "Processing..." : "Pay Now"}
        </button>
      </form>

      <div className="mt-6 text-sm text-gray-400">
        <p className="text-center">
          Your payment is secure and encrypted. We never store your card
          details.
        </p>
      </div>
    </div>
  );
};

export default Payment;
