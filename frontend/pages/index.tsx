import type { NextPage } from 'next'
import HomeApp from '../apps/home/homeApp'
import Head from 'next/head'

const Home: NextPage = () =>
    <>
        <Head>
            <title>Drunken Dragon: Inns & Quests</title>
            <meta name="Drunken Dragon Inns & Quests" content="A Drunken Dragon Universe Game" />
            <script
                defer
                type="text/javascript"
                src="https://app.termly.io/embed.min.js"
                data-auto-block="on"
                data-website-uuid="b299da00-76b5-4d81-bd28-c2515a54c1df"
            ></script>
        </Head>
        <HomeApp />
    </>

export default Home
