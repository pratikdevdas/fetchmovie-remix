import TopNavbar from '~/components/Navbar/TopNavbar'
import { HomeContainer, NavContainer } from '~/styles/styles'
import { Redis } from '@upstash/redis'
import { Form, Link, useLoaderData, useParams } from '@remix-run/react'
import Button from '~/components/Button/Button'
import {
  json,
  type ActionFunction,
  type LoaderFunction,
  redirect,
  fetch
} from '@remix-run/node'
import styled from 'styled-components'
import { uniq } from 'lodash'
// import { createClient } from '@supabase/supabase-js'
// import { type Movie } from './_index.tsx'

export const getWishlist = async (id: string) => {
  const redis = Redis.fromEnv()
  const data = await redis.json.get(`wishlist${id}`, '$')
  console.log(data)
  return data
}

export type WishlistData = {
  id: string
  movies: number[]
}

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${process.env.AUTH_TOKEN}`
  }
}
export const loader: LoaderFunction = async ({ request, params }) => {
  console.log(request)
  if (!params.wid) {
    return json({ err: 'Invalid Id for some reason' })
  }
  console.log(params, '31')
  const wishlist: WishlistData[] = await getWishlist(params.wid)

  if (!wishlist) {
    return json({ status: 'no wishlist' })
  }

  const url = 'https://api.themoviedb.org/3/movie'
  const movieList = uniq(wishlist[0].movies)
  const movieDetailList = await Promise.all(movieList.map(async (n) => {
    const singleMovieUrl = `${url}/${n}`
    const res = await fetch(singleMovieUrl, options)
    const res2 = await res.json()
    return res2
  }))

  return { movies: movieDetailList }
}

export const action: ActionFunction = async ({ request, params }) => {
  // You would want to add authentication/authorization here
  // const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
  //   auth: { persistSession: false },
  // })

  const redis = Redis.fromEnv()
  const formData = await request.formData()
  console.log(formData)
  const values = Object.fromEntries(formData)
  const data = await redis.json.get(`wishlist${values.wishlistId}`, '$')
  if (!values.movieId) {
    // This isn't currently displayed in our component
    return json({ error: 'Please provide a feature' })
  }

  if (values.actionWishlist === 'create') {
    // console.log(data, '40')
    if (!data) {
      console.log('hppend')
      await redis.json.set(`wishlist${values.wishlistId}`, '$', {
        secretId: values.secretId,
        movies: []
      })
      await redis.json.arrappend(`wishlist${values.wishlistId}`, '$.movies', values.movieId)
      return redirect(`/?index&wl=${values.wishlistId}&sid=${values.secretId}&with_genres=${values.genreId}`)
    } else {
      await redis.json.arrappend(`wishlist${values.wishlistId}`, '$.movies', values.movieId)
      return redirect(`/?index&wl=${values.wishlistId}&sid=${values.secretId}&with_genres=${values.genreId}`)
    }
  }

  if (values.actionWishlist === 'delete') {
    await redis.json.arrpop(
      `wishlist${values.wishlistId}`,
      '$.movies',
      data[0].movies.indexOf(Number(values.movieId))
    )
    return redirect(`/?index&wl=${values.wishlistId}&sid=${values.secretId}&with_genres=${values.genreId}`)
  }
  return json({ error: 'Some Error Happened' })
}

const Wishlist = () => {
  const { movies } = useLoaderData<typeof loader>()

  const params = useParams()
  if (!movies) {
    return <HomeContainer>
      <NavContainer>
        <TopNavbar />
        <TableWrapper> NothingHere</TableWrapper>
      </NavContainer>
    </HomeContainer>
  }

  return (
    <HomeContainer>
      <NavContainer></NavContainer>
      <TopNavbar url={params.id?.toString()} />
      <TableWrapper>
        {/* {movies.map(m => <li key={m}>{m}</li>)} */}
        <Rtable className="Rtable Rtable--5cols Rtable--collapse">
          <RtableRowHeader>
            <RTableCell className="column-heading name">
              <TableHeader>
                <h3>Watchlist</h3>
                <p>Here is a lovely watchlist</p>
              </TableHeader>
            </RTableCell>
            <RTableCell className="column-heading buttons">
              <ButtonContainer>
                <Button>Edit</Button>
                <Form> <Button light="true"> Share </Button></Form>
              </ButtonContainer>
            </RTableCell>
          </RtableRowHeader>

          <RtableRowTitle>
            <RTableCell className="column-heading name">
              Name
            </RTableCell>
            <RTableCell className="column-heading rating">
              Rating
            </RTableCell>
            <RTableCell className="column-heading release">
              Release
            </RTableCell>
          </RtableRowTitle>


          {movies.map((movie: any, index:number) => (<RtableRow key={movie.id} className={index % 2 === 0 ? '' : 'is-striped'}>
            <RTableCell className="name">
              {/* <div className="Rtable-cell--heading">Name</div> */}
              <Name to={`/movies/${movie.id}`} className="Rtable-cell--content date-content" >
                <img
                  src={`https://image.tmdb.org/t/p/w200/${movie.poster_path}`}
                  alt="img mov"
                  loading="lazy"
                />
                {movie.title}
              </Name>
            </RTableCell>
            <RTableCell className="topic-cell rating">
              <div className="Rtable-cell--content title-content">
                {movie.vote_average}
              </div>
            </RTableCell>
            <RTableCell className="access-link-cell release">
              {/* <div className="Rtable-cell--heading">Access Link</div> */}
              <div className="Rtable-cell--content access-link-content">
                <a href="#0">
                  <i className="ion-link">{movie.release_date}</i>
                </a>
              </div>
            </RTableCell>
          </RtableRow>))}
        </Rtable>
      </TableWrapper>
    </HomeContainer>
  )
}

export default Wishlist


const TableWrapper = styled.div`
  width: 100%;
  max-width: 1280px;
  margin: 10px auto;
  padding: 1em;
  /* background-color: red; */
  color: #d9d9d9;
  font-size: 14px;
  font-weight: 400px;
`

const Rtable = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 0 0 3em 0;
  padding: 0;
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.2);
  border-inline: 1px solid white;
  border-block-start: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 10px;
`

const RtableRow = styled.div`
  width: 100%;
  display: flex;
  border-block-end: 1px solid white;
  padding-block: 20px;
  background-color: #0a0a0a;

  &.is-striped {
    background-color: #161616;
  }
  &:last-child {
    border-radius: 0 0 10px 10px;
  }
`

const RtableRowHeader = styled(RtableRow)`
  padding: 20px;
  background-color: #161616;
  border-radius: 10px 10px 0 0;
`
const RtableRowTitle = styled(RtableRow)`
  padding-block: 0;
  background-color: #000;
  font-weight: 500; 
  font-size: 16px;
  padding: 0.8em 1.2em;
`

const RTableCell = styled.div`
  box-sizing: border-box;
  flex-grow: 1;
  overflow: hidden; // Or flex might break
  list-style: none;
  height: 100%;
  display: flex;
align-items: center;
  &.name {
    width: 40%;
  }

  &.rating {
    width: 30%;
  }
  &.release {
    width: 30%;
  }
`
const ButtonContainer = styled.div`
  display: flex;
  justify-content: end;
  gap:10px;
`

const TableHeader = styled.div`
h3{
 font-size: 20px;
}
p{
  font-size: 14px;
}
`

const Name = styled(Link)`
  display: flex;
  align-items: center;
  /* margin-right: 10px; */

  & img{
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin: 0px 10px;
  }
`