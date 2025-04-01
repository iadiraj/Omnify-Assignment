import React, { useState, useEffect } from "react";
import { createBlog } from "../apis/api";
import useAuthStore from "../store/authStore";
import axios from "axios"; // Make sure to import axios

const CreateBlogCard = ({ title = "", content = "", onSave, onCancel }) => {
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedContent, setEditedContent] = useState(content);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  // Get auth state using the hook directly
  const { accessToken } = useAuthStore();

  // Validate authentication on component mount
  useEffect(() => {
    if (!accessToken) {
      setError("You must be logged in to create a blog post");
    }
  }, [accessToken]);

  const handleSave = async () => {
    if (!editedTitle?.trim()) {
      setError("Title is required");
      return;
    }

    if (!accessToken) {
      setError("Authentication required. Please log in again.");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      console.log("Using access token:", accessToken?.substring(0, 10) + "...");

      const blogDto = {
        title: editedTitle,
        content: editedContent,
      };

      const response = await createBlog(blogDto, accessToken);
      console.log("Blog created successfully!", response);
      onSave();
    } catch (error) {
      console.error("Error creating blog:", error);

      if (error.response?.status === 401) {
        setError("Your session has expired. Please log in again.");
      } else if (error.response?.status === 403) {
        setError("You don't have permission to create blog posts.");
      } else {
        setError(
          error.response?.data?.message ||
            "Failed to create blog. Please try again later."
        );
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl w-full bg-white shadow-lg rounded-lg overflow-hidden relative mx-auto p-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}

      <input
        type="text"
        value={editedTitle}
        onChange={(e) => setEditedTitle(e.target.value)}
        className="w-full text-3xl font-bold text-gray-800 mb-4 border border-gray-300 rounded p-2"
        placeholder="Enter blog title"
      />

      <textarea
        value={editedContent}
        onChange={(e) => setEditedContent(e.target.value)}
        className="w-full text-gray-600 text-base mb-6 border border-gray-300 rounded p-2"
        rows="6"
        placeholder="Enter blog content"
      />

      <div className="mt-4 flex gap-4">
        <button
          onClick={handleSave}
          disabled={isSaving || !accessToken}
          className={`px-4 py-2 rounded text-white ${
            isSaving || !accessToken
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600"
          }`}>
          {isSaving ? "Saving..." : "Save"}
        </button>

        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CreateBlogCard;
