import type { NextPage } from 'next'
import Head from 'next/head'
import StoreView from '../apps/store/store-view'

const Collection: NextPage = () =>
    <>
        <Head>
            <title>Drunken Dragon Asset Store</title>
            <meta name="Drunken Dragon Inns & Quests" content="A Drunken Dragon Universe Game" />
        </Head>
        <StoreView />
    </>

export default Collection