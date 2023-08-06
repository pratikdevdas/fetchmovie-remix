import {
  Link,
  useFetcher,
  useLoaderData,
  useNavigate,
  useSearchParams
} from '@remix-run/react'
import { useEffect, useState } from 'react'
import type { Movie, loader } from '~/routes/_index'
import styled from 'styled-components'
import MoviesInfiniteScroll from './InfiniteScroller'
import TrailerModal from './TrailerModal'
import { HeartIcon, HeartFilledIcon } from '@radix-ui/react-icons'
import { v4 as uuidv4 } from 'uuid'

const wishlistIdGenerate = uuidv4()
const secretIdGenerate = uuidv4()

export default function MovieList() {
  const { movies, page, wishlist } = useLoaderData<typeof loader>()
  const fetcher = useFetcher<typeof loader>()
  const [search] = useSearchParams()
  const genreId = search.get('with_genres') || 'none'
  const [renderMovies, setRenderMovies] = useState<Movie[]>(movies)
  const [wishlistId, setWishlistId] = useState(wishlistIdGenerate)
  const [secretId, setSecretId] = useState(secretIdGenerate)
  const [newPage, setNewPage] = useState(0)
  const navigate = useNavigate()

  // console.log(wishlist, '-----------30')

  useEffect(() => {
    if (!fetcher.data || fetcher.state === 'loading') {
      return
    }
    if (fetcher.data) {
      const newItems = fetcher.data.movies
      console.log(newItems)
      console.log(fetcher.data)
      setRenderMovies((prevAssets) => [...prevAssets, ...newItems])
    }
  }, [fetcher.data])

  useEffect(() => {
    if (fetcher.data) {
      setRenderMovies([])
      fetcher.load(`?index&with_genres=${genreId}`)
    } else {
      setRenderMovies(movies)
    }
  }, [genreId])

  useEffect(() => {
    const existingSession = window.localStorage.getItem('localUserWishlistData')
    if (existingSession) {
      const existingSessionJSON = JSON.parse(existingSession)
      setWishlistId(existingSessionJSON.wishlistId)
      setSecretId(existingSessionJSON.secretId)
      navigate(
        `/?wl=${existingSessionJSON.wishlistId}&sid=${existingSessionJSON.secretId}`
      )
    } else {
      navigate('/')
    }
  }, [])

  return (
    <MoviesContainer>
      <MoviesInfiniteScroll
        loadNext={() => {
          const pageToFetch = fetcher.data
            ? fetcher.data.page + 1
            : newPage
            ? newPage + 1
            : page + 1
          setNewPage(pageToFetch)
          const query = genreId
            ? `?index&with_genres=${genreId}&page=${pageToFetch}`
            : `?index&page=${pageToFetch}`
          fetcher.load(query)
        }}
        loading={fetcher.state === 'loading'}
      >
        <MovieCardWrapper>
          {renderMovies.map((m) => (
            <MovieItem
              m={m}
              key={m.id}
              wishlistId={wishlistId}
              secretId={secretId}
              genreId={genreId}
            />
          ))}
          {fetcher.state === 'loading' && <> </>}
        </MovieCardWrapper>
      </MoviesInfiniteScroll>
    </MoviesContainer>
  )
}

