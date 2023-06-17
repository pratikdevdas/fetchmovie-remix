import { cssBundleHref } from '@remix-run/css-bundle'
import type { LinksFunction } from '@remix-run/node'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration
} from '@remix-run/react'
import misc from './misc.css'

export const links: LinksFunction = () => {
  return [
    ...(cssBundleHref
      ? [
          { rel: 'stylesheet', href: cssBundleHref },
          {
            rel: 'stylesheet',
            href: 'https://unpkg.com/modern-css-reset@1.4.0/dist/reset.min.css'
          },
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
            href: misc
          }
        ]
      : [])
  ]
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
        {typeof document === 'undefined' ? '__STYLES__' : null}
      </head>
      <body style={{ background: '#0c102c' }}>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
