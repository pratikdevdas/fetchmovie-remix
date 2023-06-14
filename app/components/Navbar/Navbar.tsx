import styled from 'styled-components'
import PopoverWrapper from './Popover'
export default function Navbar() {
  return (
    <NavContainer>
      <NavWrapper>
        <LogoHeader>ds</LogoHeader>
        <LogoHeader>sf</LogoHeader>
        <PopoverWrapper />
      </NavWrapper>
    </NavContainer>
  )
}

const NavContainer = styled.div`
  width: 100%;
  background-color: #0c102c;
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

const LogoHeader = styled.h1``
