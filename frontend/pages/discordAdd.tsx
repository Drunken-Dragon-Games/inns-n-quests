import { Provider } from "react-redux"
import type { NextPage } from 'next'
import Head from 'next/head';
import DiscordAdd from '../apps/accountSettings/accountSettings/discordAdd';
import { generalStore } from '../features/generalReducer';


const validate: NextPage = () =>
    <>
        <Head>
            <title>Associate Discord Account</title>
            <meta name="Drunken Dragon Inns & Quests" content="A Drunken Dragon Universe Game" />
        </Head>

        <Provider store={generalStore}>
            <DiscordAdd />
        </Provider>
    </>

export default validate