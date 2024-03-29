import { HeartFilledIcon, HeartIcon } from '@radix-ui/react-icons'
import { Link, useFetcher, useLoaderData, useOutletContext } from '@remix-run/react'
import styled from 'styled-components'
import { type Movie } from '~/routes/_index'
import type { loader } from '~/routes/wishlist.$sid.$wid.admin'
import TrailerModal from './TrailerModal'

export type WishlistId = {
  wishlistId : string
  secretWishlistId : string
}

export const MovieItem = ({
  m,
  genreId,
  source,
  q
}: {
  m: Movie
  genreId?: string
  source: string
  q?: string | null
}) => {
  const fetcher = useFetcher<typeof loader>()
  const { wishlist } = useLoaderData()
  const { wishlistId, secretWishlistId } = useOutletContext<WishlistId>()

  const isWishlisting =
    Number(fetcher.formData?.get('movieId')) === m.id ||
    fetcher.state === 'submitting'


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
              prefetch='intent'
              to={`?${!source ? `&with_genres=${genreId}` : `q=${q}`}&movieId=${m.id}&wl=${wishlistId}&sid=${secretWishlistId}`}
            >
              <TrailerModal
                movieId={Number(m.id)}
                genreId={Number(genreId)}
                wishlistId={wishlistId}
                secretId={secretWishlistId}
              />
            </Link>
          </WatchButton>
          <fetcher.Form
            method="post"
            action={`/wishlist/${wishlistId}/${secretWishlistId}/admin`}
          >
            <input type="hidden" name="wishlistId" value={wishlistId} />
            <input type="hidden" name="secretId" value={secretWishlistId} />
            <input type="hidden" name="movieId" value={Number(m.id)} />
            <input type="hidden" name="source" value={source ? source : ''} />
            <input type="hidden" name="q" value={q ? q : ''} />
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
                  <HeartIcon height={20} width={20} />
                )}
              </WishListButton>
            )}
          </fetcher.Form>
        </CardBottom>
      </MovieWriteup>
    </MovieCard>
  )
}

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

const HeartFilled = styled(HeartFilledIcon) <{ fill?: string }>`
  font-size: 48px;
  color: violet;
  transition: all 1s ease-in-out;
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
  border-radius: 10px;
  & img {
    width: 100%;
    height: 100%;
    transition: all 0.5s cubic-bezier(0.8, 0.5, 0.2, 1.4);
  }
  box-shadow: 0px 2px 3px rgba(124, 0, 240, 0.5) ;

  &:hover {
    /* transition: all 0.5s cubic-bezier(0.8, 0.5, 0.2, 1.4); */
    box-shadow: 0px 2px 3px rgba(124, 0, 240, 0.3);
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
