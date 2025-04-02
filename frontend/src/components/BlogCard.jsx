import React from "react";
import { Link } from "react-router";

const BlogCard = ({ title, content, id }) => {
  return (
    <Link
      to={`/details/${id}`}
      className="block max-w-lg w-full bg-white shadow-md border-2 rounded-lg overflow-hidden relative">
      <div className="px-6 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
        <div className="relative">
          <p className="text-gray-600 text-base line-clamp-3">{content}</p>
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
        </div>
      </div>
      <div className="px-6 py-4 text-right">
        <span className="text-blue-500 text-lg font-medium cursor-pointer hover:underline">
          Read More
        </span>
      </div>
    </Link>
  );
};

export default BlogCard;
