// src/components/Checkout.tsx
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../utils/AuthProvider"; // Adjust path
import { fetchCheckoutByPaymentId } from "../services/CheckoutAPI"; // Adjust path
import { Checkout as CheckoutType } from "../types/Checkout"; // Rename import to avoid conflict

import "../styles/Checkout.css"; // Import the CSS

// Helper to format currency (customize as needed)
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR"
  }).format(amount);
};

// Helper to format date (customize as needed)
const formatDate = (dateString?: string | Date): string => {
  if (!dateString) return "N/A";
  try {
    return new Date(dateString).toLocaleString("id-ID", {
      dateStyle: "medium",
      timeStyle: "short"
    });
  } catch (e) {
    return "Invalid Date";
  }
};

function Checkout() {
  const { pembayaranId } = useParams<{ pembayaranId: string }>(); // Get ID from URL
  const { getToken } = useAuth();
  const token = getToken();

  // Parse the ID from string to number
  const paymentIdParam = pembayaranId ? parseInt(pembayaranId, 10) : undefined;

  // == React Query: Fetching Checkout Details by Payment ID ==
  const {
    data: checkoutData,
    isLoading,
    error,
    isFetching // For background refresh indicator
  } = useQuery<CheckoutType, Error>({
    // Use the renamed type
    // Unique query key including the payment ID and token
    queryKey: ["checkout", "byPayment", paymentIdParam, token],
    queryFn: ({ queryKey }) => {
      const pId = queryKey[2] as number | undefined;
      const _token = queryKey[3] as string;
      if (!pId || isNaN(pId)) {
        // Prevent query if ID is invalid/missing
        return Promise.reject(new Error("Invalid Payment ID provided in URL."));
      }
      if (!_token) {
        return Promise.reject(new Error("Authentication token not found."));
      }
      return fetchCheckoutByPaymentId(pId, _token);
    },
    // Only run the query if paymentIdParam is a valid number and token exists
    enabled: !!paymentIdParam && !isNaN(paymentIdParam) && !!token,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: (failureCount, err: any) => {
      // Don't retry on 404 (Not Found) errors
      if (err?.response?.status === 404) {
        return false;
      }
      // Default retry behavior for other errors (e.g., 3 retries)
      return failureCount < 3;
    }
  });

  // Determine error message, especially for 404
  let errorMessage = error?.message;
  if ((error as any)?.response?.status === 404) {
    errorMessage = `Checkout details not found for Payment ID: ${paymentIdParam}. Please check the ID or contact support.`;
  }

  // == Render Logic ==

  if (!token) {
    return (
      <div className="checkout-container status-message error">
        Please log in to view checkout details.
      </div>
    );
  }

  if (!paymentIdParam || isNaN(paymentIdParam)) {
    return (
      <div className="checkout-container status-message error">
        Invalid Payment ID specified in the URL.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="checkout-container status-message loading">
        Loading Checkout Details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="checkout-container status-message error">
        Error loading checkout details: {errorMessage}
      </div>
    );
  }

  if (!checkoutData) {
    // This case might be covered by the 404 error handling, but good as a fallback
    return (
      <div className="checkout-container status-message error">
        Checkout details not found for Payment ID: {paymentIdParam}.
      </div>
    );
  }

  // Data is available, render the details
  const { pembayaran } = checkoutData; // Destructure nested payment object

  return (
    <div className="checkout-container">
      <h1>Checkout Details</h1>
      {isFetching && (
        <div className="status-message loading background">
          Checking for updates...
        </div>
      )}

      <div className="checkout-summary">
        <h2>Summary</h2>
        <div className="detail-item">
          <span className="detail-label">Checkout ID:</span>
          <span className="detail-value">{checkoutData.id}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Checkout Time:</span>
          <span className="detail-value">
            {formatDate(checkoutData.tanggal)}
          </span>
        </div>
        <div className="detail-item total-price">
          <span className="detail-label">Total Amount Paid:</span>
          <span className="detail-value">
            {formatCurrency(checkoutData.total_harga)}
          </span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Record Created:</span>
          <span className="detail-value">
            {formatDate(checkoutData.created_at)}
          </span>
        </div>
      </div>

      {pembayaran && (
        <div className="payment-details">
          <h2>Payment Information</h2>
          <div className="detail-item">
            <span className="detail-label">Payment ID:</span>
            <span className="detail-value">{pembayaran.id}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Payment Recorded:</span>
            <span className="detail-value">
              {formatDate(pembayaran.created_at)}
            </span>
          </div>
        </div>
      )}

      {/* Maybe add a button to go back or to view tickets */}
      {/* <div className="checkout-actions">
                 <button onClick={() => history.back()}>Go Back</button>
             </div> */}
    </div>
  );
}

export default Checkout;
