import type { NextPage } from 'next'
import Head from 'next/head'
import CollectionView from '../apps/collection/collection-view'

const Collection: NextPage = () =>
    <>
        <Head>
            <title>Drunken Dragon Collection</title>
            <meta name="Drunken Dragon Inns & Quests" content="A Drunken Dragon Universe Game" />
        </Head>
        <CollectionView />
    </>

export default Collection