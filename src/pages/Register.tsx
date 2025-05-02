import { useState } from "react"; // Import useState for API errors
import { useForm, SubmitHandler } from "react-hook-form";
import {
  RegisterData,
  register as authRegister
} from "../services/auth.service";
import { useNavigate, Link } from "react-router-dom"; // Import Link

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting } // Add isSubmitting
  } = useForm<RegisterData>();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<string | null>(null); // State for API errors

  const onSubmit: SubmitHandler<RegisterData> = async (data) => {
    setApiError(null); // Clear previous API error
    try {
      // Add password confirmation logic here if needed before calling API
      await authRegister(data);
      // Optional: Show a success message before navigating
      alert("Registration successful! Please login."); // Simple alert, consider a modal or toast
      navigate("/login"); // Navigate to login after successful registration
    } catch (error: any) {
      // Catch specific error type if possible
      console.error("Registration failed:", error);
      // Set a user-friendly error message based on the error received
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        // Example: Use message from backend if available
        setApiError(error.response.data.message);
      } else {
        setApiError("Registration failed. Please try again later.");
      }
    }
  };

  // Removed layout classes from outer div, added centering
  return (
    <div className="bg-white w-full flex justify-center">
      {/* Form container: Adjusted size (max-w-lg, p-10) and styling */}
      <div className="max-w-lg w-full space-y-8 bg-white p-10 rounded-lg border border-gray-200">
        <div>
          {/* Heading: Black text */}
          <h2 className="mt-6 text-center text-3xl font-bold text-black">
            Create your account
          </h2>
        </div>

        {/* Display API Error */}
        {apiError && (
          <p className="text-red-600 text-sm mb-6 text-center">{apiError}</p>
        )}

        {/* Form styling and validation */}
        <form
          className="mt-8 space-y-6"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          {/* Removed wrapper div with shadow/-space-y-px */}
          <div>
            {/* Name Field */}
            <div className="mb-4">
              {/* Label: Lighter gray */}
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Firstname
              </label>
              {/* Input: B&W styling, error border */}
              <input
                id="username"
                placeholder="Enter your full name" // Changed placeholder
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.username ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent`}
                {...register("username", { required: "Name is required" })}
                aria-invalid={errors.username ? "true" : "false"}
              />
              {/* Error Message: Red text */}
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              {/* Label: Lighter gray */}
              <label
                htmlFor="nama"
                className="block text-sm font-medium text-gray-700"
              >
                Lastname
              </label>
              {/* Input: B&W styling, error border */}
              <input
                id="nama"
                placeholder="Enter your full name" // Changed placeholder
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.username ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent`}
                {...register("nama", { required: "Name is required" })}
                aria-invalid={errors.nama ? "true" : "false"}
              />
              {/* Error Message: Red text */}
              {errors.nama && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.nama.message}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com" // Changed placeholder
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent`}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    // Basic email validation
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address format"
                  }
                })}
                aria-invalid={errors.email ? "true" : "false"}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password" // Use new-password for registration
                placeholder="Create a password" // Changed placeholder
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent`}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    // Example: Add minimum length validation
                    value: 8,
                    message: "Password must be at least 8 characters long"
                  }
                })}
                aria-invalid={errors.password ? "true" : "false"}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
              {/* Consider adding a Password Confirmation field here */}
            </div>
          </div>

          {/* Submit Button: Adjusted size and style */}
          <div>
            <button
              type="submit"
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black ${
                isSubmitting ? "opacity-60 cursor-not-allowed" : "" // Use RHF isSubmitting
              }`}
              disabled={isSubmitting} // Disable when submitting
            >
              {isSubmitting ? "Registering..." : "Register"}{" "}
              {/* Loading text */}
            </button>
          </div>
        </form>

        {/* Link to Login: Adjusted text color and use <Link> */}
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link // Use Link component
            to="/login"
            className="font-medium text-black hover:text-gray-700"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
