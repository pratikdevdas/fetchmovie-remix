import { useNavigate, useSearchParams } from '@remix-run/react'
import TabCarousel from './TabCarousel'
import TopNavbar from './TopNavbar'
import { NavWrapper, NavContainer } from '~/styles/styles'
import { useDebounce } from '~/hooks/useDebounce'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const [search] = useSearchParams()
  const url = search.get('wl') || ''
  const secUrl = search.get('sid') || ''

  const [query, setQuery] = useState(search.get('q') || '')
  const [debouncedQuery] = useDebounce(query, 1000)
  const navigate = useNavigate()

  useEffect(() => {
    if (debouncedQuery) {
      navigate(`/search?q=${debouncedQuery}`)
    }
  }, [debouncedQuery, navigate])
  return (
    <NavContainer>
      <TopNavbar url={url} secUrl={secUrl} query={query} setQuery={setQuery} />
      <NavWrapper>
        <TabCarousel url={url} secUrl={secUrl}></TabCarousel>
      </NavWrapper>
    </NavContainer>
  )
}
