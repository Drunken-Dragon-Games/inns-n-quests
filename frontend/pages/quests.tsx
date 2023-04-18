import type { GetServerSidePropsContext, NextPage } from 'next'
import Head from 'next/head'
import IdleQuestsView from '../apps/game'
import { getIsSsrMobile } from '../apps/is-mobile'

const Quests: NextPage = () =>
    <>
        <Head>
            <title>Inns & Quests</title>
            <meta name="Drunken Dragon Inns & Quests" content="A Drunken Dragon Universe Game" />
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