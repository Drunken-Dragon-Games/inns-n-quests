import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { IsSsrMobileContext } from '../apps/is-mobile'

export default function App({
  Component,
  pageProps
}: AppProps<{ isSsrMobile: boolean }>) {
  return (
    <IsSsrMobileContext.Provider value={pageProps.isSsrMobile}>
      <Component {...pageProps} />
    </IsSsrMobileContext.Provider>
  )
}
