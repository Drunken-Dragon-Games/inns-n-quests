import type { GetServerSidePropsContext, NextPage } from 'next'
import Head from 'next/head'
import IdleQuestsView from '../../apps/game'
import { getIsSsrMobile } from '../../apps/is-mobile'
import { useRouter } from 'next/router'

const Game = () => {
    const router = useRouter()
    const host: string | undefined = 
        typeof router.query.host === "string" && router.query.host.length > 0 ?
            router.query.host :
            undefined
    return <IdleQuestsView host={host} />
}

const HostInn: NextPage = () =>
    <>
        <Head>
            <title>Inns & Quests</title>
            <meta name="Drunken Dragon Inns & Quests" content="A Drunken Dragon Universe Game" />
        </Head>
        <Game />
    </>

export default HostInn

export async function getServerSideProps(context: GetServerSidePropsContext) {
    return {
        props: {
            isSsrMobile: getIsSsrMobile(context)
        }
    }
}