import type { LoaderFunction } from '@remix-run/node'
import { json, type LoaderArgs } from '@remix-run/node'
import {
  useLoaderData,
  useNavigate,
  useNavigation,
  useSearchParams
} from '@remix-run/react'
import { useEffect, useState } from 'react'
import TopNavbar from '~/components/Navbar/TopNavbar'
import { useDebounce } from '~/hooks/useDebounce'
import { HomeContainer, MovieCardWrapper } from '~/styles/styles'
import type { Movie } from './_index'
import styled from 'styled-components'
import { MovieItem } from '~/components/Movies/MovieItem'

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
  const { q } = Object.fromEntries(url.searchParams)
  const movies = await getEntriesByQuerystring(q)
  console.log(q, 'q')
  console.log(movies.results)
  if (!q) {
    json({ q, movies: [] })
  }
  return json({ q, movies: movies.results })
}

const Search = () => {
  const { movies } = useLoaderData<typeof loader>()
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q'))
  const [debouncedQuery, isDebouncing] = useDebounce(query, 300)

  const navigation = useNavigation()
  const navigate = useNavigate()
  useEffect(() => {
    const existingSession = window.localStorage.getItem('localUserWishlistData')
    if (debouncedQuery && !existingSession) {
      setSearchParams({ q: debouncedQuery })
    }
      else if(debouncedQuery && existingSession){
      const existingSessionJSON = JSON.parse(existingSession)
      setSearchParams({ q: debouncedQuery, wid: existingSessionJSON.wishlistId, sid: existingSessionJSON.secretId })
    } else {
      navigate('/')
    }
  }, [debouncedQuery, setSearchParams])

 const secUrl =  searchParams.get('sid')
 const url =  searchParams.get('wid')
  return (
    <div>
      <HomeContainer>
        <TopNavbar query={query} setQuery={setQuery} focus={true} url={url} secUrl={secUrl} />
        <SearchContainer>
          <span color="red">
            {isDebouncing || navigation.state === 'loading'
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
`
