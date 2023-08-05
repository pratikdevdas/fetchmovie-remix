import { useSearchParams } from '@remix-run/react'
import TabCarousel from './TabCarousel'
import TopNavbar from './TopNavbar'
import { NavWrapper, NavContainer } from '~/styles/styles'

export default function Navbar() {
  const [search]= useSearchParams()
  const url = search.get('wl') || 'none'
  const secUrl = search.get('sid') || 'none'
  return (
    <NavContainer>
      <TopNavbar url={url} secUrl={secUrl}/>
      <NavWrapper>
        <TabCarousel url={url} secUrl={secUrl}></TabCarousel>
      </NavWrapper>
    </NavContainer>
  )
}
