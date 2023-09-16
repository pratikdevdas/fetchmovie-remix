import {
  useFetcher,
  useLoaderData,
  useNavigate,
  useSearchParams
} from '@remix-run/react'
import { useEffect, useState } from 'react'
import type { Movie, loader } from '~/routes/_index'
import styled from 'styled-components'
import MoviesInfiniteScroll from './InfiniteScroller'
import { v4 as uuidv4 } from 'uuid'
import { MovieItem } from './MovieItem'
import { MovieCardWrapper } from '~/styles/styles'

const wishlistIdGenerate = uuidv4()
const secretIdGenerate = uuidv4()

export default function MovieList() {
  const { movies, page } = useLoaderData<typeof loader>()
  const fetcher = useFetcher<typeof loader>()
  const [search] = useSearchParams()
  const genreId = search.get('with_genres') || 'none'
  const [renderMovies, setRenderMovies] = useState<Movie[]>(movies)
  const [wishlistId, setWishlistId] = useState(wishlistIdGenerate)
  const [secretId, setSecretId] = useState(secretIdGenerate)
  const [newPage, setNewPage] = useState(0)
  const navigate = useNavigate()

  // console.log(wishlist, '-----------30')

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

  useEffect(() => {
    const existingSession = window.localStorage.getItem('localUserWishlistData')
    if (existingSession) {
      const existingSessionJSON = JSON.parse(existingSession)
      setWishlistId(existingSessionJSON.wishlistId)
      setSecretId(existingSessionJSON.secretId)
      navigate(
        `/?wl=${existingSessionJSON.wishlistId}&sid=${existingSessionJSON.secretId}`
      )
    } else {
      navigate('/')
    }
  }, [])

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
              wishlistId={wishlistId}
              secretId={secretId}
              genreId={genreId}
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
