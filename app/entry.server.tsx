import { ServerStyleSheet } from 'styled-components'
import type { EntryContext } from '@remix-run/node'
import { Response } from '@remix-run/node'
import { RemixServer } from '@remix-run/react'
import { renderToString } from 'react-dom/server'
import { Head } from './root'

// hydration issue as extensions inject script in the code react will start over with client side
// temporary fix: https://github.com/remix-run/remix/discussions/5244#discussioncomment-4850658
// with help of: https://github.com/kiliman/remix-hydration-fix
// update code later if react 18.3 fixes this because this code will not hydrate the entire document and will create issues like
// no prefetching of data before the page loads as my scripts are in body and not head for now added a settime out before page loads
// css laoded initially in head will only work
//revert entry.client.tsx entry.server.tsx  root.tsx

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  const head = renderHead(request, remixContext)
  const sheet = new ServerStyleSheet()
  const markup = renderToString(
    sheet.collectStyles(
      <RemixServer context={remixContext} url={request.url} />
    )
  )

  responseHeaders.set('Content-Type', 'text/html')
  const styledComponentsStyles = sheet.getStyleTags()

  return new Response(
    `<!DOCTYPE html>
      <html>
        <head>
          <link rel="stylesheet">
          ${styledComponentsStyles}
          <!--start head-->
          ${head}
          <!--end head-->
        </head>
        <body>
          <div id="root">${markup}</div>
        </body>
      </html>`,
    {
      status: responseStatusCode,
      headers: responseHeaders
    }
  )
}

function renderHead(request: Request, remixContext: EntryContext) {
  return renderToString(
    <RemixServer
      context={{
        ...remixContext,
        routeModules: {
          ...remixContext.routeModules,
          root: {
            ...remixContext.routeModules.root,
            default: Head
          }
        }
      }}
      url={request.url}
    />
  )
}
