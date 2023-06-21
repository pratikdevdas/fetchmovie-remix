import { RemixBrowser } from '@remix-run/react'
import { startTransition, StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const elementToHydrate: HTMLElement = document.getElementById('root')!

startTransition(() => {
  hydrateRoot(
    elementToHydrate,
    <StrictMode>
      <RemixBrowser />
    </StrictMode>
  )
})
