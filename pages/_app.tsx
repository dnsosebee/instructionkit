import 'highlight.js/styles/night-owl.css'
import { AppProps } from 'next/app'
import '../styles.css'

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
