import { type V2_MetaFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { styled } from 'styled-components'
import Navbar from '~/components/Navbar/Navbar'

export const meta: V2_MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' }
  ]
}

export interface Genres {
  id: number
  name: string
}
export interface Movie {
  id: number
  original_title: string
  poster_path: string
  backdrop_path: string
}
export interface Movies {
  page: number
  results: Movie[]
}

const genreUrl = 'https://api.themoviedb.org/3/genre/movie/list?language=en'
const moviesUrl =
  'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=true&language=en-US&page=5'
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${process.env.AUTH_TOKEN}`
  }
}

const getMovieGenreList = async () => {
  try {
    const response = await fetch(genreUrl, options)
    const { genres } = await response.json()
    return genres
  } catch (error) {
    console.log(error)
  }
}

const getMovieList = async () => {
  try {
    const response = await fetch(moviesUrl, options)
    const movies = await response.json()
    return movies
  } catch (error) {
    console.log(error)
  }
}
export async function loader() {
  const genres: Genres[] = await getMovieGenreList()
  const movies: Movies = await getMovieList()
  console.log(movies)
  console.log('^&(&(*&(*&')
  return { genres, movies: movies.results }
}

export default function Index() {
  const { movies } = useLoaderData<typeof loader>()
  return (
    <Home className="border">
      <Navbar />
      <MovieCardWrapper>
        {movies.map((m) => (
          <MovieCard key={m.id}>
            <img
              src={`https://image.tmdb.org/t/p/original/${m.poster_path}`}
              alt="img mov"
            />
            <MovieWriteup>
              <h4>{m.original_title}</h4>
            </MovieWriteup>
          </MovieCard>
        ))}
      </MovieCardWrapper>
    </Home>
  )
}

const Home = styled.div`
  max-width: 1280px;
  margin: 0 auto;
`
const MovieCardWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  column-gap: 30px;
  row-gap: 20px;
`

const MovieWriteup = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  background-image: linear-gradient(
      0deg,
      rgba(21, 24, 30, 0.88),
      rgba(21, 24, 30, 0.88)
    ),
    linear-gradient(
      240.05deg,
      rgb(34, 38, 47) 2.21%,
      rgba(34, 38, 47, 0) 43.89%,
      rgb(34, 38, 47) 115.91%
    );
  box-shadow: rgba(0, 0, 0, 0.05) 0px 0.25em 4em;
  color: white;
  border: none;
  width: 100%;
  height: 100%;
  transition: all 0.7s ease-in-out;
  padding: 20px;
  font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida  Grande',
    'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
  font-weight: semi-bold;
  box-sizing: border-box;
  clip-path: circle(10% at 100% 100%);
`

const MovieCard = styled.div`
  background-image: linear-gradient(
      0deg,
      rgba(21, 24, 30, 0.88),
      rgba(21, 24, 30, 0.88)
    ),
    linear-gradient(
      240.05deg,
      rgb(34, 38, 47) 2.21%,
      rgba(34, 38, 47, 0) 43.89%,
      rgb(34, 38, 47) 115.91%
    );
  box-shadow: rgba(0, 0, 0, 0.05) 0px 0.25em 4em;
  cursor: pointer;
  transition: all 0.5s cubic-bezier(0.8, 0.5, 0.2, 1.4);
  overflow: hidden;
  position: relative;
  border-radius: 10px;
  & img {
    width: 100%;
    height: 100%;
    transition: all 0.5s cubic-bezier(0.8, 0.5, 0.2, 1.4);
  }

  &:hover {
    transition: all 0.5s cubic-bezier(0.8, 0.5, 0.2, 1.4);
    box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.3);
    transform: scale(1.05);
    border: 2px solid #15191f;
    & img {
      filter: blur(50px);
    }

    & ${MovieWriteup} {
      /* left: 0px; */
      transition: all 0.7s ease-in-out;
      background-color: #aa3fff;
      clip-path: circle(75%);
    }
  }
`
