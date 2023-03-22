import Validate from '../apps/login/validate';
import { loginStore } from "../apps/login/features/appLogin"
import { Provider } from "react-redux"
import type { NextPage } from 'next'
import Head from 'next/head';

const ValidatePage: NextPage = () =>
    <>
        <Head>
            <title>Validate Account</title>
            <meta name="Drunken Dragon Inns & Quests" content="A Drunken Dragon Universe Game" />
        </Head>
        <Provider store={loginStore}>
            <Validate />
        </Provider>
    </>

export default ValidatePage