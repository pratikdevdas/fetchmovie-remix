import { styled } from 'styled-components'

export type SearchInputProps = {
  query: string
  setQuery: (value: string) => void
  focus?: boolean
}
const SearchBar = ({ query, setQuery, focus }: SearchInputProps) => {
  return (
    <Container>
      <InputBar
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoFocus={focus}
        placeholder="Search for a movie"
        type="text"
      />
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
  letter-spacing: 0.5px;
  background: var(--gray-dark-2, #0e0e0e);
  backdrop-filter: blur(21.5px);
  color: #fff;
  border: none;
  &:focus-visible {
    outline: 1px solid #fff;
  }
`

const Image = styled.img`
  position: absolute;
  right: 19.53px;
  top: 15px;
  bottom: 15px;
`
