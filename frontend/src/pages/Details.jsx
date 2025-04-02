import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import BlogDetailCard from "../components/BlogDetailCard";
import NavBar from "../components/Nav";
import useAuthStore from "../store/authStore";
import { getBlog, updateBlog, deleteBlog } from "../apis/api";
import { useNavigate } from "react-router";

const Details = () => {
  const { id } = useParams();
  const { userData } = useAuthStore();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { accessToken } = useAuthStore.getState();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await getBlog(id);
        setBlog(response.data);
      } catch (err) {
        setError("Failed to fetch blog details.");
        console.error("Error fetching blog:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const handleSave = async (updatedBlog) => {
    console.log("Save button clicked");
    try {
      await updateBlog(id, updatedBlog, accessToken);
      console.log("Blog updated successfully");
      navigate("/");
    } catch (error) {
      console.error("Error updating blog:", error);
    }
  };

  const handleDelete = async () => {
    console.log("Delete button clicked");
    try {
      await deleteBlog(id, accessToken);
      console.log("Blog deleted successfully");
      navigate("/");
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  if (loading) return <p className="text-center text-lg">Loading blog...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!blog) return <p className="text-center text-red-500">Blog not found.</p>;

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />

      <main className="flex-grow container mx-auto px-4 py-6">
        <div className="flex flex-col items-center">
          <BlogDetailCard
            id={blog.id}
            title={blog.title}
            content={blog.content}
            author={blog.author?.name}
            loggedInUserId={userData?.data.id}
            authorId={blog.author?.id}
            onSave={handleSave}
            onDelete={handleDelete}
          />
        </div>
      </main>

      <footer className="bg-gray-800 text-white text-center p-4">
        <p>&copy; 2025 Built by ADITYA RAJ.</p>
      </footer>
    </div>
  );
};

export default Details;
