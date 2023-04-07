import { ReactNode } from "react"
import { Provider, useSelector } from "react-redux"
import styled from "styled-components"
import { colors, DropdownMenu, MessiriFontFamily, NoDragImage, OswaldFontFamily, Push, px1 } from "../../common"
import { UserInfo } from "../account-dsl"
import { AccountState, accountStore } from "../account-state"
import { AccountTransitions } from "../account-transitions"

const WalletAssociationWidgetContainer = styled.div`
    width: 100%;
`

const AssociatedWalletRowContainer = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    gap: 10px;
`

const AddWalletMessage = styled.p`
    font-size: 21px;
    color: ${colors.textGray};
`

const StakeAddress = styled.p`
    font-size: 21px;
    color: ${colors.textBeige};
`

const AssociatedWalletRow = (props: { stakeAddress: string }) => 
    <AssociatedWalletRowContainer>
        <NoDragImage 
            src="https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/account_settings/linked_account.svg"
            width={20}
            height={20}
            units={px1}
        />
        <StakeAddress>{props.stakeAddress}</StakeAddress>
    </AssociatedWalletRowContainer>

const WalletAssociationWidget = (userInfo: UserInfo) => {
    const dropdownButtons = {
        "Nami": () => { AccountTransitions.associateWallet("Nami") },
        "Eternl": () => { AccountTransitions.associateWallet("Eternl") },
    }
    return (
        <WalletAssociationWidgetContainer>
            { userInfo.stakeAddresses.map((stakeAddress, index) =>
                <AssociatedWalletRow key={index} stakeAddress={stakeAddress} />
            )}
            <AssociatedWalletRowContainer key="-1">
                <NoDragImage 
                    src="https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/account_settings/add_account.svg"
                    width={20}
                    height={20}
                    units={px1}
                />
                <AddWalletMessage>Associate Wallet</AddWalletMessage>
                <Push />
                <DropdownMenu buttons={dropdownButtons} />
            </AssociatedWalletRowContainer>
        </WalletAssociationWidgetContainer>
    )
}

const DragonSilverWidgetContainer = styled.div`
    width: 100%;
`

const DragonSilverWidget = (userInfo: UserInfo) => {
    return (
        <DragonSilverWidgetContainer>

        </DragonSilverWidgetContainer>
    )
}

const DashboardCardContainer = styled.div`
    ${MessiriFontFamily}
    padding: 20px;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 5px;
    box-shadow: 0 0 20px 0 rgba(0,0,0,0.8);
`

const DashboardCardTitle = styled.h1`
    font-size: 20px;
    text-align: center;
    color: ${colors.textGray};
    margin-bottom: 20px;
    ${OswaldFontFamily}
    font-weight: bold;
`

const DashboardCardContent = styled.div`
    width: 100%;
`

const DashboardCard = (props: { children?: ReactNode, title: string, }) => 
    <DashboardCardContainer>
        <DashboardCardTitle>{props.title}</DashboardCardTitle>
        <DashboardCardContent>{props.children}</DashboardCardContent>
    </DashboardCardContainer>


const DashboardContainer = styled.div`
    width: 100%;
    padding: 5vw;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
`

const DashboardViewContent = () => {
    const userInfo = useSelector((state: AccountState) => state.userInfo)
    return userInfo ? (
        <DashboardContainer>
            <DashboardCard key="dragon-silver-widget" title="Dragon Silver">
                <DragonSilverWidget {...userInfo} />
            </DashboardCard>
            <DashboardCard key="wallet-authentication-widget" title="Associated Wallets">
                <WalletAssociationWidget {...userInfo} />
            </DashboardCard>
        </DashboardContainer>
    ): <></>
}

export const DashboardView = () => 
    <Provider store={accountStore}>
        <DashboardViewContent />
    </Provider>
