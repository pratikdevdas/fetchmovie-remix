import * as Dialog from '@radix-ui/react-dialog'
import { useLocation, useParams } from '@remix-run/react'
import styled from 'styled-components'

const ShareModal = () => {

  const params = useParams()
  console.log(params)
  const baseUrl = 'https://fetchmovie-remix.vercel.app'
  const location = useLocation()
  const adminLink = `${baseUrl}${location.pathname}`
  const viewLink = `${baseUrl}/wishlist/${params.wid}/view`
  console.log(location)
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button> share</button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="DialogOverlay" />
        <ModalContainer className="DialogContent wishlist">
          <ShareTitle>Share Wishlist</ShareTitle>
          <LinkContainer>
            <p>
              Share this to let people see your wishlist
            </p>
            <LinkWrapper>
              <p>
                {viewLink}
              </p>
            </LinkWrapper>
          </LinkContainer>
          <LinkContainer>
            <p>
              Keep this link with you to edit the wishlist in future (Do not share)
            </p>
            <LinkWrapper>
              <p>
                {adminLink}
              </p>
            </LinkWrapper>
          </LinkContainer>
          <div
            style={{
              display: 'flex',
              marginTop: 25,
              justifyContent: 'flex-end'
            }}
          >
            <Dialog.Close asChild>
              <button className="Button green">Close</button>
            </Dialog.Close>
          </div>
          <Dialog.Close asChild></Dialog.Close>
        </ModalContainer>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default ShareModal

const ModalContainer = styled(Dialog.Content)`
  background: #161616;
  display: flex;
  flex-direction: column;
    justify-content: space-between;
  &.wishlist{
    padding: 56px;
  }
`

const ShareTitle = styled(Dialog.Title)`
  color: white;
  font-size: 32px;
  font-weight: 500;
  font-family: 'Roboto', sans-serif;
  `

const LinkContainer = styled.div`
 background-color: #0A0A0A;
 padding: 36px 0;
 width: full;
 color: #fff;
 display: flex;
 justify-content: center;
 flex-direction: column;
 align-items: stretch;
 text-align: center;
 border-radius: 16px;
 & p{
   opacity: 0.7;
 }
`
const LinkWrapper = styled.div`
 border-radius: 8px;
width: full;
text-align: center;
padding: 1px;
margin: 5px 36px;
background: linear-gradient(to right, red, purple);
& p{
  border-radius: 8px;
  padding: 6px 6px;
  background: linear-gradient(180deg, #000 0%, rgba(0, 0, 0, 0.57) 100%);
  
}
`