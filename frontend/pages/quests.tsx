import type { NextPage } from 'next'
import Head from 'next/head'
import IdleQuest from '../apps/idleQuest/idleQuests'

const Quests: NextPage = () => {
  return (
        <>
          <Head>
              <title>Idle Quest | Drunken Dragon</title>
              <meta name="Drunken dragon entreta" content="A drunken Dragon Game" />
          </Head>
          <IdleQuest/>
        </>
  )
}

export default Quests
