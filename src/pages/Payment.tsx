// src/components/Payment.tsx
import React, { useState, FormEvent } from 'react';
import "../styles/Payment.css"

interface PaymentProps {
  amount: number;
  currency: string; // e.g., 'USD', 'EUR'
  onPaymentSuccess: (details: { transactionId: string }) => void;
  onPaymentError: (error: Error) => void;
}

const Payment: React.FC<PaymentProps> = ({
  amount,
  currency,
  onPaymentSuccess,
  onPaymentError,
}) => {
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '', // Expected format: MM/YY
    cvc: '',
    nameOnCard: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setCardDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
    // Clear errors when user starts typing again
    if (error) setError(null);
    if (successMessage) setSuccessMessage(null);
  };

  // --- !!! IMPORTANT SECURITY NOTE !!! ---
  // This handleSubmit simulates processing. In a REAL app:
  // 1. Use a Payment Provider SDK (Stripe Elements, Braintree Drop-in, etc.)
  //    to securely collect card details in an iframe/component they provide.
  // 2. The SDK gives you a secure, one-time-use TOKEN representing the card.
  // 3. Send THIS TOKEN (and amount, currency etc.) to YOUR backend server.
  // 4. Your backend server uses the provider's API (with your secret keys)
  //    and the token to make the actual charge.
  // NEVER SEND RAW CARD DETAILS FROM FRONTEND TO YOUR BACKEND.
  // NEVER HANDLE RAW CARD DETAILS DIRECTLY.
  // ----------------------------------------
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    // Basic client-side validation (more robust validation needed in real apps)
    if (
      !cardDetails.cardNumber ||
      !cardDetails.expiryDate ||
      !cardDetails.cvc ||
      !cardDetails.nameOnCard
    ) {
      setError('Please fill in all card details.');
      setIsLoading(false);
      return;
    }

    // ** SIMULATED PAYMENT PROCESSING **
    console.log('Simulating payment submission with (NEVER log real details!):', {
      // In a real app, you'd get a token from Stripe/Braintree/etc. here
      // and send *that* token to your backend.
      // Example: const token = await stripe.createToken(cardElement);
      // Example: await api.processPayment(token.id, amount, currency);
      cardNumber: `**** **** **** ${cardDetails.cardNumber.slice(-4)}`, // Masked for demo
      expiryDate: cardDetails.expiryDate,
      cvc: '***', // Masked for demo
      nameOnCard: cardDetails.nameOnCard,
      amount,
      currency,
    });

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulate success/failure (replace with actual API call to your backend)
      const success = Math.random() > 0.2; // 80% success rate for demo

      if (success) {
        const transactionId = `txn_${Date.now()}`;
        setSuccessMessage(`Payment successful! Transaction ID: ${transactionId}`);
        console.log('Payment successful:', { transactionId });
        // Reset form potentially (or redirect, show confirmation etc.)
        // setCardDetails({ cardNumber: '', expiryDate: '', cvc: '', nameOnCard: '' });
        onPaymentSuccess({ transactionId }); // Notify parent component
      } else {
        throw new Error('Payment declined by bank (simulated).');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      console.error('Payment failed:', errorMessage);
      setError(`Payment failed: ${errorMessage}`);
      onPaymentError(err instanceof Error ? err : new Error(errorMessage)); // Notify parent component
    } finally {
      setIsLoading(false);
    }
  };

  // --- !!! IMPORTANT !!! ---
  // In a real app using e.g., Stripe Elements, you would replace the
  // Card Number, Expiry, and CVC input fields below with a single component
  // provided by the Stripe library (e.g., <CardElement />).
  // The 'Name on Card' input might remain separate.
  // --------------------------
  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <h2>Pay {currency}{amount.toFixed(2)}</h2>

      {/* Placeholder for Payment Provider Element (e.g., Stripe CardElement) */}
      {/* <div id="card-element"></div> */}

      {/* --- These inputs are for DEMO ONLY - Use provider components --- */}
      <div className="form-group">
        <label htmlFor="cardNumber">Card Number</label>
        <input
          type="text" // Use "tel" for better mobile numeric keyboard, add inputMode="numeric"
          id="cardNumber"
          name="cardNumber"
          value={cardDetails.cardNumber}
          onChange={handleInputChange}
          placeholder="0000 0000 0000 0000"
          required
          maxLength={19} // Basic length check
          pattern="[\d ]{16,19}" // Basic pattern (allows spaces)
          autoComplete="cc-number"
          disabled={isLoading}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="expiryDate">Expiry Date</label>
          <input
            type="text" // Could use "month" but formatting varies; text + pattern is common
            id="expiryDate"
            name="expiryDate"
            value={cardDetails.expiryDate}
            onChange={handleInputChange}
            placeholder="MM/YY"
            required
            maxLength={5} // MM/YY
            pattern="\d{2}/\d{2}" // Basic MM/YY pattern
            autoComplete="cc-exp"
            disabled={isLoading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="cvc">CVC</label>
          <input
            type="text" // Use "tel" or "password"
            id="cvc"
            name="cvc"
            value={cardDetails.cvc}
            onChange={handleInputChange}
            placeholder="123"
            required
            maxLength={4} // Amex has 4 digits
            pattern="\d{3,4}" // 3 or 4 digits
            inputMode="numeric"
            autoComplete="cc-csc"
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="nameOnCard">Name on Card</label>
        <input
          type="text"
          id="nameOnCard"
          name="nameOnCard"
          value={cardDetails.nameOnCard}
          onChange={handleInputChange}
          placeholder="Jane Doe"
          required
          autoComplete="cc-name"
          disabled={isLoading}
        />
      </div>
      {/* --- End of DEMO ONLY inputs --- */}


      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      <button type="submit" className="submit-button" disabled={isLoading}>
        {isLoading ? 'Processing...' : `Pay ${currency}${amount.toFixed(2)}`}
      </button>

      <p className="security-note">
        🔒 This is a demo form. In a real application, card details would be
        handled securely by a payment provider like Stripe or PayPal.
      </p>
    </form>
  );
};

export default Payment;