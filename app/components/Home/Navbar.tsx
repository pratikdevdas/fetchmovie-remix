import styled from 'styled-components'

export default function Navbar() {
  return (
    <NavContainer>
      <NavWrapper>
        <div></div>
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
  display: flex;
`
