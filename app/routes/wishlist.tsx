import TopNavbar from '~/components/Navbar/TopNavbar'
import { HomeContainer, NavContainer } from '~/styles/styles'
import { Redis } from '@upstash/redis'

const loaderAllFeatures =async () => {
	const redis = Redis.fromEnv()
	// above line automatically fetches env
	console.log(redis)
}

loaderAllFeatures()

const wishlist = () => {
  return (
    <HomeContainer>
      <NavContainer></NavContainer>
      <TopNavbar />
    </HomeContainer>
  )
}

export default wishlist
