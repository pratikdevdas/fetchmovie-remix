import TopNavbar from '~/components/Navbar/TopNavbar'
import { NavContainer, HomeContainer } from '~/styles/styles'

export default function Movie() {
  return (
    <HomeContainer>
      <NavContainer>
        <TopNavbar />
      </NavContainer>
    </HomeContainer>
  )
}
