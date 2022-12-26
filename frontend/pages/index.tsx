import type { NextPage } from 'next'
import HomeApp from '../apps/home/homeApp'
import Head from 'next/head'

const Home: NextPage = () => {
  return (
        <>
          <Head>
              <title>Home | Drunken Dragon</title>
              <meta name="Drunken dragon entreta" content="A drunken Dragon Game" />
          </Head>
          <HomeApp/>
        </>
  )
}

export default Home
