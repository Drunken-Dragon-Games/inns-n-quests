import type { NextPage } from 'next'
import Head from 'next/head'
import ExplorerOfThoiolden from '../apps/explorerOfThiolden/explorerOfThiolde'

const S3: NextPage = () =>
    <>
        <Head>
            <title>Adventurers of Thiolden</title>
            <meta name="Drunken Dragon Inns & Quests" content="A Drunken Dragon Universe Game" />
        </Head>
        <ExplorerOfThoiolden />
    </>

export default S3
