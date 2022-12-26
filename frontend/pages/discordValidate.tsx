import Validate from '../apps/login/validate';
import { loginStore} from "../apps/login/features/appLogin"
import { Provider } from "react-redux"
import type { NextPage } from 'next'
import Head from 'next/head';


const validate: NextPage = () => {


    return (
        <>
            <Head>
                <title>Validate | Drunken Dragon</title>
                <meta name="description" content="Validation discord page" />
            </Head>

            <Provider store={loginStore}>
                <Validate/>
            </Provider>
        </>
    )
}

export default validate