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
    const scroll = window.scrollY + window.innerHeight
    const documentHeight = document.documentElement.scrollHeight
    const scrollEnds = Math.floor(scroll) === documentHeight

    console.group('Started scroll debug')
    console.log(scroll, ' = scroll')
    console.log(documentHeight, 'documentHeight;')
    console.log(scrollEnds, 'scrollEnds')
    console.groupEnd('Started scroll debug')

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
