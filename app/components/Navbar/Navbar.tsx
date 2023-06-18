import styled from 'styled-components'
import PopoverWrapper from './Popover'
import TabCarousel from './TabCarousel'

export default function Navbar() {
  return (
    <NavContainer>
      <NavWrapper>
        <LogoHeader>The Movie App</LogoHeader>
        <LogoHeader>sf</LogoHeader>
        <PopoverWrapper />
      </NavWrapper>
      <NavWrapper>
        <TabCarousel></TabCarousel>
      </NavWrapper>
    </NavContainer>
  )
}

const NavContainer = styled.div`
  width: 100%;
`

const NavWrapper = styled.div`
  max-width: 1280px;
  height: 72px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
  color: white;
`

const LogoHeader = styled.h1`
  font-family: 'Nunito Sans', sans-serif;
`
