import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import useAuthStore from "../store/authStore";
import CreateBlogCard from "./CreateBlogCard";

const NavBar = () => {
  const { isLoggedIn, logout, deleteAccount } = useAuthStore();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setShowLogoutDialog(false);
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
      console.log("Account deleted successfully.");
      navigate("/");
    } catch (error) {
      console.error("Error during account deletion:", error);
    } finally {
      setShowDeleteDialog(false);
    }
  };

  const handleSaveBlog = (blogData) => {
    console.log("Blog saved:", blogData);
    setShowCreateDialog(false);
    navigate("/");
  };

  const handleCancelBlog = () => {
    setShowCreateDialog(false);
  };

  const handleHomeClick = () => {
    navigate("/");
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-gray-800 text-white px-4 py-3 sticky top-0 z-10">
      <div className="flex justify-between items-center">
        <h1
          className="text-lg font-bold cursor-pointer"
          onClick={handleHomeClick}>
          Blog App
        </h1>

        <button
          className="sm:hidden text-white focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={
                isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"
              }></path>
          </svg>
        </button>

        <div className="hidden sm:flex space-x-4">
          {!isLoggedIn ? (
            <Link
              to="/auth"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
              Login/Signup
            </Link>
          ) : (
            <>
              <button
                onClick={() => setShowCreateDialog(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                Create
              </button>
              <button
                onClick={() => setShowLogoutDialog(true)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
                Logout
              </button>
              <button
                onClick={() => setShowDeleteDialog(true)}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
                Delete Account
              </button>
            </>
          )}
        </div>
      </div>

      {isMenuOpen && (
        <div className="sm:hidden mt-3 flex flex-col space-y-2">
          {!isLoggedIn ? (
            <Link
              to="/auth"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-center">
              Login/Signup
            </Link>
          ) : (
            <>
              <button
                onClick={() => setShowCreateDialog(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                Create
              </button>
              <button
                onClick={() => setShowLogoutDialog(true)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
                Logout
              </button>
              <button
                onClick={() => setShowDeleteDialog(true)}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
                Delete Account
              </button>
            </>
          )}
        </div>
      )}

      {showLogoutDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20 p-4">
          <div className="bg-white p-6 rounded shadow-lg text-center w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Confirm Logout</h2>
            <p className="mb-6 text-black">Are you sure you want to log out?</p>
            <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded w-full sm:w-auto">
                Yes
              </button>
              <button
                onClick={() => setShowLogoutDialog(false)}
                className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded w-full sm:w-auto">
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20 p-4">
          <div className="bg-white p-6 rounded shadow-lg text-center w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Confirm Account Deletion</h2>
            <p className="mb-6 text-black">
              Are you sure you want to delete your account? All of your blogs
              will be deleted too. This action cannot be undone.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
              <button
                onClick={handleDeleteAccount}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded w-full sm:w-auto">
                Yes
              </button>
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded w-full sm:w-auto">
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {showCreateDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20 p-4">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-3xl">
            <CreateBlogCard
              title=""
              content=""
              onSave={handleSaveBlog}
              onCancel={handleCancelBlog}
            />
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
