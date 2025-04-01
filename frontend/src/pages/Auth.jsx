import React, { useState } from "react";
import { useNavigate } from "react-router";
import LoginCard from "../components/LoginCard";
import SignupCard from "../components/SignupCard";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleLogin = (credentials) => {
    console.log("Login credentials:", credentials);
    // Implement login logic here
  };

  const handleSignup = (userData) => {
    console.log("Signup data:", userData);
    // Implement signup logic here
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 relative">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-red-500 text-white hover:bg-red-600 hover:shadow-lg rounded-full shadow-md transition duration-200 opacity-90 hover:opacity-100">
        &times;
      </button>

      <div className="w-full max-w-md">
        {isLogin ? (
          <LoginCard onLogin={handleLogin} />
        ) : (
          <SignupCard onSignup={handleSignup} />
        )}
        <div className="text-center mt-4">
          {isLogin ? (
            <p className="text-gray-600">
              Don't have an account?{" "}
              <button
                onClick={() => setIsLogin(false)}
                className="text-blue-500 hover:underline">
                Sign Up
              </button>
            </p>
          ) : (
            <p className="text-gray-600">
              Already have an account?{" "}
              <button
                onClick={() => setIsLogin(true)}
                className="text-blue-500 hover:underline">
                Log In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
