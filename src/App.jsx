import { useEffect, useState } from "react";
import Banner from "./components/Banner";
import Header from "./components/Header";
import MovieList from "./components/MovieList";
import MovieSearch from "./components/MovieSearch";
import { MovieProvider } from "./context/MovieDetailContext";

function App() {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [searchData, setSearchData] = useState([]);

  const API_KEY = import.meta.env.VITE_API_KEY;

  const handleSearch = async (value) => {
    if (value === "") return setSearchData([]);
    
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${value}&include_adult=false&language=vi&page=1`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      setSearchData(data.results || []);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  useEffect(() => {
    (async function () {
      const urls = [
        `https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}&language=vi`,
        `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=vi`,
      ];

      const fetchMovies = async (url) => {
        const response = await fetch(url);
        return response.json();
      };

      try {
        const response = await Promise.all(urls.map(fetchMovies));
        setTrendingMovies(response[0].results || []);
        setTopRatedMovies(response[1].results || []);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    })();
  }, [API_KEY]);

  return (
    <MovieProvider>
      <div className="h-full bg-black text-white min-h-screen pb-10 relative">
        <Header onSearch={handleSearch} />
        <Banner />
        {searchData.length === 0 && (
          <MovieList title="Phim Hot" data={trendingMovies.slice(0, 10)} />
        )}
        {searchData.length === 0 && (
          <MovieList title="Phim đề cử" data={topRatedMovies.slice(0, 10)} />
        )}
        {searchData.length > 0 && <MovieSearch data={searchData} />}
      </div>
    </MovieProvider>
  );
}

export default App;