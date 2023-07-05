import type { NextPage } from 'next'
import Head from 'next/head'
import CollectionApp from '../apps/collection/collectionApp'

const Collection: NextPage = () =>
    <>
        <Head>
            <title>Drunken Dragon Collection</title>
            <meta name="Drunken Dragon Inns & Quests" content="A Drunken Dragon Universe Game" />
        </Head>
        <CollectionApp />
    </>

export default Collection