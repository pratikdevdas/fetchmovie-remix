import TopNavbar from '~/components/Navbar/TopNavbar'
import { HomeContainer, NavContainer } from '~/styles/styles'
import { Redis } from '@upstash/redis'
import { useLoaderData } from '@remix-run/react'
import { json, type ActionFunction, type LoaderFunction, redirect } from '@remix-run/node'

type LoaderData = {
	features: Array<[string, boolean]>;
  };

	export const getWishlist = async () => {
	const redis = Redis.fromEnv()
	const data = await redis.json.get('wishlist', '$')
	console.log(data,'14')
	return data
  }

  export type WishlistData = {
	id: string
	movies: number[]
  }

  export const loader:LoaderFunction = async () => {
	// You would want to add authentication/authorization here
	const wishlist:WishlistData[] = await getWishlist()
	// array of all wishlists
	return { wishlist }
  }

  export const action: ActionFunction = async ({ request }) => {
	// You would want to add authentication/authorization here
	const redis = Redis.fromEnv()
	const formData = await request.formData()
	console.log(formData)
	const values = Object.fromEntries(formData)
		console.log(values, '33')
	const data = await redis.json.get('wishlist', '$')

	if (!values.movieId) {
	  // This isn't currently displayed in our component
	  return json({ error: 'Please provide a feature' })
	}

	 if (values.actionWishlist === 'create'){
		console.log(data, '40')
		if(!data){
			console.log('hppend')
			await redis.json.set('wishlist', '$', { id: 'fakeWishlistID', movies:[] } )
			await redis.json.arrappend('wishlist', '$.movies', values.movieId  )
			return redirect('/')
		}else{
			await redis.json.arrappend('wishlist', '$.movies', values.movieId  )
			return redirect('/')
		}
	 }

	 if (values.actionWishlist === 'delete'){
		console.log(values.movieId,'57')
		await redis.json.arrpop('wishlist', '$.movies', data[0].movies.indexOf(Number(values.movieId)) )
	 }
	//
	// console.log(showData,'36')
	return redirect('/')
  }

const Wishlist = () => {
	const wishlist = useLoaderData<LoaderData>()
	console.log(wishlist)
  return (
    <HomeContainer>
      <NavContainer></NavContainer>
      <TopNavbar />

    </HomeContainer>
  )
}

export default Wishlist
