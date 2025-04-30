import { useForm, SubmitHandler } from "react-hook-form";
import "../styles/Register.css";

interface FormInputs {
  name: string;
  email: string;
  password: string;
}

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormInputs>();

  const onSubmit: SubmitHandler<FormInputs> = data => {
    console.log(data);
    // You can replace this with your API call
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-title">Register</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="register-form">
          <div className="form-group">
            <label className="form-label">Name</label>
            <input
              {...register("name", { required: "Name is required" })}
              className="form-input"
              placeholder="Enter your name"
            />
            {errors.name && <p className="form-error">{errors.name.message}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              className="form-input"
              placeholder="Enter your email"
            />
            {errors.email && <p className="form-error">{errors.email.message}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              {...register("password", { required: "Password is required" })}
              className="form-input"
              placeholder="Enter your password"
            />
            {errors.password && <p className="form-error">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            className="form-button"
          >
            Register
          </button>
        </form>
        <p className="form-footer">
          Already have an account? <a href="/" className="form-link">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
