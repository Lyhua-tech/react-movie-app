import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-primary">
      <h1 className="text-center text-white text-4xl">Not Found</h1>
      <Link to="/" className="flex items-center justify-center mt-4">
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-md">
          Back home
        </button>
      </Link>
    </div>
  );
};

export default NotFound;
