import { Link } from '@remix-run/react'
import styled from 'styled-components'
import { NavWrapper } from '~/styles/styles'
import SearchBar from './SearchBar'

export default function TopNavbar({
  url,
  secUrl
}: {
  url?: string
  secUrl?: string
}) {
  return (
    <NavWrapper>
      <LogoHeader>
        <Link to={`/?wl=${url}&sid=${secUrl}`}>The Movie App</Link>
      </LogoHeader>
      <SearchBar />
      <div>
        {url && <>editMode</>}
        <Link to={`/wishlist/${secUrl}/${url}/admin`}>Wishlist</Link>
      </div>
    </NavWrapper>
  )
}

const LogoHeader = styled.h1`
  font-family: 'Nunito Sans', sans-serif;
`
