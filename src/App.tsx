// src/App.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
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

// Auth Utils
import PrivateRoute from "./utils/PrivateRoute";
import PublicRoute from "./utils/PublicRoute";
import { AuthProvider } from "./utils/AuthProvider";

const queryClient = new QueryClient();

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      // Use a Fragment or no wrapper here if AuthProvider is outside
      <>
        {/* Public Routes */}
        <Route element={<BaseLayout />}> {/* Layout for public pages */}
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
          {/* --- MOVE PAYMENT HERE FOR PUBLIC ACCESS --- */}
          <Route
            path="/payment/:id"
            element={
              // Decide: Keep PublicRoute? Or remove if logged-in users CAN also access?
              // <PublicRoute> // Maybe remove this wrapper if unnecessary
                <Payment
                  // These props likely need to be fetched or passed differently
                  amount={0}
                  currency={""}
                  onPaymentSuccess={(details) => { console.log("Success:", details); }}
                  onPaymentError={(error) => { console.error("Error:", error); }}
                />
              // </PublicRoute>
            }
          />
        </Route>

        {/* Protected Routes */}
        <Route element={<RootLayout />}> {/* Layout for authenticated sections */}
           <Route
            path="tiket/:id"
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
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          {/* Add other private routes here */}
        </Route>
        {/* Optional: Catch-all 404 Route */}
        {/* <Route path="*" element={<NotFoundPage />} /> */}
      </>
    )
  );

  return (
    // Standard Provider wrapping: Outermost to Innermost
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;