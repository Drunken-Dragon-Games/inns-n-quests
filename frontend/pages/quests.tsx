import type { GetServerSidePropsContext, NextPage } from 'next'
import Head from 'next/head'
import IdleQuestsView from '../apps/idleQuest'
import { getIsSsrMobile } from '../apps/is-mobile'

const Quests: NextPage = () => 
  <>
    <Head>
      <title>Inns & Quests</title>
      <meta name="Drunken Dragon Entertainment" content="A Drunken Dragon Universe game" />
    </Head>
    <IdleQuestsView />
  </>

export default Quests

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {
      isSsrMobile: getIsSsrMobile(context)
    }
  }
}