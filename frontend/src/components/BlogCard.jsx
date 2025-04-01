import React from "react";

const BlogCard = ({ title, content }) => {
  return (
    <div className="max-w-lg w-full bg-white shadow-lg rounded-lg overflow-hidden relative">
      <div className="px-6 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
        <p className="text-gray-600 text-base line-clamp-3 blur-sm ">
          {content}
        </p>
      </div>
      <div className="px-6 py-4 text-right">
        <span className="text-blue-500 text-lg font-medium">Read More</span>
      </div>
    </div>
  );
};

export default BlogCard;
