import React from "react";
import { Link } from "react-router-dom";

const MovieCard = ({
  movie: {
    id,
    title,
    poster_path,
    release_date,
    vote_average,
    original_language,
  },
  className,
}) => {
  return (
    <Link
      to={`/movie/${id}`}
      className={`bg-gray-900/80 border border-gray-800 rounded-xl shadow-lg p-3 flex flex-col items-center hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer snap-center ${className}`}
    >
      <img
        src={
          poster_path
            ? `https://image.tmdb.org/t/p/w500/${poster_path}`
            : "/no-movie.png"
        }
        alt={title}
        className="rounded-lg w-full object-cover mb-3 shadow-md"
      />
      <div className="w-full flex flex-col gap-2">
        <h3 className="text-white font-semibold text-lg truncate text-center">
          {title}
        </h3>
        <div className="flex items-center justify-center gap-2 text-sm text-gray-300">
          <div className="flex items-center gap-1">
            <img src="/star.svg" alt="star" className="w-4 h-4" />
            <span className="font-bold text-white">
              {vote_average.toFixed(1)}
            </span>
          </div>
          <span>•</span>
          <span>{release_date ? release_date.split("-")[0] : "N/A"}</span>
          <span>•</span>
          <span>
            {original_language ? original_language.toUpperCase() : "N/A"}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
