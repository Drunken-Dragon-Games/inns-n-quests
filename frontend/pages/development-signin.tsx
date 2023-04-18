import type { NextPage } from 'next'
import Head from 'next/head'
import { DevelopmnentSignin } from '../apps/account/components/development-signin'

const DevelopmentSigninPage: NextPage = () =>
    <>
        <Head>
            <title>Development Signin</title>
            <meta name="Drunken Dragon Inns & Quests" content="A Drunken Dragon Universe Game" />
        </Head>

        <DevelopmnentSignin />
    </>

export default DevelopmentSigninPage 
