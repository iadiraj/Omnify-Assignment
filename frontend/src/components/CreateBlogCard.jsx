import React, { useState, useEffect } from "react";
import { createBlog } from "../apis/api";
import useAuthStore from "../store/authStore";

const CreateBlogCard = ({ title = "", content = "", onSave, onCancel }) => {
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedContent, setEditedContent] = useState(content);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const { accessToken } = useAuthStore();

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
    <div className="max-w-3xl w-full bg-white shadow-lg rounded-lg overflow-hidden relative mx-auto p-4 sm:p-6">
      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm sm:text-base">
          <p>{error}</p>
        </div>
      )}

      {/* Title Input */}
      <input
        type="text"
        value={editedTitle}
        onChange={(e) => setEditedTitle(e.target.value)}
        className="w-full text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mb-4 border border-gray-300 rounded p-2"
        placeholder="Enter blog title"
      />

      {/* Content Textarea */}
      <textarea
        value={editedContent}
        onChange={(e) => setEditedContent(e.target.value)}
        className="w-full text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 mb-6 border border-gray-300 rounded p-2"
        rows="6"
        placeholder="Enter blog content"
      />

      {/* Buttons */}
      <div className="mt-4 flex flex-wrap gap-4">
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
