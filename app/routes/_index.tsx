import type { V2_MetaFunction } from '@remix-run/node'
import Navbar from '~/components/Navbar/Navbar'
import { json } from '@remix-run/node'

export const meta: V2_MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' }
  ]
}

const getData = async () => {
  const response = await fetch(
    'https://api.themoviedb.org/3/discover/movie?api_key=468d413c44d12876b4f3a40147ab3946&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1'
  )
  return response.json()
}
export const loader = async () => {
  const movies = await getData()
  // Return the data as JSON
  return json({ movies })
}

export default function Index() {
  return (
    <div>
      <Navbar />
    </div>
  )
}
