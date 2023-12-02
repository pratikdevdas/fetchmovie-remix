import type { LoaderFunction } from '@remix-run/node'
import { json, type LoaderArgs } from '@remix-run/node'
import {
  useLoaderData,
  useNavigate,
  useNavigation,
  useSearchParams
} from '@remix-run/react'
import { useLayoutEffect, useState } from 'react'
import TopNavbar from '~/components/Navbar/TopNavbar'
import { useDebounce } from '~/hooks/useDebounce'
import { HomeContainer, MovieCardWrapper } from '~/styles/styles'
import type { Movie } from './_index'
import styled from 'styled-components'
import { MovieItem } from '~/components/Movies/MovieItem'
import styles from '../styles/styles.css'
import { getTrailer } from './_index'
import type { WishlistData } from './wishlist.$sid.$wid.admin'
import { getWishlist } from './wishlist.$sid.$wid.admin'

export const links = () => {
  return [
    {
      rel: 'stylesheet',
      href: styles
    }
  ]
}

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${process.env.AUTH_TOKEN}`
  }
}

const getEntriesByQuerystring = async (q: string) => {
  const url = `https://api.themoviedb.org/3/search/movie?query=${q}`
  const response = await fetch(url, options)
  const res = await response.json()
  return res
}

export const loader: LoaderFunction = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url)
  const { q, movieId, wl } = Object.fromEntries(url.searchParams)
  const movies = await getEntriesByQuerystring(q)
  const wishlist: WishlistData[] = await getWishlist(
    wl
  )
  if (!q) {
    json({ q, movies: [] })
  }
  if (movieId) {
    const movieTrailerId = await getTrailer(Number(movieId))
    return json({ q, movies: movies.results, movieTrailerId, wishlist })
  }
  return json({ q, movies: movies.results, wishlist })
}

const Search = () => {
  const { movies } = useLoaderData<typeof loader>()
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q'))
  const [debouncedQuery, isDebouncing] = useDebounce(query, 300)
  const { movieTrailerId } = useLoaderData()

  const navigation = useNavigation()
  const navigate = useNavigate()
  useLayoutEffect(() => {
    const existingSession = window.localStorage.getItem('localUserWishlistData')
    if (debouncedQuery && !existingSession) {
      setSearchParams({ q: debouncedQuery, movieId: movieTrailerId })
    }
    else if (debouncedQuery && existingSession) {
      const existingSessionJSON = JSON.parse(existingSession)
      setSearchParams({ q: debouncedQuery, wl: existingSessionJSON.wishlistId, sid: existingSessionJSON.secretId, movieId: movieTrailerId })
    }
    else {
      navigate('/')
    }
  }, [debouncedQuery])

  const secUrl = searchParams.get('sid')
  const url = searchParams.get('wl')
  return (
    <div>
      <HomeContainer>
        <TopNavbar query={query} setQuery={setQuery} focus={true} url={url} secUrl={secUrl} />
        <SearchContainer>
          <span color="red">
            {isDebouncing || navigation.state === 'submitting'
              ? 'searching...'
              : null}
          </span>
          <MovieCardWrapper>
            {movies.map((m: Movie) => (
              <MovieItem
                m={m}
                key={m.id}
                wishlistId={url || ''}
                secretId={secUrl || ''}
                source='search'
                q={query}
              />
            ))}
          </MovieCardWrapper>
        </SearchContainer>
      </HomeContainer>
    </div>
  )
}

export default Search

const SearchContainer = styled.div`
  color: white;
  z-index: -1;
`

