import React, { useState } from "react";
import { Link } from "react-router";
import useAuthStore from "../store/authStore";
import CreateBlogCard from "./CreateBlogCard"; // Import CreateBlogCard component

const NavBar = ({ title }) => {
  const { isLoggedIn, logout, deleteAccount } = useAuthStore(); // Import deleteAccount from authStore
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false); // State for delete confirmation dialog
  const [showCreateDialog, setShowCreateDialog] = useState(false); // State for create blog dialog

  const handleLogout = () => {
    logout();
    setShowLogoutDialog(false); // Close the dialog after logout
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount(); // Call deleteAccount from authStore
      console.log("Account deleted successfully.");
    } catch (error) {
      console.error("Error during account deletion:", error);
    } finally {
      setShowDeleteDialog(false); // Close the dialog after deletion
    }
  };

  const handleSaveBlog = (blogData) => {
    console.log("Blog saved:", blogData);
    setShowCreateDialog(false); // Close the create blog dialog after saving
  };

  const handleCancelBlog = () => {
    setShowCreateDialog(false); // Close the create blog dialog when canceled
  };

  return (
    <nav className="bg-gray-800 text-white px-4 py-3 flex justify-between items-center sticky top-0 z-10">
      <h1 className="text-lg font-bold">{title}</h1>

      <div className="flex space-x-4">
        {!isLoggedIn ? (
          <Link
            to="/auth"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
            Login/Signup
          </Link>
        ) : (
          <>
            <button
              onClick={() => setShowCreateDialog(true)} // Open create blog dialog
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
              Create
            </button>
            <button
              onClick={() => setShowLogoutDialog(true)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
              Logout
            </button>
            <button
              onClick={() => setShowDeleteDialog(true)} // Open delete confirmation dialog
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
              Delete Account
            </button>
          </>
        )}
      </div>

      {/* Logout Confirmation Dialog */}
      {showLogoutDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
          <div className="bg-white p-6 rounded shadow-lg text-center">
            <h2 className="text-lg font-bold mb-4">Confirm Logout</h2>
            <p className="mb-6 text-black">Are you sure you want to log out?</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
                Yes
              </button>
              <button
                onClick={() => setShowLogoutDialog(false)}
                className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded">
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
          <div className="bg-white p-6 rounded shadow-lg text-center">
            <h2 className="text-lg font-bold mb-4">Confirm Account Deletion</h2>
            <p className="mb-6 text-black">
              Are you sure you want to delete your account? This action cannot
              be undone.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleDeleteAccount}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
                Yes
              </button>
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded">
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Blog Dialog */}
      {showCreateDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-3xl">
            <CreateBlogCard
              title=""
              content=""
              onSave={handleSaveBlog} // Pass the save handler
              onCancel={handleCancelBlog} // Pass the cancel handler
            />
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
