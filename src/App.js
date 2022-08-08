import React, { useState } from 'react';
import MoviesList from './components/MoviesList';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  async function fetchMovieHandler() {
    const res = await fetch('https://swapi.dev/api/films/');
    const data = await res.json();
    // 원하는 속성을 담은 새로운 객체를 반환한다음 state를 변경합니다.
    const newMovieData = data.results.map(movieData => {
      return {
        id: movieData.episode_id,
        title: movieData.title,
        release: movieData.release_date,
        openingText: movieData.opening_crawl
      }
    })
    setMovies(newMovieData)
  }
  // state를 변경하기 전에 원하는 속성들로만 이루어진 객체를 만듭니다

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMovieHandler}>Fetch Movies</button>
      </section>
      <section>
        <MoviesList movies={movies} />
      </section>
    </React.Fragment>
  );
}

export default App;
