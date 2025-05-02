import { useState } from "react";
// import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthProvider";
import { useForm, SubmitHandler } from "react-hook-form";
import { LoginCredentials, login as authLogin } from "../services/auth.service";

const Login = () => {
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginCredentials>();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const onSubmit: SubmitHandler<LoginCredentials> = async (data) => {
    setError(null);
    try {
      const response = await authLogin(data);
      login(response.access_token);
      navigate("/");
    } catch (err) {
       console.error("Login API error:", err);
      setError("Login failed. Please check your credentials.");
    }
  };

  // Outermost div remains simple for centering within BaseLayout's main area
  return (
    <div className="bg-white w-full flex justify-center">
      {/* --- SIZE MODIFICATION START --- */}
      {/* Changed max-w-md to max-w-lg to make the card wider */}
      {/* Changed p-8 to p-10 to increase internal padding, making the card feel larger */}
      <div className="max-w-lg w-full space-y-8 bg-white p-10 rounded-lg border border-gray-200">
      {/* --- SIZE MODIFICATION END --- */}
        <div>
          {/* Optional: Increase heading size/margin if desired e.g., text-4xl, mb-10 */}
          <h2 className="mt-6 text-center text-3xl font-bold text-black">
            Login to your account
          </h2>
        </div>
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div>
            {/* Optional: Increase spacing below labels e.g., mb-2 */}
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              {/* Optional: Increase input padding if desired e.g., py-3 */}
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="Enter your email"
                className={`mt-1 block w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent`}
                {...register("email", {
                   required: "Email is required",
                   // pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Invalid email address" }
                })}
                aria-invalid={errors.email ? "true" : "false"}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

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
                autoComplete="current-password"
                placeholder="Enter your password"
                className={`mt-1 block w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent`}
                {...register("password", { required: "Password is required" })}
                aria-invalid={errors.password ? "true" : "false"}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <div>
             {/* Optional: Increase button padding/font size e.g., py-3, text-base */}
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black" // Increased py and text size
            >
              Login
            </button>
          </div>
        </form>
        {/* Optional: Increase top margin for this text e.g., mt-6 */}
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <a
            href="/register"
            className="font-medium text-black hover:text-gray-700"
          >
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;