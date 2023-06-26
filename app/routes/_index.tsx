import type { LoaderArgs } from '@remix-run/node'
import { type V2_MetaFunction } from '@remix-run/node'
import { styled } from 'styled-components'
import Navbar from '~/components/Navbar/Navbar'
import MovieList from '~/components/MovieHome/MovieList'
import styles from '../styles/styles.css'

export const meta: V2_MetaFunction = () => {
  return [
    { title: 'The Movie App' },
    { name: 'description', content: 'Welcome to Remix!' }
  ]
}

export const links = () => {
  return [
    {
      rel: 'stylesheet',
      href: styles
    }
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
interface TrailerFetch{
  type: string
  official: boolean
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

const getMovieList = async (page: number, genre?: number) => {
  try {
    const url = genre
      ? `https://api.themoviedb.org/3/discover/movie?&certification_country=US&certification.lte=PG-13&language=en-US&page=${page}&with_genres=${genre}`
      : `https://api.themoviedb.org/3/discover/movie?&certification_country=US&certification.lte=PG-13&language=en-US&page=${page}`
    const response = await fetch(url, options)
    const movies = await response.json()
    return movies
  } catch (error) {
    console.log(error)
  }
}

const getTrailer = async (trailer: number) => {
  try {
    console.log(trailer, 'das')
    const url = `https://api.themoviedb.org/3/movie/${trailer}/videos`
    const response = await fetch(url, options)
    const movieTrailer = await response.json()
    const findTrailer = movieTrailer.results.find(
      (t:TrailerFetch) => t.type === 'Trailer' && t.official === true
    )
    console.log(findTrailer, 'fje')
    // console.log(movieTrailer,'')
    return findTrailer ? findTrailer.key : []
  } catch (error) {
    console.log(error)
  }
}
export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url)
  console.log(url, 'url')
  const page = url.searchParams.get('page') || 1
  const genre = url.searchParams.get('with_genres')
  const movieId = url.searchParams.get('movieId')
  console.log(movieId, 'movieId')
  const genres: Genres[] = await getMovieGenreList()
  const movies: Movies = await getMovieList(Number(page), Number(genre))
  if (movieId) {
    const movieTrailerId = await getTrailer(Number(movieId))
    console.log(movieTrailerId)
    return {
      genres,
      movies: movies.results,
      page: Number(page),
      movieTrailerId
    }
  }
  return { genres, movies: movies.results, page: Number(page) }
}

export default function Index() {
  return (
    <Home>
      <Navbar />
      <MovieList />
    </Home>
  )
}

const Home = styled.div`
  max-width: 1280px;
  margin: 0 auto;
`
