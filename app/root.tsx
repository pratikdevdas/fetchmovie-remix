import { cssBundleHref } from '@remix-run/css-bundle'
import type { LinksFunction } from '@remix-run/node'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  useSearchParams
  // ScrollRestoration
} from '@remix-run/react'
import { createHead } from 'remix-island'
import main from './styles/main.css'
import { useEffect, useState } from 'react'
import { v4, v1 } from 'uuid'

export const links: LinksFunction = () => {
  return [
    ...(cssBundleHref
      ? [
          { rel: 'stylesheet', href: cssBundleHref },
          {
            rel: 'preconnect',
            href: 'https://fonts.googleapis.com'
          },
          {
            rel: 'preconnect',
            href: 'https://fonts.gstatic.com"'
          },
          {
            rel: 'stylesheet',
            href: 'https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@700;800&display=swap'
          },
          {
            rel: 'stylesheet',
            href: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;600&display=swap'
          },
          {
            rel: 'stylesheet',
            href: main
          }
        ]
      : [])
  ]
}

export const Head = createHead(() => (
  <>
    <Meta />
    <Links />
    {typeof document === 'undefined' ? '__STYLES__' : null}
  </>
))

export default function App() {
  const [wishlistId, setWishlistId] = useState('')
  const [secretWishlistId, setSecretWishlistId] = useState('')
  const [, setSearchParams] = useSearchParams('')

  useEffect(() => {
    const existingSession = window.localStorage.getItem('localUserWishlistData')
    if (existingSession) {
      const existingSessionJSON = JSON.parse(
        existingSession ? existingSession : ''
      )
      setWishlistId(existingSessionJSON.wishlistId)
      setSecretWishlistId(existingSessionJSON.secretId)
      setSearchParams({
        wl: existingSessionJSON.wishlistId,
        sid: existingSessionJSON.secretId
      })
    } else {
      const wishlistId = v4()
      const secretId = v1()
      console.log(wishlistId)
      console.log(wishlistId)
      window.localStorage.setItem(
        'localUserWishlistData',
        JSON.stringify({ wishlistId, secretId })
      )
      setWishlistId(wishlistId)
      setSecretWishlistId(secretId)
      setSearchParams({ wl: wishlistId, sid: secretId })
    }
  }, [])
  return (
    <>
      <Head />
      <p style={{ textAlign:'center', font: 'normal', color:'#fff', marginTop : '8px' }}>⚠️ New UI is under construction. You might loose your wishlist data! <a style={{ textDecoration: 'underline', color:'#e3242b' }} href="mailto:pratikdevdas@outlook.com">Mail me</a> with your wishlist url to get it now</p>

      <Outlet context={{ wishlistId, secretWishlistId }} />
      {/* removed because scroll was going up on loading modal */}
      {/* <ScrollRestoration /> */}
      <Scripts />
      <LiveReload />
    </>
  )
}
