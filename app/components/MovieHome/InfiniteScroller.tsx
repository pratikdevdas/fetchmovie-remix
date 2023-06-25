import { useEffect, useRef, type ReactNode } from 'react'
const InfiniteScroll = (props: {
  children: ReactNode
  loading: boolean
  loadNext: () => void
}) => {
  const { children, loading, loadNext } = props

  const scrollRef = useRef(loadNext)

  useEffect(() => {
    scrollRef.current = loadNext
  }, [loadNext])

  const onScroll = () => {
    const scroll = Math.floor(window.innerHeight + window.scrollY)
    const documentHeight = document.documentElement.scrollHeight
    // adding a scroll buffer of -1 px
    const scrollEnds =
      scroll === documentHeight ||
      scroll === documentHeight - 1 ||
      Math.floor(scroll / 2) === Math.floor(documentHeight / 2)

    if (scrollEnds && !loading) {
      scrollRef.current()
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', onScroll)
    }
    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  })
  return <div>{children}</div>
}

export default InfiniteScroll
