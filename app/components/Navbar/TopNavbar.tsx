import { Link } from '@remix-run/react'
import PopoverWrapper from './Popover'
import styled from 'styled-components'
import { NavWrapper } from '~/styles/styles'
import SearchBar from './SearchBar'

export default function TopNavbar({ url }: {url?:string}) {
  return (
    <NavWrapper>
      <LogoHeader>
        <Link to={`/?wl=${url}`}>The Movie App</Link>
      </LogoHeader>
      <SearchBar />
      <div>
        <Link to={`/wishlist/${url}`}>Wishlist</Link>
        <PopoverWrapper />
      </div>
    </NavWrapper>
  )
}

const LogoHeader = styled.h1`
  font-family: 'Nunito Sans', sans-serif;
`
