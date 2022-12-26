import type { NextPage } from 'next'
import Head from 'next/head';
import LoginApp from "../apps/login/login"
import { loginStore} from "../apps/login/features/appLogin"
import { Provider } from "react-redux"


const Login: NextPage = () => {

 
  return (
    <>
        <Head>
            <title>Log In | Drunken Dragon</title>
            <meta name="description" content="A drunken Dragon Game" />
        </Head>

        <Provider store={loginStore}>
            <LoginApp/>
        </Provider>

    </>
  )
}

export default Login
