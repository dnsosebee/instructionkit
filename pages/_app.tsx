import 'highlight.js/styles/night-owl.css'
import { AppProps } from 'next/app'
import Head from 'next/head'
import '../styles.css'

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>InstructionKit</title>
      </Head>
      <Component {...pageProps} />
    </>
  )
}
