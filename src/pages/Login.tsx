import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthProvider";
import "../styles/Login.css";
import AxiosInstance from "../utils/AxiosInstance";
import { useMutation, useQuery } from "@tanstack/react-query";
import { SubmitHandler, useForm } from "react-hook-form";

interface LoginDto {
  email: string;
  password: string;
}

const postLoginReq = async (data: LoginDto) => {
  return AxiosInstance.post<{ access_token: string }>("api/auth/login", data);
};

const Login = () => {
  const { login } = useAuth();
  const { register, handleSubmit } = useForm<LoginDto>();
  const navigate = useNavigate();

  const handleLogin = async (data: LoginDto, e: any) => {
    e.preventDefault();
    const res = await postLoginReq(data);

    if (res.data) {
      login(res.data.access_token);
    } else {
      alert("login failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Login</h2>
        <form className="login-form" onSubmit={handleSubmit(handleLogin)}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="text"
              placeholder="email"
              className="form-input"
              {...register("email")}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              placeholder="Password"
              className="form-input"
              {...register("password")}
            />
          </div>

          <button type="submit" className="form-button">
            Login
          </button>
        </form>
        <p className="form-footer">
          Don't have an account?{" "}
          <a href="/register" className="form-link">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
