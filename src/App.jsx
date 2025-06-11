import React, { useEffect, useState } from 'react'
import Search from './components/Search'
import Spinner from './components/Spinner'
import MovieCard from './components/MovieCard'

const API_KEY = import.meta.env.VITE_MOVIES_API_KEY

const API_URL = "https://api.themoviedb.org/3"

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`
  }
}

const App = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchMovies = async (query, page) => {
    const url = query ? `${API_URL}/search/movie?query=${query}&page=${page}` : `${API_URL}/discover/movie?sort_by=popularity.desc&page=${page}`
    setLoading(true)
    try {
      const response = await fetch(url, API_OPTIONS)
      if(!response.ok){
        throw new Error("Failed to fetch movies")
      }

      const data = await response.json()
      console.log(data)
      
      if (data.Response === "False"){
        setErrorMessage(data.Error)
        setMovies([])
        return
      }

      setMovies(data.results)
      setTotalPages(data.total_pages)
    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage("Something went wrong. Please try again later.");
    }finally{
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMovies(searchTerm, page)
  }, [searchTerm, page])


  return (
    <div>
      <main>
        <div className="pattern"></div>
        <div className="wrapper">
          <header>
            <img src="./hero.png" alt="hero-banner" />
            <h1>Find <span className='text-gradient'>Movies</span>You'll Enjoy Without the Hassle</h1>
          </header>

          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

          <section className='all-movies'>
            <h2>All Movies</h2>
            {loading ? (
              <Spinner />
            ) : (
              errorMessage ? (
                <p className='text-red-600'>{errorMessage}</p>
              ) : (
                movies.length > 0 ? (
                  <>
                  <ul className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                    {movies.map((movie) => (
                      <MovieCard key={movie.id} movie={movie} />
                    ))}
                  </ul>
                  <div className='flex items-center justify-end gap-2 mt-4'>
                    <button className='bg-white text-black px-4 py-2 rounded-md' onClick={() => setPage(page - 1)} disabled={page === 1}>{page}</button>
                    <button className='bg-white text-black px-4 py-2 rounded-md' onClick={() => setPage((prev) => prev + 1)} >{page + 1}</button>
                    <button className='bg-white text-black px-4 py-2 rounded-md' onClick={() => setPage((prev) => prev + 2)} >{page + 2}</button>
                    <button className='bg-white text-black px-4 py-2 rounded-md' onClick={() => setPage((prev) => prev + 3)} >{page + 3}</button>
                    {totalPages < 4 && (
                      <>
                      <span className=' text-white px-4 py-2 rounded-md'>...</span>
                      <button className='bg-white text-black px-4 py-2 rounded-md' onClick={() => setPage((prev) => prev = totalPages)} disabled={page === totalPages}>{totalPages - 1}</button>
                      </>
                    )}
                  </div>
                    </>
                  ) : (
                  <p>No movies found</p>
                )
              )
            )}
          </section>
        </div>
      </main>
    </div>
  )
}

export default App