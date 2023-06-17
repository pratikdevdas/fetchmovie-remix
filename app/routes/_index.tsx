import { json, type V2_MetaFunction } from '@remix-run/node'
import Navbar from '~/components/Navbar/Navbar'

export const meta: V2_MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' }
  ]
}

interface Genres {
  id: number
  name: string
}

const url = 'https://api.themoviedb.org/3/genre/movie/list?language=en'
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${process.env.AUTH_TOKEN}`
  }
}

const getData = async () => {
  try {
    const response = await fetch(url, options)
    const { genres } = await response.json()
    return genres
  } catch (error) {
    console.log(error)
  }
}

export async function loader() {
  const genres: Genres[] = await getData()
  return json(genres)
}

export default function Index() {
  return (
    <div className="border">
      <Navbar />
    </div>
  )
}
