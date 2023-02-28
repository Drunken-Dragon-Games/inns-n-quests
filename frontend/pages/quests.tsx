import type { NextPage } from 'next'
import Head from 'next/head'
import IdleQuestsView from '../apps/idleQuest'

const Quests: NextPage = () => 
  <>
    <Head>
      <title>Idle Quest | Drunken Dragon</title>
      <meta name="Drunken dragon entreta" content="A drunken Dragon Game" />
    </Head>
    <IdleQuestsView />
  </>

export default Quests
