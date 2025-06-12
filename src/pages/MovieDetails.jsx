import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const MovieDetails = () => {
  const { id } = useParams();
  const API_KEY = import.meta.env.VITE_MOVIES_API_KEY;
  const API_URL = "https://api.themoviedb.org/3";
  const API_OPTIONS = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
  };

  const [movie, setMovie] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMovieDetails = async (movieId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `${API_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=videos`,
        API_OPTIONS
      );
      if (!response.ok) {
        throw new Error("Failed to fetch movie details");
      }
      const data = await response.json();
      setMovie(data);
      // Find trailer from videos
      if (data.videos && data.videos.results) {
        const trailer = data.videos.results.find(
          (vid) => vid.type === "Trailer" && vid.site === "YouTube"
        );
        setTrailerKey(trailer ? trailer.key : null);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchMovieDetails(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!movie) return <div>No movie found.</div>;

  return (
    <div className="flex flex-col gap-6 p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">
        {movie.title}
      </h1>
      {/* Trailer Block */}
      <div className="w-full aspect-video mb-2">
        {trailerKey ? (
          <iframe
            src={`https://www.youtube.com/embed/${trailerKey}`}
            title="Movie Trailer"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full rounded-lg"
          ></iframe>
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gray-800 rounded-lg text-white">
            No trailer available
          </div>
        )}
      </div>
      {/* Responsive Layout: mobile = stacked, md+ = side-by-side */}
      <div className="flex flex-col md:flex-row md:items-start md:gap-8 w-full">
        {movie.poster_path && (
          <div className="w-full flex justify-center md:w-auto md:justify-start mb-4 md:mb-0">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="rounded-lg shadow-lg w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg md:w-72"
              loading="lazy"
            />
          </div>
        )}
        <ul className="flex flex-col gap-3 bg-primary p-5 opacity-90 rounded-lg shadow-lg text-white w-full md:w-auto">
          <li>
            <p className="truncate max-w-xs mb-2">
              <strong>Original Title:</strong> {movie.original_title}
            </p>
          </li>
          <li>
            <strong>Release Date:</strong> {movie.release_date}
          </li>
          <li>
            <strong>Rating:</strong> {movie.vote_average} / 10
          </li>
          <li>
            <strong>Overview:</strong>
            <span className="block mt-1 text-gray-200 whitespace-pre-line">
              {movie.overview}
            </span>
          </li>
          <li>
            <strong>Genres:</strong>{" "}
            {movie.genres.map((genre) => genre.name).join(", ")}
          </li>
          <li>
            <strong>Runtime:</strong> {movie.runtime} minutes
          </li>
          <li>
            <strong>Language:</strong> {movie.original_language.toUpperCase()}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default MovieDetails;
