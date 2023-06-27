import TabCarousel from './TabCarousel'
import TopNavbar from './TopNavbar'
import { NavWrapper, NavContainer } from '~/styles/styles'
export default function Navbar() {
  return (
    <NavContainer>
      <TopNavbar />
      <NavWrapper>
        <TabCarousel></TabCarousel>
      </NavWrapper>
    </NavContainer>
  )
}
