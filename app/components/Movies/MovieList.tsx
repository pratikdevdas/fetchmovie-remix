import {
  useFetcher,
  useLoaderData,
  useSearchParams
} from '@remix-run/react'
import { useState, useEffect } from 'react'
import type { Movie, loader } from '~/routes/_index'
import styled from 'styled-components'
import MoviesInfiniteScroll from './InfiniteScroller'
import { MovieItem } from './MovieItem'
import { MovieCardWrapper } from '~/styles/styles'


export default function MovieList() {
  const { movies, page } = useLoaderData<typeof loader>()
  const fetcher = useFetcher<typeof loader>()
  const [search] = useSearchParams()
  const genreId = search.get('with_genres') || 'none'
  const [renderMovies, setRenderMovies] = useState<Movie[]>(movies)
  const [newPage, setNewPage] = useState(0)

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
          const pageToFetch = fetcher.data
            ? fetcher.data.page + 1
            : newPage
              ? newPage + 1
              : page + 1
          setNewPage(pageToFetch)
          const query = genreId
            ? `?index&with_genres=${genreId}&page=${pageToFetch}`
            : `?index&page=${pageToFetch}`
          fetcher.load(query)
        }}
        loading={fetcher.state === 'loading'}
      >
        <MovieCardWrapper>
          {renderMovies.map((m) => (
            <MovieItem
              m={m}
              key={m.id}
              genreId={genreId}
              source=''
            />
          ))}
          {fetcher.state === 'loading' && <> </>}
        </MovieCardWrapper>
      </MoviesInfiniteScroll>
    </MoviesContainer>
  )
}

const MoviesContainer = styled.div`
  color: white;
`