const MovieItem = ({
  m,
  wishlistId,
  secretId,
  genreId
}: {
  m: Movie
  wishlistId: string
  secretId: string
  genreId: string
}) => {
  const fetcher = useFetcher<typeof loader>()
  const { wishlist } = useLoaderData()
  // wislist doesnt come on first reload so wait for it to come literally you  are giving some time to the effect to load data from localstorage first
  // const [wMovies, setWMovies] = useState(wishlist ? wishlist?.[0]?.movies : [])
  // console.log(wishlist?.[0]?.movies)

  const isWishlisting =
    Number(fetcher.formData?.get('movieId')) === m.id ||
    fetcher.state === 'submitting'
    console.log(fetcher)

  const handleSubmit = () => {
    window.localStorage.setItem(
      'localUserWishlistData',
      JSON.stringify({ wishlistId, secretId })
    )
  }

  // if(wishlist)
  return (
    <MovieCard key={m.id}>
      <img
        src={`https://image.tmdb.org/t/p/w500/${m.poster_path}`}
        alt="img mov"
        loading="lazy"
      />
      <MovieWriteup>
        <h4>
          <Link to={`movies/${m.id}`}>{m.title}</Link>
        </h4>
        <p>
          {m.overview.substring(0, 170)}
          <span> {m.id}</span>
        </p>
        <p>Rating: {m.vote_average}</p>
        <CardBottom>
          <WatchButton>
            <Link
              to={`?index&with_genres=${genreId}&movieId=${m.id}&wl=${wishlistId}`}
            >
              <TrailerModal
                movieId={Number(m.id)}
                genreId={Number(genreId)}
                wishlistId={wishlistId}
              />
            </Link>
          </WatchButton>
          <fetcher.Form
            method="post"
            action={`/wishlist/${wishlistId}/${secretId}/admin`}
            onSubmit={handleSubmit}
          >
            <input type="hidden" name="wishlistId" value={wishlistId} />
            <input type="hidden" name="secretId" value={secretId} />
            <input type="hidden" name="movieId" value={Number(m.id)} />
            {genreId ? (
              <input type="hidden" name="genreId" value={genreId} />
            ) : (
              <input type="hidden" />
            )}
            {/* <input type="hidden" name="serverRedirect" value={serverRedirect} /> */}
            {wishlist?.[0]?.movies.includes(Number(m.id)) ? (
              <WishListButton
                type="submit"
                name="actionWishlist"
                disabled={isWishlisting}
                value="delete"
              >
                {isWishlisting ? (
                  <HeartIcon
                    height={20}
                    width={20}
                    // fill="currentColor"
                  />
                ) : (
                  <HeartFilled height={20} width={20} fill="currentColor" />
                )}
              </WishListButton>
            ) : (
              <WishListButton
                type="submit"
                name="actionWishlist"
                disabled={isWishlisting}
                value="create"
              >
                {isWishlisting ? (
                  <HeartFilled height={20} width={20} fill="currentColor" />
                ) : (
                  <HeartIcon
                    height={20}
                    width={20}
                  />
                )}
              </WishListButton>
            )}
          </fetcher.Form>
        </CardBottom>
      </MovieWriteup>
    </MovieCard>
  )
}
const HeartFilled = styled(HeartFilledIcon)<{ fill?: string }>`
  font-size: 48px;
  color: violet;
  transition: all 1s ease-in-out;
`
const MoviesContainer = styled.div`
  color: white;
`
const CardBottom = styled.div`
  display: flex;
  gap: 5px;
  align-items: center;
  justify-content: space-between;
`
const WishListButton = styled.button`
  display: flex;
  align-items: center;
`
const WatchButton = styled.button``
const MovieCardWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  column-gap: 30px;
  row-gap: 20px;
`

const MovieWriteup = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  background-image: linear-gradient(
      0deg,
      rgba(21, 24, 30, 0.88),
      rgba(21, 24, 30, 0.88)
    ),
    linear-gradient(
      240.05deg,
      rgb(34, 38, 47) 2.21%,
      rgba(34, 38, 47, 0) 43.89%,
      rgb(34, 38, 47) 115.91%
    );
  box-shadow: rgba(0, 0, 0, 0.05) 0px 0.25em 4em;
  color: white;
  border: none;
  width: 100%;
  height: 100%;
  transition: all 0.7s ease-in-out;
  padding: 20px;
  font-weight: semi-bold;
  font-size: 14px;
  box-sizing: border-box;
  clip-path: circle(10% at 100% 100%);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: red;

  & h4 {
    font-size: 18px;
    font-family: 'Nunito Sans', sans-serif;
    font-weight: 700;
    line-height: 28px;
    & a {
      color: white;
      text-decoration: none;
    }
  }

  & p {
    color: #e3e5e8b8;
    padding-block-start: 10px;
    font-weight: lighter;
    flex: 1 1 100%;
  }
`

const MovieCard = styled.div`
  cursor: pointer;
  transition: all 0.5s cubic-bezier(0.8, 0.5, 0.2, 1.4);
  overflow: hidden;
  position: relative;
  /* background-color: red; */
  border-radius: 10px;
  & img {
    width: 100%;
    height: 100%;
    transition: all 0.5s cubic-bezier(0.8, 0.5, 0.2, 1.4);
  }

  &:hover {
    /* transition: all 0.5s cubic-bezier(0.8, 0.5, 0.2, 1.4); */
    box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.3);
    transform: scale(1.05);
    border: 2px solid #15191f;
    & img {
      filter: blur(50px);
    }

    & ${MovieWriteup} {
      /* left: 0px; */
      transition: all 0.7s ease-in-out;
      background-color: #aa3fff;
      clip-path: circle(75%);
    }
  }
`
