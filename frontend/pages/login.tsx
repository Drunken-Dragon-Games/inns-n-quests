import type { NextPage } from 'next'
import Head from 'next/head';
import LoginApp from "../apps/login/login"
import { loginStore } from "../apps/login/features/appLogin"
import { Provider } from "react-redux"

const Login: NextPage = () =>
    <>
        <Head>
            <title>Signin InQ</title>
            <meta name="Drunken Dragon Inns & Quests" content="A Drunken Dragon Universe Game" />
        </Head>
        <Provider store={loginStore}>
            <LoginApp />
        </Provider>
    </>

export default Login
