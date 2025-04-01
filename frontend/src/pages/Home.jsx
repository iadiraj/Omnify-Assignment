import React, { useState, useEffect } from "react";
import BlogCard from "../components/BlogCard";
import { Link } from "react-router";
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
      <NavBar title={"Home"} />

      <main className="flex-grow flex items-center justify-center">
        {loading ? (
          <p className="text-gray-500">Loading blogs...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : blogs.length > 0 ? (
          <div className="flex flex-col items-center gap-4 px-4">
            {blogs.map((blog) => (
              <Link to={`/details/${blog.id}`} key={blog.id}>
                <BlogCard title={blog.title} content={blog.content} />
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No blogs available.</p>
        )}
      </main>

      <div className="sticky bottom-14 bg-white shadow-md py-4">
        <div className="flex justify-between container mx-auto px-4">
          <button
            onClick={handlePreviousPage}
            disabled={pageOffset === 0}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50">
            Previous
          </button>
          <button
            onClick={handleNextPage}
            disabled={blogs.length < pageSize}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50">
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
