import { ReactNode } from "react"
import { Provider, useSelector } from "react-redux"
import styled from "styled-components"
import { colors, DropdownMenu, MessiriFontFamily, NoDragImage, OswaldFontFamily, Push, px1, useNumberAnimation, useRememberLastValue, TokenDisplayer, ClaimButton } from "../../common"
import { UserInfo, renderWalletActionDetails } from "../account-dsl"
import { AccountState, accountStore } from "../account-state"
import { AccountTransitions } from "../account-transitions"
import { AccountThunks } from "../account-thunks"

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
    const associateState = useSelector((state: AccountState) => state.associateState)
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
            <span style={{ color: 'white' }}>{renderWalletActionDetails(associateState)}</span>
        </WalletAssociationWidgetContainer>
    )
}

const DragonSilverWidgetContainer = styled.div`
  width: 100%;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  --min-font-size: calc(14px + 0.45vw);
`;

const TokenRowContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  width: 100%;
  margin-bottom: 10px;
`;

const IndividualTokenPosition = styled.div`
  margin: auto 0vw;
  margin-left: 1.5vw;
  &:first-child {
    margin-left: 0vw;
  }
  width: max(20vw, 100px);
  position: relative;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 10px;
`;


const DragonSilverWidget = (userInfo: UserInfo) => {
    const lastonChainAmount = useRememberLastValue(userInfo.dragonSilver, 0)
    const lastClaimedAmount = useRememberLastValue(userInfo.dragonSilverToClaim, 0)
    const renderedOnChain = useNumberAnimation(lastonChainAmount, userInfo.dragonSilver, true)
    const renderedClaimable = useNumberAnimation(lastClaimedAmount, userInfo.dragonSilverToClaim, true)
    const claimState = useSelector((state: AccountState) => state.claimState)
    const dropdownButtons = {
        "Nami": () => { AccountTransitions.claimDragonSilver("Nami") },
        "Eternl": () => { AccountTransitions.claimDragonSilver("Eternl") },
    }
    return (
        <DragonSilverWidgetContainer>
            <TokenRowContainer>
                <IndividualTokenPosition>
                    <TokenDisplayer icon="dragon_silver" number={renderedOnChain} />
                </IndividualTokenPosition>
                <IndividualTokenPosition>
                    <TokenDisplayer icon="dragon_silver_toClaim" number={renderedClaimable} />
                </IndividualTokenPosition>
            </TokenRowContainer>
            <ButtonContainer>
                <button onClick = {AccountTransitions.grantTest}>Grant</button>
                <DropdownMenu buttons={dropdownButtons} />
            </ButtonContainer>
            {renderWalletActionDetails(claimState)}
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
