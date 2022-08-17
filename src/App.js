import React, { useState, useEffect, useCallback } from 'react';
import MoviesList from './components/MoviesList';
import AddMovie from './components/AddMovie';
import './App.css';

function App() {
  // 영화 데이터
  const [movies, setMovies] = useState([]);
  // 로딩 여부에 따라 로딩 화면을 조건부렌더링하도록 하는 상태
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // GET 요청만 가능한 open api 대신 데이터베이스 기능을 사용해 POST 요청이 가능한 firebase를 사용해봅니다.
  const fetchMovieHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('https://react-request-practice-52ca0-default-rtdb.firebaseio.com/movies.json');
      // status를 사용하여 요청에 대한 응답이 실패했는 지에 따라 에러 메시지를 생성합니다.
      // 에러에 대한 조건문을 만족하면 이후 try문은 실행되지 않고 catch 문으로 넘어갑니다. (error를 캐치)
      if (!res.status) {
        throw new Error('Error...');
      }

      const data = await res.json();
      // firebase로 받아온 데이터를 콘솔로 확인해보면, 자동 생성된 고유한 name과 입력 데이터가 중첩 객체로 담겨있습니다.
      console.log(data)
      // 따라서 저장된 데이터를 newMovieData로 생성하기 위해서는 name을 기준으로 객체를 순회해 배열에 담습니다.
      const newMovieData = [];

      for (let key in data) {
        newMovieData.push({
          id: key,
          title: data[key].title,
          release: data[key].releaseData,
          openingText: data[key].openingText
        })
      }
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

  // http 요청은 비동기 작업이므로 프라미스를 반환하도록 작업할 수 있습니다.
  async function addMovieHandler(movie) {
    try {
      const res = await fetch('https://react-request-practice-52ca0-default-rtdb.firebaseio.com/movies.json', {
        method: 'POST',
        body: JSON.stringify(movie),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (!res.status) {
        throw new Error('Error...');
      }
      const data = await res.json();
      console.log(data);
      fetchMovieHandler();
    }
    catch (error) {
      setError(error.message);
    }
  }

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
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
