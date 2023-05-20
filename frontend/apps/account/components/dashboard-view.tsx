import { MouseEventHandler, ReactNode, useEffect } from "react"
import { Provider, useSelector } from "react-redux"
import styled from "styled-components"
import { colors, DropdownMenu, MessiriFontFamily, NoDragImage, OswaldFontFamily, Push, px1, useNumberAnimation, useRememberLastValue, TokenDisplayer, ClaimButton, MobileHidden } from "../../common"
import { ClaimInfo, ClaimProcessState, ClaimStatus, UserInfo, WalletAssociationProcessState } from "../account-dsl"
import { AccountState, accountStore } from "../account-state"
import { AccountTransitions } from "../account-transitions"
import { AccountThunks } from "../account-thunks"

const WidgetRowContainer = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    gap: 10px;
`

const WidgetRowTextGray = styled.p`
    font-size: 21px;
    color: ${colors.textGray};
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: 80%;
    @media (max-width: 414px) {
        font-size: 5vw;
    }
`

const WidgetRowTextBeige = styled.p`
    font-size: 21px;
    color: ${colors.textBeige};
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: 80%;
`


const DragonSilverIcon = ({ white }: { white?: boolean }) => 
    <NoDragImage
        src={`https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/navbar_main/icons/dragon_silver${white ? "_toClaim" : ""}.svg`}
        width={20}
        height={20}
        units={px1}
    />

const WidgetRow = (props: { 
    status: "tick" | "no-tick", 
    text?: string, 
    actions?: Record<string, MouseEventHandler<HTMLButtonElement>>, 
    children?: ReactNode,
}) => 
    <WidgetRowContainer>
        <NoDragImage 
            src={`https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/account_settings/${props.status === "tick" ? "linked_account" : "add_account"}.svg`}
            width={20}
            height={20}
            units={px1}
        />
        { props.text && props.status === "tick" 
        ? <WidgetRowTextGray>{props.text}</WidgetRowTextGray>
        : <WidgetRowTextBeige>{props.text}</WidgetRowTextBeige> }
        { props.children }
        { props.actions && <>
            <Push />
            <DropdownMenu buttons={props.actions} />
        </> }
    </WidgetRowContainer>



const DragonGoldWidgetContainer = styled.div`
    width: 100%;
`

const DragonGoldWidget = () => {
    return (
        <DragonGoldWidgetContainer>
            <button onClick={AccountTransitions.dragonGoldMint}>Mint</button>
            <button onClick={AccountTransitions.dragonGoldLock}>Lock</button>
        </DragonGoldWidgetContainer>
    )
}


const WalletAssociationWidgetContainer = styled.div`
    width: 100%;
`

const walletAssociationMessage = (state: WalletAssociationProcessState) =>
    state.ctype == "idle" ? "Associate Wallet" :
    state.ctype == "loading" ? state.details :
    state.ctype == "error" ? state.details :
    ""

const WalletAssociationWidget = (userInfo: UserInfo) => {
    const associateState = useSelector((state: AccountState) => state.associateProcessState)
    return (
        <WalletAssociationWidgetContainer>
            <MobileHidden>
                <WidgetRow status="no-tick" text={walletAssociationMessage(associateState)} actions={{
                    "Nami": () => { AccountTransitions.associateWallet("Nami") },
                    "Eternl": () => { AccountTransitions.associateWallet("Eternl") },
                }} />
            </MobileHidden>
                {userInfo.stakeAddresses.map((stakeAddress, index) =>
                    <WidgetRow key={index} status="tick" text={stakeAddress} />
                )}
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
`

const ButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
    margin: 10px 0px 10px 0px;
`

const DragonSilverDisplayContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin-bottom: 10px;
    gap: 10px;
`

const DragonSilverDisplay = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;
    #border: 1px solid ${colors.textGray};
    #border-radius: 20px;
    #padding: 3px 10px;
`

const DragonSilverDisplayText = styled.span`
    font-size: 21px;
    color: ${colors.textGray};
`

const ClaimStatusMedal = styled.span<{ state: ClaimStatus | "claim" | "error" }>`
    padding: 3px 10px 5px 10px;
    border-radius: 15px;
    ${OswaldFontFamily};
    font-size: 12px;
    font-weight: bold;
    text-align: center;
    width: 70px;
    ${props => props.state == "confirmed" ? `
        background-color: ${colors.dduGold};
        color: white;
    ` : props.state == "claim" ? `
        #border: 1px solid ${colors.dduGold};
        color: transparent;
    ` : props.state == "timed-out" ? `
        border: 1px solid ${colors.textGray};
        color: ${colors.textGray};
    ` : props.state == "created" ? `
        border: 1px solid ${colors.dduGold};
        color: white;
    ` : props.state == "submitted" ? `
        border: 1px solid ${colors.dduGold};
        color: ${colors.dduGold};
    ` : props.state == "error" ? `
        border: 1px solid red;
        color: red;
    ` : "" }
