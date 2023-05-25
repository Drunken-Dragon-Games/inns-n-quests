import type { NextPage } from 'next'
import AccountSettingsApp from '../apps/accountSettings/accountSettingsApp'
import Head from 'next/head'

const AccountSettings: NextPage = () =>
    <>
        <Head>
            <title>Account Settings InQ</title>
            <meta name="Drunken Dragon Inns & Quests" content="A Drunken Dragon Universe Game" />
        </Head>
        <AccountSettingsApp />
    </>

export default AccountSettings
