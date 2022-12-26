import type { NextPage } from 'next'
import AccountSettingsApp from '../apps/accountSettings/accountSettingsApp'
import Head from 'next/head'

const AccountSettings: NextPage = () => {
  return (
    <>
        <Head>
          <title>Account Setting | Drunken Dragon</title>
          <meta name="Drunken dragon entreta" content="A drunken Dragon Game" />
        </Head>
        <AccountSettingsApp/>
    </>
  )
}

export default AccountSettings
