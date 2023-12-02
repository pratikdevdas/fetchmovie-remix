import type { LoaderArgs } from '@remix-run/node'
import { type V2_MetaFunction } from '@remix-run/node'
import Navbar from '~/components/Navbar/Navbar'
import MovieList from '~/components/Movies/MovieList'
import styles from '../styles/styles.css'
import { HomeContainer } from '~/styles/styles'
import { getWishlist, type WishlistData } from './wishlist.$sid.$wid.admin'

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
  release_date?: string
}
export interface Movies {
  page: number
  results: Movie[]
}
interface TrailerFetch {
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
    return console.log(error, ' error in fetching genre')
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
    return console.log(error , 'error in fetching movies')
  }
}

export const getTrailer = async (trailer: number) => {
  try {
    const url = `https://api.themoviedb.org/3/movie/${trailer}/videos`
    const response = await fetch(url, options)
    const movieTrailer = await response.json()
    const findTrailer = movieTrailer.results.find(
      (t: TrailerFetch) => t.type === 'Trailer' && t.official === true
    )
    return findTrailer ? findTrailer.key : []
  } catch (error) {
    return console.log(error)
  }
}
export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url)
  // console.log(request.cookies)
  const page = url.searchParams.get('page') || 1
  const genre = url.searchParams.get('with_genres')
  const movieId = url.searchParams.get('movieId')
  const wishlistId = url.searchParams.get('wl')
  const genres: Genres[] = await getMovieGenreList()
  const movies: Movies = await getMovieList(Number(page), Number(genre))
  if(!movies){
    console.log(movies)
    console.log('there is some error while fetching movies')
  }
  if(!genres){
    console.log('there is some error while fetching genre')
  }
  const wishlist: WishlistData[] = await getWishlist(
    wishlistId ? wishlistId : ''
  )
  if (movieId) {
    const movieTrailerId = await getTrailer(Number(movieId))
    return {
      genres,
      movies: movies.results,
      page: Number(page),
      movieTrailerId,
      wishlist
    }
  }
  return { genres, movies: movies.results, page: Number(page), wishlist }
}

export default function Index() {
  return (
    <HomeContainer>
      <Navbar />
      <MovieList />
    </HomeContainer>
  )
}
