import type { NextPage } from 'next'
import HomeApp from '../apps/home/homeApp'
import Head from 'next/head'

const Home: NextPage = () =>
    <>
        <Head>
            <title>Drunken Dragon: Inns & Quests</title>
            <meta name="Drunken Dragon Inns & Quests" content="A Drunken Dragon Universe Game" />
        </Head>
        <HomeApp />
    </>

export default Home
