import React, { useState } from "react";
import useAuthStore from "../store/authStore";

const SignupCard = ({ onSignUp }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showSnackbar, setShowSnackbar] = useState(false); // State for snackbar visibility
  const { signUp } = useAuthStore();

  const handleSignup = async () => {
    setErrorMessage("");
    if (!name.trim()) {
      setErrorMessage("Name is required and cannot be blank.");
      return;
    }
    if (!email.trim()) {
      setErrorMessage("Email is required and cannot be blank.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Invalid email format.");
      return;
    }
    if (!password.trim()) {
      setErrorMessage("Password is required and cannot be blank.");
      return;
    }
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    try {
      const response = await signUp({ name, email, password });
      console.log("Signup successful:", response);

      // Show snackbar on successful signup
      setShowSnackbar(true);
      setTimeout(() => setShowSnackbar(false), 3000); // Hide snackbar after 3 seconds
    } catch (error) {
      console.error("Signup failed:", error);
      setErrorMessage("Signup failed. Please try again.");
    }
  };

  return (
    <div className="max-w-md w-full bg-white shadow-lg rounded-lg overflow-hidden mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        Sign Up
      </h2>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="name">
          Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your name"
        />
      </div>
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
        onClick={handleSignup}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200">
        Sign Up
      </button>

      {/* Snackbar */}
      {showSnackbar && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded shadow-lg">
          Signup successful!
        </div>
      )}
    </div>
  );
};

export default SignupCard;
