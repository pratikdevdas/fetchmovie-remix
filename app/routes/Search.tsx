import type { LoaderFunction } from '@remix-run/node'
import { json, type LoaderArgs } from '@remix-run/node'
import { useLoaderData, useNavigate, useNavigation, useSearchParams, useSubmit } from '@remix-run/react'
import { useEffect, useState } from 'react'
import TopNavbar from '~/components/Navbar/TopNavbar'
import { useDebounce } from '~/hooks/useDebounce'
import { HomeContainer } from '~/styles/styles'
import type { Movie } from './_index'
import styled from 'styled-components'

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
	if (!q) {
		json({ q, movies: [] })
	}
	if (!movies.result) {
		return json({ q, movies: [] })
	}
	return json({ q, movies: movies.result })
}

const Search = () => {
	const { q, movies } = useLoaderData<typeof loader>()
	const [query, setQuery] = useState(q)
	const [debouncedQuery, isDebouncing] = useDebounce(query, 500)
	const submit = useSubmit()
	const [searchParams] = useSearchParams()
	const navigation = useNavigation()
	useEffect(() => {
		if (debouncedQuery) {
			searchParams.set('q', debouncedQuery)
		} else {
			searchParams.delete('q')
		}
		console.log(searchParams)
		// this submit sets the value
		submit(searchParams)
	}, [debouncedQuery])

	// const [search] = useSearchParams()
	// console.log(search)

	return (
  <div>
    <HomeContainer>
      <TopNavbar query={query} setQuery={setQuery} isDebouncing />
      <SearchContainer>

        <span color='red'>
          {isDebouncing || navigation.state === 'loading'
							? 'searching...'
							: null}
        </span>
        {movies.map((n: Movie) => <li key={n.id}>
          {n.title}
        </li>)}
      </SearchContainer>
    </HomeContainer>
  </div>
	)
}

export default Search

const SearchContainer = styled.div`
	color: white;
`