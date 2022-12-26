import { Provider } from "react-redux"
import type { NextPage } from 'next'
import Head from 'next/head';
import DiscordAdd from '../apps/accountSettings/accountSettings/discordAdd';
import { generalStore } from '../features/generalReducer';


const validate: NextPage = () => {


    return (
        <>
            <Head>
                <title>Validate | Drunken Dragon</title>
                <meta name="description" content="Validation discord page" />
            </Head>

            <Provider store={generalStore}>
                <DiscordAdd/>
            </Provider>
        </>
    )
}

export default validate