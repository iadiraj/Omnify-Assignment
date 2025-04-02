import React, { useState } from "react";
import { useNavigate } from "react-router";

const BlogDetailCard = ({
  id,
  title,
  content,
  author,
  loggedInUserId,
  authorId,
  onSave,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedContent, setEditedContent] = useState(content);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmSave, setConfirmSave] = useState(false);
  const navigate = useNavigate();

  const handleSave = () => {
    setConfirmSave(true);
  };

  const confirmSaveAction = async () => {
    await onSave({ title: editedTitle, content: editedContent });
    setIsEditing(false);
    setConfirmSave(false);
  };

  const handleDelete = () => {
    setConfirmDelete(true);
  };

  const confirmDeleteAction = () => {
    onDelete();
    setConfirmDelete(false);
  };

  return (
    <div className="max-w-3xl w-full bg-white shadow-lg rounded-lg overflow-hidden relative mx-auto p-6">
      {isEditing ? (
        <>
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="w-full text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mb-4 border border-gray-300 rounded p-2"
          />
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 mb-6 border border-gray-300 rounded p-2"
            rows="6"
          />
        </>
      ) : (
        <>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
            {title}
          </h1>
          <p className="text-gray-600 text-sm sm:text-base mb-6">{content}</p>
        </>
      )}
      <p className="text-gray-500 text-sm sm:text-md">Author: {author}</p>

      {loggedInUserId === authorId && (
        <div className="mt-4 flex flex-wrap gap-4">
          {isEditing ? (
            <>
              {confirmSave ? (
                <>
                  <button
                    onClick={confirmSaveAction}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                    OK
                  </button>
                  <button
                    onClick={() => setConfirmSave(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
                    Cancel
                  </button>
                </>
              )}
            </>
          ) : (
            <>
              {confirmDelete ? (
                <>
                  <button
                    onClick={confirmDeleteAction}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                    OK
                  </button>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                    Delete
                  </button>
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default BlogDetailCard;
