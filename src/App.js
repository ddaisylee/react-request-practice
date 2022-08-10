import React, { useState, useEffect, useCallback } from 'react';
import MoviesList from './components/MoviesList';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMovieHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('https://swapi.dev/api/films/');
      // status를 사용하여 요청에 대한 응답이 실패했는 지에 따라 에러 메시지를 생성합니다.
      // 에러에 대한 조건문을 만족하면 이후 try문은 실행되지 않고 catch 문으로 넘어갑니다. (error를 캐치)
      if (!res.status) {
        throw new Error('Error...');
      }
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
      setMovies(newMovieData);
    }
    catch (error) {
      setError(error.message);
    }
    // 응답 성공 또는 실패에 따라 각각의 결과를 화면에 보여주어야 하기 때문에, 
    // 맨 마지막에 isLoading 상태를 false로 바꾸어 loading indicator가 보이지 않게 합니다.
    setIsLoading(false);
  }, [])

  useEffect(() => {
    fetchMovieHandler();
  }, [fetchMovieHandler])

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMovieHandler}>Fetch Movies</button>
      </section>
      <section>
        {!isLoading && <MoviesList movies={movies} />}
        {!isLoading && movies.length === 0 && !error && <p>Found no movies</p>}
        {isLoading && <p>Loading...</p>}
        {!isLoading && error && <p>{error}</p>}
      </section>
    </React.Fragment>
  );
}

export default App;
