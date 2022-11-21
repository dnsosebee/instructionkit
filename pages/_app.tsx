import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { Session, SessionContextProvider } from '@supabase/auth-helpers-react'
import 'highlight.js/styles/night-owl.css'
import { AppProps } from 'next/app'
import Head from 'next/head'
import { useState } from 'react'
import '../styles.css'

export default function MyApp({
  Component,
  pageProps,
}: AppProps<{
  initialSession: Session
}>) {
  const [supabase] = useState(() => createBrowserSupabaseClient())

  return (
    <SessionContextProvider supabaseClient={supabase} initialSession={pageProps.initialSession}>
      <Head>
        <title>InstructionKit</title>
      </Head>
      <Component {...pageProps} />
    </SessionContextProvider>
  )
}
