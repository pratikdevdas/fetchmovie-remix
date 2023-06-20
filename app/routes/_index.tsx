import type { LoaderArgs } from '@remix-run/node'
import { type V2_MetaFunction } from '@remix-run/node'
import { styled } from 'styled-components'
import Navbar from '~/components/Navbar/Navbar'
import MovieList from '~/components/MovieHome/MovieList'

export const meta: V2_MetaFunction = () => {
  return [
    { title: 'The Movie App' },
    { name: 'description', content: 'Welcome to Remix!' }
  ]
}

export interface Genres {
  id: number
  name: string
}
export interface Movie {
  id: number | string
  title: string
  poster_path: string
  backdrop_path: string
  overview: string
  vote_average: number
}
export interface Movies {
  page: number
  results: Movie[]
}

const genreUrl = 'https://api.themoviedb.org/3/genre/movie/list?language=en'

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

const getMovieList = async (page: number) => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/discover/movie?language=en-US&page=${page}`,
      options
    )
    const movies = await response.json()
    return movies
  } catch (error) {
    console.log(error)
  }
}
export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url)
  const page = url.searchParams.get('page') || 1

  const genres: Genres[] = await getMovieGenreList()
  const movies: Movies = await getMovieList(Number(page))
  console.log('^&(&(*&(*&')
  return { genres, movies: movies.results, page: Number(page) }
}

export default function Index() {
  return (
    <Home>
      <Navbar />
      <MovieList />

      {/* put a loader based on fetch state */}
    </Home>
  )
}

const Home = styled.div`
  max-width: 1280px;
  margin: 0 auto;
`
