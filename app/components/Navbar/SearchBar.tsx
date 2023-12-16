import { MagnifyingGlassIcon, UpdateIcon } from '@radix-ui/react-icons'
import { Form, useNavigation, useSubmit } from '@remix-run/react'
import { keyframes, styled } from 'styled-components'

export type SearchInputProps = {
  query: string
  setQuery: (value: string) => void
  focus?: boolean
  url?: string
  secUrl?: string
}
const SearchBar = ({ query, url, secUrl }: SearchInputProps) => {


  const navigation = useNavigation()
  const submit = useSubmit()

  const searching =  navigation.location &&
  new URLSearchParams(navigation.location.search).has(
    'q'
  )

  console.log()
  return (
    <Container>
      <Form onChange={(e) => submit(e.currentTarget, {
        action: '/search',
      })}
      >
        <InputBar
          defaultValue={query}
          placeholder="Search for a movie"
          type="text"
          name="q"
        />
        {secUrl && url && <>
          <input type="text" hidden name='wl' value={url}/>
          <input type="text" hidden name='sid' value={secUrl}/>
        </>
        }
        <IconContainer>
          {searching && navigation.state === 'loading' ? <SearchRoll/> : <MagnifyingGlassIcon/>}
        </IconContainer>

      </Form>
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
  background: var(--gray-dark-2, #495057);
  backdrop-filter: blur(21.5px);
  color: #fff;
  border: none;
  &:focus-visible {
    outline: 1px solid #fff;
  }
`

const IconContainer= styled.div`
  position: absolute;
  right: 19.53px;
  top: 15px;
  bottom: 15px;
`


const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`


const SearchRoll = styled(UpdateIcon)`
animation: ${rotate} 1s linear infinite;
`