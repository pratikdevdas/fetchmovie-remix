import styled from 'styled-components'

export default function WatchTrailer(props: any) {
  return <Button {...props}>Watch Trailer</Button>
}

const Button = styled.button`
  display: inline-flex;
  appearance: none;
  align-items: center;
  justify-content: center;
  user-select: none;
  position: relative;
  white-space: nowrap;
  vertical-align: middle;
  outline: 2px solid transparent;
  outline-offset: 2px;
  line-height: 1.5;
  /* border-radius: var(--chakra-radii-full); */
  font-weight: 500;
  height: auto;
  padding: 4px 8px;
  transition: all 0.3s ease-in-out;
  flex-direction: row;
  box-shadow: 2px 2px 10px rgba(170, 63, 255, 0.8);
  background-color: #ffffff;
  color: rgba(34, 38, 47, 0.9);
  border-radius: 5px;
  /* all: unset; */
  &:hover {
    box-shadow: 2px 2px 16px rgba(170, 63, 255, 0.8);
  }
`
