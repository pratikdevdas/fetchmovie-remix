import TopNavbar from '~/components/Navbar/TopNavbar'
import { HomeContainer, NavContainer } from '~/styles/styles'
import { Redis } from '@upstash/redis'
import { Link, useLoaderData, useParams } from '@remix-run/react'
import Button from '~/components/Button/Button'
import type { Movie } from './_index'
import {
  json,
  type ActionFunction,
  type LoaderFunction,
  redirect,
  fetch
} from '@remix-run/node'
import styled from 'styled-components'
import { uniq } from 'lodash'
import { useEffect, useState } from 'react'
import ShareModal from '~/components/Wishlist/ShareModal'
import styles from '../styles/styles.css'
import { TrashIcon } from '@radix-ui/react-icons'

export const getWishlist = async (id: string) => {
  try {
    const redis = Redis.fromEnv()
    const data = await redis.json.get(`wishlist${id}`, '$')
    // console.log(data,'stop re')
    return data
  }
  catch(error){
    return console.log(error)
  }
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
  if (!params.wid) {
    return json({ err: 'Invalid Id for some reason' })
  }
  const wishlist: WishlistData[] = await getWishlist(params.wid)

  if (!wishlist) {
    return json({ status: 'no wishlist' })
  }

  const url = 'https://api.themoviedb.org/3/movie'
  const movieList = uniq(wishlist[0].movies)

  // const fetchPromises = movieList.map
  const movieDetailList = movieList.map((n) => {
    const singleMovieUrl = `${url}/${n}`
    return fetch(singleMovieUrl, options)
  })
  try {
    const responses = await Promise.all(movieDetailList)
    const dataArray = await Promise.all(
      responses.map((response) => response.json())
    )
    return { movies: dataArray }
  } catch (error) {
    console.log(error)
    return { movies: [] }
  }
}

export const action: ActionFunction = async ({ request, params }) => {
  const redis = Redis.fromEnv()
  const formData = await request.formData()
  const values = Object.fromEntries(formData)
  const data = await redis.json.get(`wishlist${values.wishlistId}`, '$')
  if (!values.movieId) {
    // This isn't currently displayed in our component
    return json({ error: 'Please provide a feature' })
  }

  if (values.actionWishlist === 'create') {
    // console.log(data, '40')
    if (!data) {
      await redis.json.set(`wishlist${values.wishlistId}`, '$', {
        secretId: values.secretId,
        movies: []
      })
      await redis.json.arrappend(
        `wishlist${values.wishlistId}`,
        '$.movies',
        values.movieId
      )
      console.log(values)
      return redirect(
        `/${values.source}?${values.q ? `q=${values.q}` : 'index'}&wl=${values.wishlistId}&sid=${values.secretId}&with_genres=${values.genreId}`
      )
    } else {
      await redis.json.arrappend(
        `wishlist${values.wishlistId}`,
        '$.movies',
        values.movieId
      )
      return redirect(
        `/${values.source}?${values.q ? `q=${values.q}` : 'index'}&wl=${values.wishlistId}&sid=${values.secretId}&with_genres=${values.genreId}`
      )
    }
  }

  if (values.actionWishlist === 'delete') {
    await redis.json.arrpop(
      `wishlist${values.wishlistId}`,
      '$.movies',
      data[0].movies.indexOf(Number(values.movieId))
    )
    return redirect(
      `/${values.source}?${values.q ? `q=${values.q}` : 'index'}&wl=${values.wishlistId}&sid=${values.secretId}&with_genres=${values.genreId}`
    )
  }
  return json({ error: 'Some Error Happened' })
}

export const links = () => {
  return [
    {
      rel: 'stylesheet',
      href: styles
    }
  ]
}

const Wishlist = () => {
  const { movies } = useLoaderData<typeof loader>()
  const [edit, setEdit] = useState(false)
  const params = useParams()

  useEffect(() => {
    if (params.sid && params.uid) {
      localStorage.setItem(
        'localUserWishlistData',
        JSON.stringify({ wishlistId: params.wid, secretId: params.sid })
      )
    }
  }, [params])

  if (!movies) {
    return (
      <HomeContainer>
        <NavContainer>
          {/* <TopNavbar /> */}
          <TableWrapper> NothingHere</TableWrapper>
        </NavContainer>
      </HomeContainer>
    )
  }

  return (
    <HomeContainer>
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
            <RTableCell className="head">
              <ButtonContainer>
                {edit && <Button>
                  Add a Movie
                </Button>}
                <Button onClick={() => setEdit(!edit)}>
                  {edit ? 'Cancel' : 'Edit'}
                </Button>
                <Button light="true">
                  <ShareModal />
                </Button>
              </ButtonContainer>
            </RTableCell>
          </RtableRowHeader>

          <RtableRowTitle>
            <RTableCell className="column-heading name">Name</RTableCell>
            <RTableCell className="column-heading rating">Rating</RTableCell>
            <RTableCell className="column-heading release">Release</RTableCell>
            {edit && (
              <RTableCell className="column-heading delete">Delete</RTableCell>
            )}
          </RtableRowTitle>

          {movies.map((movie: Movie, index: number) => (
            <RtableRow
              key={movie.id}
              className={index % 2 === 0 ? '' : 'is-striped'}
            >
              <RTableCell className="name">
                {/* <div className="Rtable-cell--heading">Name</div> */}
                <Name
                  to={'/movies'}
                  className="Rtable-cell--content date-content"
                >
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
              {edit && (
                <RTableCell className="access-link-cell delete">
                  <div className="Rtable-cell--content access-link-content">
                    <TrashIconHolder />
                  </div>
                </RTableCell>
              )}
            </RtableRow>
          ))}
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
  border-radius: 10px;
`

const RtableRow = styled.div`
  width: 100%;
  display: flex;
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
    width: 25%;
  }
  &.release {
    width: 25%;
  }
  &.delete {
    width: 10%;
  }
  &.head {
    justify-content: end;
  }
`
const ButtonContainer = styled.div`
  display: flex;
  justify-content: end;
  gap: 10px;
`

const TableHeader = styled.div`
  h3 {
    font-size: 20px;
  }
  p {
    font-size: 14px;
  }
`

const Name = styled(Link)`
  display: flex;
  align-items: center;
  /* margin-right: 10px; */

  & img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin: 0px 10px;
  }
`

const TrashIconHolder = styled(TrashIcon)`
 width:24px;
 height: 24px;
 cursor:pointer;
`