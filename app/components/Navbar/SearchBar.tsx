import { styled } from 'styled-components'
const SearchBar = () => {
  return (
    <Container>
      <InputBar placeholder="Search" type="search" />
      <Image src="/search.svg" alt="search-icon" srcSet="" />
    </Container>
  )
}

export default SearchBar

const Container = styled.div`
  position: relative;
`
const InputBar = styled.input`
  border-radius: 15px;
  height: 3rem;
  width: 300px;
  padding: 16px;
  box-sizing: border-box;
  border-radius: 15px;
  letter-spacing: .50px;
  background: var(--gray-dark-2, #0e0e0e);
  backdrop-filter: blur(21.5px);
`

const Image = styled.img`
  position: absolute;
  right: 19.53px;
  top: 15px;
  bottom: 15px;
`
