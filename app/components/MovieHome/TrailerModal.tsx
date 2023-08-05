import * as Dialog from '@radix-ui/react-dialog'
import { Cross2Icon } from '@radix-ui/react-icons'
import WatchTrailer from '../Button/WatchTrailer'
import { Link, useLoaderData, useNavigation } from '@remix-run/react'
import styled from 'styled-components'

const TrailerModal = ({
  movieId,
  genreId,
  wishlistId
}: {
  movieId: number
  genreId: number
  wishlistId?: string
}) => {
  const { movieTrailerId } = useLoaderData()
  const navigate = useNavigation()

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <WatchTrailer />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="DialogOverlay" />
        <ModalContainer className="DialogContent">
          <Dialog.Title className="DialogTitle">Edit profile</Dialog.Title>
          {movieId}
          {navigate.state === 'loading' ? (
            <IFrameContainer />
          ) : (
            <IFrameContainer
              src={`https://www.youtube.com/embed/${movieTrailerId}?autoplay=1`}
              allow="autoplay; encrypted-media"
              title="video"
            ></IFrameContainer>
          )}
          <div
            style={{
              display: 'flex',
              marginTop: 25,
              justifyContent: 'flex-end'
            }}
          >
            <Dialog.Close asChild>
              <button className="Button green">Save changes</button>
            </Dialog.Close>
          </div>
          <Dialog.Close asChild>
            <Link to={`?index&with_genres=${genreId}&wl=${wishlistId}`}>
              <button className="IconButton" aria-label="Close">
                <Cross2Icon />
              </button>
            </Link>
          </Dialog.Close>
        </ModalContainer>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default TrailerModal

const ModalContainer = styled(Dialog.Content)`
  background: #161616;
`
const IFrameContainer = styled.iframe`
  height: 80%;
  width: 100%;
  border-radius: 10px;
`
