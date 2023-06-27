import { Link } from '@remix-run/react'
import PopoverWrapper from './Popover'
import styled from 'styled-components'
import { NavWrapper } from '~/styles/styles'

export default function TopNavbar() {
  return (
    <NavWrapper>
      <LogoHeader>
        <Link to="/">The Movie App</Link>
      </LogoHeader>
      <LogoHeader>sf</LogoHeader>
      <PopoverWrapper />
    </NavWrapper>
  )
}

const LogoHeader = styled.h1`
  font-family: 'Nunito Sans', sans-serif;
`
