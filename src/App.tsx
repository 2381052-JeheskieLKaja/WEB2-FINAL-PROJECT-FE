// src/App.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from "react-router-dom";

// Layouts
import RootLayout from "./layouts/RootLayout";
import BaseLayout from "./layouts/BaseLayout";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Payment from "./pages/Payment";
import TicketAdmin from "./pages/TiketAdmin";
import Checkout from "./pages/Checkout";
import TiketApp from "./pages/Tiket";
import PaymentManagement from "./pages/PaymentManagement";
import CheckoutManagement from "./pages/CheckoutManagement";

// Auth Utils
import PrivateRoute from "./utils/PrivateRoute";
import PublicRoute from "./utils/PublicRoute";
import { AuthProvider } from "./utils/AuthProvider";

const queryClient = new QueryClient();

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        {/* Public Routes */}
        <Route element={<BaseLayout />}>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route
            path="/payment/:id"
            element={
              <Payment
                amount={0}
                currency={""}
                onPaymentSuccess={(details) => {
                  console.log("Success:", details);
                }}
                onPaymentError={(error) => {
                  console.error("Error:", error);
                }}
              />
            }
          />
        </Route>

        {/* Protected Routes */}
        <Route element={<RootLayout />}>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/tiket"
            element={
              <PrivateRoute>
                <TiketApp />
              </PrivateRoute>
            }
          />
          <Route
            path="/checkout/:id"
            element={
              <PrivateRoute>
                <Checkout />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/ticket"
            element={
              <PrivateRoute>
                <TicketAdmin />
              </PrivateRoute>
            }
          />
          <Route
            path="/payment-management"
            element={
              <PrivateRoute>
                <PaymentManagement />
              </PrivateRoute>
            }
          />
          <Route
            path="/checkout-management"
            element={
              <PrivateRoute>
                <CheckoutManagement />
              </PrivateRoute>
            }
          />
        </Route>
      </>
    )
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
