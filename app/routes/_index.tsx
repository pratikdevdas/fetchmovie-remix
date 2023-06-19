import { useEffect, useRef, useState } from 'react'
import type { LoaderArgs } from '@remix-run/node'
import { type V2_MetaFunction } from '@remix-run/node'
import { useFetcher, useLoaderData } from '@remix-run/react'
import { styled } from 'styled-components'
import Navbar from '~/components/Navbar/Navbar'

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
  return { genres, movies: movies.results, page : Number(page) }
}

const MoviesInfiniteScroll = (props: {
  children: any
  loading: boolean
  loadNext: () => void
}) => {
  const { children, loading, loadNext } = props

  const scrollRef = useRef(loadNext)

  useEffect(() => {
    scrollRef.current = loadNext
  }, [loadNext])
  const onScroll = () => {
    const scroll = window.scrollY + window.innerHeight
    const documentHeight = document.documentElement.scrollHeight
    const scrollEnds = scroll === documentHeight

    if (scrollEnds && !loading) {
      scrollRef.current()
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', onScroll)
    }
    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  })
  return <div>{children}</div>
}

export default function Index() {
  const { movies, page } = useLoaderData<typeof loader>()
  const fetcher = useFetcher<typeof loader>()
  console.log(movies)
  const [renderMovies, setRenderMovies] = useState<Movie[]>(movies)
  console.log(fetcher)

  console.log(page)
  useEffect(() => {
    if (!fetcher.data || fetcher.state === 'loading') {
      return
    }

    if (fetcher.data) {
      const newItems = fetcher.data.movies
      setRenderMovies((prevAssets) => [...prevAssets, ...newItems])
    }
  }, [fetcher.data])

  return (
    <Home className="border">
      <Navbar />
      <MoviesInfiniteScroll
        loadNext={() => {
          const pageToFetch = fetcher.data ? fetcher.data.page + 1 : page + 1
          const query = `?index&page=${pageToFetch}`
          fetcher.load(query)
        }}
        loading={fetcher.state === 'loading'}
      >
        <MovieCardWrapper>
          {renderMovies.map((m) => (
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
      </MoviesInfiniteScroll>
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
