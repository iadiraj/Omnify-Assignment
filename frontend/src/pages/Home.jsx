import React, { useState, useEffect } from "react";
import BlogCard from "../components/BlogCard";
import NavBar from "../components/Nav";
import { getAllBlogs } from "../apis/api";

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [pageOffset, setPageOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const pageSize = 3;

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getAllBlogs(pageOffset, pageSize);
        console.log("API Response:", response);
        if (response.data && response.data.length > 0) {
          setBlogs(response.data);
        } else {
          setBlogs([]);
        }
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError("Failed to fetch blogs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [pageOffset]);

  const handleNextPage = () => {
    setPageOffset((prevOffset) => prevOffset + 1);
  };

  const handlePreviousPage = () => {
    setPageOffset((prevOffset) => Math.max(prevOffset - 1, 0));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />

      <main className="flex-grow flex items-center justify-center px-4">
        {loading ? (
          <p className="text-gray-500 text-center">Loading blogs...</p>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : blogs.length > 0 ? (
          <div className="flex flex-col items-center w-full max-w-3xl mx-auto">
            {blogs.map((blog) => (
              <div key={blog.id} className="w-full flex justify-center my-4">
                <BlogCard
                  title={blog.title}
                  content={blog.content}
                  id={blog.id}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">No blogs available.</p>
        )}
      </main>

      <div className="bg-white shadow-md py-4">
        <div className="flex justify-between items-center container mx-auto px-4">
          <button
            onClick={handlePreviousPage}
            disabled={pageOffset === 0}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed">
            Previous
          </button>
          <button
            onClick={handleNextPage}
            disabled={blogs.length < pageSize}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed">
            Next
          </button>
        </div>
      </div>

      <footer className="sticky bottom-0 bg-gray-800 text-white text-center p-4">
        <p>&copy; 2025 Built by ADITYA RAJ.</p>
      </footer>
    </div>
  );
};

export default Home;
