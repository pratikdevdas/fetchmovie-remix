import type { LoaderFunction } from '@remix-run/node'
import { json, redirect, type LoaderArgs } from '@remix-run/node'
import {
  useLoaderData,
  useNavigation,
  useOutletContext,
} from '@remix-run/react'
import TopNavbar from '~/components/Navbar/TopNavbar'
import { HomeContainer, MovieCardWrapper } from '~/styles/styles'
import type { Movie } from './_index'
import styled from 'styled-components'
import { MovieItem, type WishlistId } from '~/components/Movies/MovieItem'
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
  const wishlist: WishlistData[] = await getWishlist(wl)
  if (movieId) {
    const movieTrailerId = await getTrailer(Number(movieId))
    return json({ q, movies: movies.results, movieTrailerId, wishlist })
  }
  return json({ q, movies: movies.results, wishlist })
}

const Search = () => {
  const { movies,q } = useLoaderData<typeof loader>()
  const navigation = useNavigation()
  const { wishlistId, secretWishlistId } = useOutletContext<WishlistId>()

  console.log(wishlistId, secretWishlistId)
  return (
    <div>
      <HomeContainer>
        <TopNavbar query={q} focus={true} url={wishlistId} secUrl={secretWishlistId} />
        <SearchContainer>
          <span color="red">
            { navigation.state === 'submitting'
              ? 'searching...'
              : null}
          </span>
          <MovieCardWrapper>
            {movies.map((m: Movie) => (
              <MovieItem
                m={m}
                key={m.id}
                source='search'
                q={q}
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

