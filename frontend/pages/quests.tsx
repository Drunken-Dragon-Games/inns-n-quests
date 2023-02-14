import type { NextPage } from 'next'
import Head from 'next/head'
import IdleQuestsApp from '../apps/idleQuest/idle-quests-app'

const Quests: NextPage = () => {
  return (
        <>
          <Head>
              <title>Idle Quest | Drunken Dragon</title>
              <meta name="Drunken dragon entreta" content="A drunken Dragon Game" />
          </Head>
          <IdleQuestsApp/>
        </>
  )
}

export default Quests
