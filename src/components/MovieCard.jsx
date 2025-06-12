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
      className={`movie-card hover:scale-105 transition-all duration-300 cursor-pointer snap-center ${className}`}
    >
      <img
        src={
          poster_path
            ? `https://image.tmdb.org/t/p/w500/${poster_path}`
            : "/no-movie.png"
        }
        alt={title}
      />
      <div className="mt-4">
        <h3>{title}</h3>
        <div className="content">
          <div className="rating">
            <img src="/star.svg" alt="star" />
            <p>{vote_average.toFixed(1)}</p>
          </div>
          <span>•</span>
          <p className="text-white">
            {release_date ? release_date.split("-")[0] : "N/A"}
          </p>
          <span>•</span>
          <p className="text-white">
            {original_language ? original_language.toUpperCase() : "N/A"}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
