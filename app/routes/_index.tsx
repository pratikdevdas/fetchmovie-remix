import { type V2_MetaFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
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
  original_title:string
}
export interface Movies {
  page: number
  results:Movie[]
}


const genreUrl = 'https://api.themoviedb.org/3/genre/movie/list?language=en'
const moviesUrl =
  'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc'
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
    <div className="border">
      <Navbar />
      {movies.map((g) => (
        <div key={g.id}>{g.original_title}</div>
      ))}
    </div>
  )
}
