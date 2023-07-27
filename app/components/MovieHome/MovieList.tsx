import {
  Link,
  useFetcher,
  useLoaderData,
  useSearchParams
} from '@remix-run/react'
import { useEffect, useState } from 'react'
import type { Movie, loader } from '~/routes/_index'
import styled from 'styled-components'
import MoviesInfiniteScroll from './InfiniteScroller'
import TrailerModal from './TrailerModal'
import { HeartIcon } from '@radix-ui/react-icons'

export default function MovieList() {
  const { movies, page } = useLoaderData<typeof loader>()
  const fetcher = useFetcher<typeof loader>()
  const [search] = useSearchParams()
  const [renderMovies, setRenderMovies] = useState<Movie[]>(movies)
  const genreId = search.get('with_genres')

  useEffect(() => {
    if (!fetcher.data || fetcher.state === 'loading') {
      return
    }
    if (fetcher.data) {
      const newItems = fetcher.data.movies
      setRenderMovies((prevAssets) => [...prevAssets, ...newItems])
    }
  }, [fetcher.data])

  useEffect(() => {
    if (fetcher.data) {
      setRenderMovies([])
      fetcher.load(`?index&with_genres=${genreId}`)
    } else {
      setRenderMovies(movies)
    }
  }, [genreId])

  return (
    <MoviesContainer>
      <MoviesInfiniteScroll
        loadNext={() => {
          const pageToFetch = fetcher.data ? fetcher.data.page + 1 : page + 1
          const query = genreId
            ? `?index&with_genres=${genreId}&page=${pageToFetch}`
            : `?index&page=${pageToFetch}`
          fetcher.load(query)
        }}
        loading={fetcher.state === 'loading'}
      >
        <MovieCardWrapper>
          {renderMovies.map((m) => (
            <MovieCard key={m.id}>
              <img
                src={`https://image.tmdb.org/t/p/w500/${m.poster_path}`}
                alt="img mov"
              />
              <MovieWriteup>
                <h4>
                  <Link to={`movies/${m.id}`}>{m.title}</Link>
                </h4>
                <p>
                  {m.overview.substring(0, 170)}
                  <span> ...readmore </span>
                </p>
                <p>Rating: {m.vote_average}</p>
                <CardBottom>
                  <WatchButton>
                    <Link to={`?index&with_genres=${genreId}&movieId=${m.id}`}>
                      <TrailerModal movieId={Number(m.id)} />
                    </Link>
                  </WatchButton>
                  <WishListButton>
                    <Heart height={20} width={20} />
                  </WishListButton>
                </CardBottom>
              </MovieWriteup>
            </MovieCard>
          ))}
        </MovieCardWrapper>
      </MoviesInfiniteScroll>
      {fetcher.state === 'loading' && <>loading</>}
    </MoviesContainer>
  )
}

const Heart = styled(HeartIcon)`
  font-size: 70px;
`
const MoviesContainer = styled.div`
  color: white;
`
const CardBottom = styled.div`
  display: flex;
  gap: 5px;
  align-items: center;
  justify-content: space-between;
`
const WishListButton = styled.div`
  display: flex;
  align-items: center;
`
const WatchButton = styled.button``
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
  font-weight: semi-bold;
  font-size: 14px;
  box-sizing: border-box;
  clip-path: circle(10% at 100% 100%);
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  & h4 {
    font-size: 18px;
    font-family: 'Nunito Sans', sans-serif;
    font-weight: 700;
    line-height: 28px;
    & a {
      color: white;
      text-decoration: none;
    }
  }

  & p {
    color: #e3e5e8b8;
    padding-block-start: 10px;
    font-weight: lighter;
    flex: 1 1 100%;
  }
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