`

const TimeStamp = styled(WidgetRowTextGray)`
    font-size: 14px;
    @media only screen and (max-width: 414px) {
        display: none;
    }
`


const DragonSilverClaimRow = ({ claimInfo }: { claimInfo: ClaimInfo }) => 
    <WidgetRow status="tick">
        <ClaimStatusMedal state={claimInfo.state}>{claimInfo.state}</ClaimStatusMedal>
        <DragonSilverIcon />
        <WidgetRowTextGray>{claimInfo.quantity}</WidgetRowTextGray>
        <Push />
        <TimeStamp>{claimInfo.createdAt}</TimeStamp>
    </WidgetRow>

const claimRowMessage = (claimable: number, state: ClaimProcessState) =>
    state.ctype == "idle" && claimable == 0 ? "Quest or stake to DND pool to earn Dragon Silver!" :
    state.ctype == "idle" ? "Claimable" :
    state.ctype == "loading" ? state.details :
    state.ctype == "error" ? state.details :
    "" 
    
const DragonSilverWidget = (userInfo: UserInfo) => {
    const lastonChainAmount = useRememberLastValue(userInfo.dragonSilver, 0)
    const lastClaimedAmount = useRememberLastValue(userInfo.dragonSilverToClaim, 0)
    const renderedOnChain = useNumberAnimation(lastonChainAmount, userInfo.dragonSilver, true)
    const renderedClaimable = useNumberAnimation(lastClaimedAmount, userInfo.dragonSilverToClaim, true)
    const { claimProcessState, dragonSilverClaims } = useSelector((state: AccountState) => ({
        claimProcessState: state.claimProcessState,
        dragonSilverClaims: state.dragonSilverClaims,
    }))
    const medalState = 
        claimProcessState.ctype == "loading" ? claimProcessState.claimStatus :
        claimProcessState.ctype == "idle" ? "claim" : "error"
    useEffect(() => {
        AccountTransitions.getDragonSilverClaims()
    }, [])
    const claimButtonActions = claimProcessState.ctype == "idle" && userInfo.dragonSilverToClaim > 0 ? {
        "Nami": () => { AccountTransitions.claimDragonSilver("Nami") },
        "Eternl": () => { AccountTransitions.claimDragonSilver("Eternl") },
    } : undefined
    return (
        <DragonSilverWidgetContainer>
            <DragonSilverDisplayContainer>
                <DragonSilverDisplay>
                    <DragonSilverIcon white />
                    <DragonSilverDisplayText>{renderedClaimable}</DragonSilverDisplayText>
                </DragonSilverDisplay>
                <DragonSilverDisplay>
                    <DragonSilverIcon />
                    <DragonSilverDisplayText>{renderedOnChain}</DragonSilverDisplayText>
                </DragonSilverDisplay>
            </DragonSilverDisplayContainer>

            <MobileHidden>
                <WidgetRow status="no-tick" actions={claimButtonActions} >
                    <ClaimStatusMedal state={medalState}>{medalState}</ClaimStatusMedal>
                    <DragonSilverIcon white />
                    <WidgetRowTextBeige>{renderedClaimable}</WidgetRowTextBeige>
                    <WidgetRowTextBeige>{claimRowMessage(userInfo.dragonSilverToClaim, claimProcessState)}</WidgetRowTextBeige>
                </WidgetRow>
            </MobileHidden>

            {dragonSilverClaims.map((claimInfo, index) =>
                <DragonSilverClaimRow key={index} claimInfo={claimInfo} /> 
            )}

            {/* <ButtonContainer>
                <button onClick = {AccountTransitions.grantTest}>Grant</button>
            </ButtonContainer> */}
        </DragonSilverWidgetContainer>
    )
}

const DashboardCardContainer = styled.div`
    ${MessiriFontFamily}
    padding: 20px;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 5px;
    box-shadow: 0 0 20px 0 rgba(0,0,0,0.8);

    @media only screen and (max-width: 1400px) {
        width: 100%;
        max-width: 900px;
    }
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

    @media only screen and (max-width: 1400px) {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
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
            <DashboardCard key="dragon-gold" title="Dragon Gold Minting">
                <DragonGoldWidget />
            </DashboardCard>
        </DashboardContainer>
    ): <></>
}

export const DashboardView = () => 
    <Provider store={accountStore}>
        <DashboardViewContent />
    </Provider>
