import * as Dialog from '@radix-ui/react-dialog'
import { Cross2Icon } from '@radix-ui/react-icons'
import WatchTrailer from '../Button/WatchTrailer'
import {
  useFetcher,
  useLoaderData,
  useNavigation,
  useSearchParams
} from '@remix-run/react'
import { useEffect, useState } from 'react'

const TrailerModal = ({ movieId }: { movieId: number }) => {
  const [search] = useSearchParams()
  const fetcher = useFetcher()
  const { movieTrailerId } = useLoaderData()
  const [final, setFinal] = useState()
  const navigate = useNavigation()
  console.log(navigate.state)
  useEffect(() => {
    if (!fetcher.data) {
      fetcher.load(`?&movieId=${movieId}`)
      setFinal(fetcher.data)
    }
  }, [search])

  // console.log(final)
  // console.log(fetcher.data?.movieTrailerId)
  // const [trailer, setTrailer] = useState(null)

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <WatchTrailer />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="DialogOverlay" />
        <Dialog.Content className="DialogContent">
          <Dialog.Title className="DialogTitle">Edit profile</Dialog.Title>
          {movieId}
          {navigate.state === 'loading' ? (
            <></>
          ) : (
            <>
              <iframe
                src={`https://www.youtube.com/embed/${movieTrailerId}`}
                frameBorder="0"
                allow="autoplay; encrypted-media"
                title="video"
              />

              {movieTrailerId}
            </>
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
            <button className="IconButton" aria-label="Close">
              <Cross2Icon />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default TrailerModal
