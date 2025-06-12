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
    <div className="flex flex-col items-start justify-start p-4">
      <h1>{movie.title}</h1>
      <div className="w-full h-[600px] mb-4">
        {trailerKey ? (
          <iframe
            src={`https://www.youtube.com/embed/${trailerKey}`}
            title="Movie Trailer"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full  h-full rounded-lg"
          ></iframe>
        ) : (
          <p>No trailer available</p>
        )}
      </div>
      <div className="flex items-center justify-between h-full">
        {movie.poster_path && (
          <img
            src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
            alt={movie.title}
            className="rounded-lg shadow-lg"
            loading="lazy"
          />
        )}
        <ul className="max-w-5xl flex flex-col space-y-3 bg-primary p-5 h-[450px] opacity-90 rounded-lg shadow-lg text-white">
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
            <strong>Overview:</strong> {movie.overview}
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
