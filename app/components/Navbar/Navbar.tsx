import { useSearchParams } from '@remix-run/react'
import TabCarousel from './TabCarousel'
import TopNavbar from './TopNavbar'
import { NavWrapper, NavContainer } from '~/styles/styles'

export default function Navbar() {
  const [search]= useSearchParams()
  const url = search.get('wl') || 'none'

  return (
    <NavContainer>
      <TopNavbar url={url}/>
      <NavWrapper>
        <TabCarousel url={url}></TabCarousel>
      </NavWrapper>
    </NavContainer>
  )
}
