/* eslint-disable react/display-name */
import styled from 'styled-components'
import * as Popover from '@radix-ui/react-popover'
import { PersonIcon } from '@radix-ui/react-icons'
export default function PopoverWrapper() {
  return (
    <Popover.Root>
      <PopoverTrigger>
        <PersonIcon />
      </PopoverTrigger>
      <Popover.Portal>
        <PopoverContent align="end">
          <div>Login With google</div>
          <div>About Us</div>
          <Popover.Arrow />
        </PopoverContent>
      </Popover.Portal>
    </Popover.Root>
  )
}

const PopoverContent = styled(Popover.Content)`
  border-radius: 10px;
  padding: 15px;
  width: 260px;
  background-color: hsla(0, 0%, 100%, 0.15);
  box-shadow: hsl(206 22% 7% / 35%) 0px 10px 38px -10px,
    hsl(206 22% 7% / 20%) 0px 10px 20px -15px;
  animation-duration: 400ms;
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);

  will-change: transform, opacity;
`

const PopoverTrigger = styled(Popover.Trigger)`
  font-family: inherit;
  border-radius: 100%;
  height: 35px;
  width: 35px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: white;
  background-color: hsla(0, 0%, 100%, 0.15);
  cursor: pointer;
  border: none;
`
