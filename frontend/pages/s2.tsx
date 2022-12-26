import type { NextPage } from 'next'
import Head from 'next/head'
import ExplorerOfThoiolden from '../apps/explorerOfThiolden/explorerOfThiolde'

const S3: NextPage = () => {
  return (
        <>
          <Head>
              <title>Adventurers of Thiolden | Drunken Dragon</title>
              <meta name="Drunken dragon entreta" content="A drunken Dragon Game" />
          </Head>
          <ExplorerOfThoiolden/>
        </>
  )
}

export default S3
