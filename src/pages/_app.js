import '@/styles/globals.css'
import '@/styles/layout.scss'
import { SessionProvider } from 'next-auth/react';
import Head from 'next/head';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppContext from '@/context/AppContext'
import { useState } from 'react';
import CheckUserAccess from '@/components/auth/CheckUserAccess';

export default function App({ Component, pageProps }) {
  const [userAccess, setUserAccess] = useState({})
  const [userInfo, setUserInfo] = useState({})

  return <>
    <SessionProvider session={pageProps.session}>
    <AppContext.Provider value={{userAccess, setUserAccess, userInfo, setUserInfo}}>
      <Head>
          <title>CyberGladium</title>
          <meta name="description" content="Esports community platform" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <ToastContainer />
      <CheckUserAccess>
        <Component {...pageProps} />
      </CheckUserAccess>
    </AppContext.Provider>
  </SessionProvider>
  </>
}
