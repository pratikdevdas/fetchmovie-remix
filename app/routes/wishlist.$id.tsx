import TopNavbar from '~/components/Navbar/TopNavbar'
import { HomeContainer, NavContainer } from '~/styles/styles'
import { Redis } from '@upstash/redis'
import { useLoaderData } from '@remix-run/react'
import Button from '~/components/Button/Button'
import {
  json,
  type ActionFunction,
  type LoaderFunction,
  redirect
} from '@remix-run/node'
import styled from 'styled-components'

type LoaderData = {
  features: Array<[string, boolean]>
}

export const getWishlist = async () => {
  const redis = Redis.fromEnv()
  const data = await redis.json.get('wishlist', '$')
  console.log(data, '14')
  return data
}

export type WishlistData = {
  id: string
  movies: number[]
}

export const loader: LoaderFunction = async () => {
  // You would want to add authentication/authorization here
  const wishlist: WishlistData[] = await getWishlist()
  // array of all wishlists
  return { wishlist }
}

export const action: ActionFunction = async ({ request }) => {
  // You would want to add authentication/authorization here
  const redis = Redis.fromEnv()
  const formData = await request.formData()
  console.log(formData)
  const values = Object.fromEntries(formData)
  console.log(values, '43')
  const data = await redis.json.get('wishlist', '$')

  if (!values.movieId) {
    // This isn't currently displayed in our component
    return json({ error: 'Please provide a feature' })
  }

  if (values.actionWishlist === 'create') {
    console.log(data, '40')
    if (!data) {
      console.log('hppend')
      await redis.json.set('wishlist', '$', {
        id: values.secretId,
        movies: []
      })
      await redis.json.arrappend('wishlist', '$.movies', values.movieId)
      return redirect('/')
    } else {
      await redis.json.arrappend('wishlist', '$.movies', values.movieId)
      return redirect('/')
    }
  }

  if (values.actionWishlist === 'delete') {
    console.log(values.movieId, '57')
    await redis.json.arrpop(
      'wishlist',
      '$.movies',
      data[0].movies.indexOf(Number(values.movieId))
    )
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

      <TableWrapper>
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
                <Button light>Share</Button>
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
            <RTableCell className="column-heading watch">Random</RTableCell>
          </RtableRowTitle>

          <RtableRow>
            <RTableCell className="name">
              {/* <div className="Rtable-cell--heading">Name</div> */}
              <div className="Rtable-cell--content date-content">
                The life of pi
              </div>
            </RTableCell>
            <RTableCell className="topic-cell rating">
              <div className="Rtable-cell--content title-content">
                1 2 3 4 5
              </div>
            </RTableCell>
            <RTableCell className="access-link-cell release">
              {/* <div className="Rtable-cell--heading">Access Link</div> */}
              <div className="Rtable-cell--content access-link-content">
                <a href="#0">
                  <i className="ion-link"></i>
                </a>
              </div>
            </RTableCell>
            <RTableCell className="Rtable-cell watch">
              {/* <div className="Rtable-cell--heading">Replay</div> */}
              <div className="Rtable-cell--content replay-link-content">
                <a href="#0">
                  <i className="ion-ios-videocam"></i>
                </a>
              </div>
            </RTableCell>
          </RtableRow>

          <RtableRow className="is-striped">
            <RTableCell className="date-cell name">
              {/* <div className="Rtable-cell--heading">Name</div> */}
              <div className="Rtable-cell--content date-content">
                The life of pi
              </div>
            </RTableCell>
            <RTableCell className="topic-cell rating">
              <div className="Rtable-cell--content title-content">
                1 2 3 4 5
              </div>
            </RTableCell>
            <RTableCell className="access-link-cell release">
              {/* <div className="Rtable-cell--heading">Access Link</div> */}
              <div className="Rtable-cell--content access-link-content">
                <a href="#0">
                  <i className="ion-link"></i>
                </a>
              </div>
            </RTableCell>
            <RTableCell className="Rtable-cell watch">
              {/* <div className="Rtable-cell--heading">Replay</div> */}
              <div className="Rtable-cell--content replay-link-content">
                <a href="#0">
                  <i className="ion-ios-videocam"></i>
                </a>
              </div>
            </RTableCell>
          </RtableRow>
          {/* <div className="Rtable-row is-striped">
            <div className="Rtable-cell date-cell">
              <div className="Rtable-cell--heading">Date</div>
              <div className="Rtable-cell--content date-content"><span className="webinar-date">September 6th, 2016</span><br />6:00 pm (CDT)</div>
            </div>
            <div className="Rtable-cell topic-cell">
              <div className="Rtable-cell--content title-content">Cash Flow Genesis</div>
            </div>
            <div className="Rtable-cell access-link-cell">
              <div className="Rtable-cell--heading">Access Link</div>
              <div className="Rtable-cell--content access-link-content"><a href="#0"><i className="ion-link"></i></a></div>
            </div>
            <div className="Rtable-cell replay-link-cell">
              <div className="Rtable-cell--heading">Replay</div>
              <div className="Rtable-cell--content replay-link-content"><a href="#0"><i className="ion-ios-videocam"></i></a></div>
            </div>
            <div className="Rtable-cell Rtable-cell--foot pdf-cell">
              <div className="Rtable-cell--heading">Checklist</div>
              <div className="Rtable-cell--content pdf-content"><a href="#0"><i className="ion-document-text"></i></a></div>
            </div>
          </div> */}
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
  border-block-start: 1px solid white;
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
  padding-block: 20px;
  background-color: #161616;
  border-radius: 10px 10px 0 0;
`
const RtableRowTitle = styled(RtableRow)`
  padding-block: 0;
  background-color: #000;
  font-weight: 500; 
  font-size: 16px;
`

const RTableCell = styled.div`
  box-sizing: border-box;
  flex-grow: 1;
  padding: 0.8em 1.2em;
  overflow: hidden; // Or flex might break
  list-style: none;

  &.name {
    width: 30%;
  }

  &.rating {
    width: 20%;
  }
  &.release {
    width: 30%;
  }
  &.watch {
    width: 20%;
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