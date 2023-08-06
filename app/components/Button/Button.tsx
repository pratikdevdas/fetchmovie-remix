import type React from 'react'
import styled from 'styled-components'

export default function Button(props: {
  light?: boolean | string
  children: React.ReactNode
}) {
  console.log(props)
  return <StyledButton {...props}>{props.children}</StyledButton>
}

const StyledButton = styled.button<{ light?: boolean | string }>`
  display: block;
  padding: 8px 15px;
  text-align: center;
  border-radius: 5px;
  border: 1px solid var(--gray-white, #fff);
  background: ${(props) => (props.light ? '#fff' : 'transparent')};
  color: ${(props) => (props.light ? '#000' : '#fff')};
  transition: transform ease-in-out 0.3s;

  &:hover {
    cursor: pointer;
    transform: translateY(2px);
  }
`
