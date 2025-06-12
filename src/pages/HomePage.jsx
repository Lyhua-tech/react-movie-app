import React, { useEffect, useState } from "react";
import Search from "../components/Search";
import Spinner from "../components/Spinner";
import MovieCard from "../components/MovieCard";
import { Link } from "react-router-dom";
import { useDebounce } from "@reactuses/core";

const API_KEY = import.meta.env.VITE_MOVIES_API_KEY;

const API_URL = "https://api.themoviedb.org/3";

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [movies, setMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [useDebounceSearch, setUseDebounceSearch] = useState("");

  useDebounce(
    () => {
      setUseDebounceSearch(searchTerm);
    },
    500,
    [searchTerm]
  );

  const fetchMovies = async (query, page) => {
    const url = query
      ? `${API_URL}/search/movie?query=${query}&page=${page}&include_adult=false`
      : `${API_URL}/discover/movie?sort_by=popularity.desc&page=${page}&include_adult=false`;
    setLoading(true);
    try {
      const response = await fetch(url, API_OPTIONS);
      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }

      const data = await response.json();

      if (data.Response === "False") {
        setErrorMessage(data.Error);
        setMovies([]);
        return;
      }

      setMovies(data.results);
      setTotalPages(data.total_pages);
    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchTopRatedMovies = async (page) => {
    const url = `${API_URL}/discover/movie?sort_by=vote_count.desc&page=${page}&limit=10&include_adult=false`;
    setLoading(true);
    try {
      const response = await fetch(url, API_OPTIONS);
      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }

      const data = await response.json();
      setTopRatedMovies(data.results);
    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(useDebounceSearch, page);
    fetchTopRatedMovies(page);
  }, [useDebounceSearch, page]);

  return (
    <div>
      <main>
        <div className="pattern"></div>
        <div className="wrapper">
          <header>
            <img src="./hero.png" alt="hero-banner" />
            <h1>
              Find <span className="text-gradient">Movies</span>You'll Enjoy
              Without the Hassle
            </h1>
          </header>

          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

          <section className="all-movies">
            {loading ? (
              <Spinner />
            ) : errorMessage ? (
              <p className="text-red-600">{errorMessage}</p>
            ) : topRatedMovies.length > 0 && searchTerm === "" ? (
              <>
                <h2 className="text-2xl font-bold mt-4">Top Rated Movies</h2>
                <ul className="flex overflow-x-scroll gap-4 snap-x snap-mandatory scroll-smooth scrollbar-hide w-full">
                  {topRatedMovies.map((movie) => (
                    <li
                      key={movie.id}
                      className="shrink-0 w-3/4 xs:w-2/3 sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 2xl:w-1/6 snap-start"
                    >
                      <MovieCard movie={movie} className="w-full h-full" />
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p>No movies found</p>
            )}

            <h2>All Movies</h2>
            {loading ? (
              <Spinner />
            ) : errorMessage ? (
              <p className="text-red-600">{errorMessage}</p>
            ) : movies.length > 0 ? (
              <>
                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {movies
                    .filter((movie) => movie.adult === false)
                    .map((movie) => (
                      <MovieCard movie={movie} key={movie.id} />
                    ))}
                </ul>
                <div className="flex items-center justify-center gap-2 mt-4">
                  <button
                    className="bg-white text-black px-4 py-2 rounded-full"
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                  >
                    Prev
                  </button>
                  {/* Pagination numbers with dynamic window */}
                  <button
                    className={`px-3 py-2 rounded-full ${
                      page === 1
                        ? "bg-indigo-600 text-white"
                        : "bg-white text-black"
                    }`}
                    onClick={() => setPage(1)}
                  >
                    1
                  </button>
                  {page > 4 && <span className="text-white">...</span>}
                  {(() => {
                    // Calculate start and end for the window
                    let start = Math.max(2, page);
                    let end = Math.min(start + 3, totalPages - 1);
                    if (end - start < 3) {
                      start = Math.max(2, end - 3);
                    }
                    const nums = [];
                    for (let i = start; i <= end; i++) {
                      nums.push(i);
                    }
                    return nums.map((num) => (
                      <button
                        key={num}
                        className={`px-3 py-2 rounded-full ${
                          page === num
                            ? "bg-indigo-600 text-white"
                            : "bg-white text-black"
                        }`}
                        onClick={() => setPage(num)}
                      >
                        {num}
                      </button>
                    ));
                  })()}
                  {page < totalPages - 3 && totalPages > 5 && (
                    <span className="text-white">...</span>
                  )}
                  {totalPages > 1 && (
                    <button
                      className={`px-3 py-2 rounded-full ${
                        page === totalPages
                          ? "bg-indigo-600 text-white"
                          : "bg-white text-black"
                      }`}
                      onClick={() => setPage(totalPages)}
                    >
                      {totalPages}
                    </button>
                  )}
                  <button
                    className="bg-white text-black px-4 py-2 rounded-full"
                    onClick={() =>
                      setPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={page === totalPages}
                  >
                    Next
                  </button>
                </div>
              </>
            ) : (
              <p>No movies found</p>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
