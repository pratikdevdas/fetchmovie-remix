/* eslint-disable react/display-name */
import styled from 'styled-components'
import * as Popover from '@radix-ui/react-popover'

export default function PopoverWrapper() {
  return (
    <Popover.Root>
      <PopoverTrigger/>
      <Popover.Portal>
        <PopoverContent>
          sd
          gfd
          <Popover.Close />
          <Popover.Arrow />
        </PopoverContent>
      </Popover.Portal>
    </Popover.Root>
  )
}

const PopoverContent = styled(Popover.Content)`
  border-radius: 4px;
  padding: 20px;
  width: 260px;
  background-color: white;
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
  color: var(--violet11);
  background-color: white;
  box-shadow: 0 2px 10px var(--blackA7);
`