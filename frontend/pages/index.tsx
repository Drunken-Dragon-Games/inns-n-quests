import type { NextPage } from 'next'
import LandingApp from '../apps/landing/landing-app'
import Head from 'next/head'

const Landing: NextPage = () =>
    <>
        <Head>
            <title>Drunken Dragon Universe</title>
            <meta name="Drunken Dragon Universe" content="A decentralised fantasy franchise for creators and fans." />
        </Head>
        <LandingApp />
    </>

export default Landing 
