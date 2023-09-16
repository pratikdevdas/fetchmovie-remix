import styled from 'styled-components'

export const NavContainer = styled.div`
  width: 100%;
`

export const NavWrapper = styled.div`
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
`

// Homepage
export const HomeContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
`

// card wrapper
export const MovieCardWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  column-gap: 30px;
  row-gap: 20px;
`
