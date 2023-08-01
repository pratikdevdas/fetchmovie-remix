import { Link } from '@remix-run/react'
import PopoverWrapper from './Popover'
import styled from 'styled-components'
import { NavWrapper } from '~/styles/styles'
import SearchBar from './SearchBar'

export default function TopNavbar() {
  return (
    <NavWrapper>
      <LogoHeader>
        <Link to="/">The Movie App</Link>
      </LogoHeader>
      <SearchBar />
      <div>
        <Link to="/wishlist/afa">Wishlist</Link>
        <PopoverWrapper />
      </div>
    </NavWrapper>
  )
}

const LogoHeader = styled.h1`
  font-family: 'Nunito Sans', sans-serif;
`
