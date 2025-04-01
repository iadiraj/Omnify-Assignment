import React, { useState } from "react";
import useAuthStore from "../store/authStore";
import { useNavigate } from "react-router";

const LoginCard = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { login, fetchUserData, accessToken } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async () => {
    setErrorMessage("");
    if (!email.trim()) {
      setErrorMessage("Email is required and cannot be blank.");
      return;
    }
    // Email format validation using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Invalid email format.");
      return;
    }
    if (!password.trim()) {
      setErrorMessage("Password is required and cannot be blank.");
      return;
    }

    try {
      const response = await login({ email, password });
      const userData = await fetchUserData({ accessToken });
      console.log("User data:", userData.data.id);
      navigate(-1);
    } catch (error) {
      console.error("Login failed:", error);
      setErrorMessage(
        "Login failed. Please check your credentials and try again."
      );
    }
  };

  return (
    <div className="max-w-md w-full bg-white shadow-lg rounded-lg overflow-hidden mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        Login
      </h2>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="email">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your email"
        />
      </div>
      <div className="mb-6">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="password">
          Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your password"
        />
      </div>
      {errorMessage && (
        <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
      )}
      <button
        onClick={handleLogin}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200">
        Login
      </button>
    </div>
  );
};

export default LoginCard;
