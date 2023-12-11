import { Link, useLoaderData, useParams } from '@remix-run/react'
import styled from 'styled-components'
import { NavWrapper } from '~/styles/styles'
import SearchBar from './SearchBar'
import { HeartIcon } from '@radix-ui/react-icons'
import type { loader } from '~/routes/wishlist.$sid.$wid.admin'
import { uniq } from 'lodash'

export default function TopNavbar({
  url,
  secUrl,
  setQuery,
  query,
  focus
}: any) {
  const params = useParams()

  if (!secUrl && !url) {
    secUrl = params.sid
    url = params.wid
  }

  const { wishlist } = useLoaderData<typeof loader>()

  return (
    <NavWrapper>
      <LogoHeader>
        <Link prefetch='intent' to={`/?wl=${url}&sid=${secUrl}`}>The Movie App</Link>
      </LogoHeader>
      <SearchBar query={query} setQuery={setQuery} focus={focus} url={url} secUrl={secUrl}/>
      <WishlistContainer>
        <Counter>{uniq(wishlist?.[0].movies).length}</Counter>
        {!secUrl && !url ? <></> : <Link prefetch='intent' to={`/wishlist/${secUrl}/${url}/admin`}><HeartIconCover /></Link>}
      </WishlistContainer>
    </NavWrapper>
  )
}

const LogoHeader = styled.h1`
  font-family: 'Nunito Sans', sans-serif;
`

const WishlistContainer = styled.div`
position: relative;
`
const HeartIconCover = styled(HeartIcon)`
  width: 28px;
  height: 28px;
`
const Counter = styled.div`
  position: absolute;
  background-color: #f03e3e;
  width: 14px;
  height: 14px;
  left: 70%;
  border-radius: 50%;
 z-index: 1;
 display: flex;
 align-items: center;
 justify-content: center;
 font-size: 11px;
 padding-top: 2px;
 `