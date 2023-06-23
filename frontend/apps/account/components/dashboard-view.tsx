import { MouseEventHandler, ReactNode, useEffect } from "react"
import { Provider, useSelector } from "react-redux"
import styled from "styled-components"
import { colors, DropdownMenu, MessiriFontFamily, NoDragImage, OswaldFontFamily, Push, px1, useNumberAnimation, useRememberLastValue, TokenDisplayer, ClaimButton, MobileHidden } from "../../common"
import { ClaimInfo, ClaimProcessState, ClaimStatus, PublicBallot, StoredBallot, UserBallot, UserInfo, WalletAssociationProcessState } from "../account-dsl"
import { AccountState, accountStore } from "../account-state"
import { AccountTransitions } from "../account-transitions"
import { AccountThunks } from "../account-thunks"
import { userInfo } from "os"

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
                    "Nami(tx)": () => { AccountTransitions.associateHardareWallet("Nami")},
                    "Eternl(tx)": () => { AccountTransitions.associateHardareWallet("Eternl") },
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

const claimRowMessage = (claimable: string, state: ClaimProcessState) =>
    state.ctype == "idle" && claimable == "0" ? "Quest or stake to DND pool to earn Dragon Silver!" :
    state.ctype == "idle" ? "Claimable" :
    state.ctype == "loading" ? state.details :
    state.ctype == "error" ? state.details :
    "" 
    
const DragonSilverWidget = (userInfo: UserInfo) => {
    const lastonChainAmount = useRememberLastValue(userInfo.dragonSilver, "0")
    const lastClaimedAmount = useRememberLastValue(userInfo.dragonSilverToClaim, "0")
    const renderedOnChain = useNumberAnimation(parseInt(lastonChainAmount), parseInt(userInfo.dragonSilver), true)
    const renderedClaimable = useNumberAnimation(parseInt(lastClaimedAmount), parseInt(userInfo.dragonSilverToClaim), true)
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
    const claimButtonActions = claimProcessState.ctype == "idle" && parseInt(userInfo.dragonSilverToClaim) > 0 ? {
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

const VotingPower = styled.p`
    font-size: 16px;
    color: ${colors.textGray};
    text-align: center;
    margin-bottom: 20px;
    ${OswaldFontFamily}
    font-weight: bold;
`

const BallotContainer = styled.div`
    ${MessiriFontFamily}
    padding: 20px;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 5px;
    box-shadow: 0 0 20px 0 rgba(0,0,0,0.8);
`

const BallotTitleWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
    @media only screen and (max-width: 414px) {
        flex-direction: column;
    }
`

const BallotTitle = styled.h2`
    font-size: 14px;
`

const BallotState = styled.span<{ state: "open" | "closed" | "archived" }>`
    font-size: 12px;
    color: ${props => props.state == "open" ? colors.dduGold : colors.textGray};
    border: 1px solid ${props => props.state == "open" ? colors.dduGold : colors.textGray};
    padding: 2px 10px;
    margin-right: 3px;
    border-radius: 20px;
`

const BallotDescription = styled.p`
    font-size: 14px;
    color: ${colors.textBeige};
    padding: 10px 0px 10px 0px;
`

const BallotUrl = styled.a`
    font-size: 14px;
    color: white;
    padding: 5px 0px 10px 0px;
    text-decoration: underline;
    &:hover {
        color: ${colors.textBeige};
    }
`

const BallotOption = styled.div`
    display: flex;
    gap: 10px;
    margin: 10px 0px 10px 0px;
`

const BallotOptionText = styled.span`
    font-size: 14px;
    color: ${colors.textGray};
`

const VoteButton = styled.button`
    ${OswaldFontFamily}
    font-size: 12px;
    font-weight: bold;
    color: white;
    background-color: ${colors.dduGold};
    border: 1px solid ${colors.dduGold};
    border-radius: 20px;
    padding: 2px 10px;
    margin-right: 3px;
    cursor: pointer;
    text-transform: uppercase;
    &:hover {
        background-color: ${colors.textBeige};
        border: 1px solid ${colors.dduGold};
    }
    &:disabled {
        background-color: transparent;
        border: 1px solid ${colors.textGray};
        color: ${colors.textGray};
        cursor: not-allowed;
    }
`

const BallotsWrapper = styled.div`
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;

    @media only screen and (max-width: 414px) {
        grid-template-columns: 1fr;
    }
`
const renderDragonGold = (DG: string): string => (BigInt(DG)/BigInt(1000000)).toString()
const BallotView = ({ userInfo, ballot }: { userInfo?: UserInfo, ballot: UserBallot | PublicBallot }) => 
    <BallotContainer> 
        <BallotTitleWrapper>
            <BallotState state={ballot.status}>{ballot.status}</BallotState>
            <BallotTitle>{ballot.inquiry}</BallotTitle>
        </BallotTitleWrapper>
        <BallotDescription>{ballot.inquiryDescription}</BallotDescription>
        { ballot.url &&
            <BallotUrl href={ballot.url} target="_blank">Read full description...</BallotUrl>
        }
        {ballot.options.map((option, index) => (
            <BallotOption key={index}>
                {userInfo ? 
                    ballot.status == "open" ? 
                        "hasVoted" in ballot && ballot.hasVoted ?
                            <><VoteButton disabled>{option.title}</VoteButton> <>{"isVotedByUser" in option && option.isVotedByUser ? "voted for this" : <></>}</></>:
                            <>{userInfo.dragonGold != "0" ? <VoteButton onClick={() => AccountTransitions.voteForBallot(ballot.id, index.toString())}>{option.title}</VoteButton> : <VoteButton>{option.title}</VoteButton>}</> :
                        "isVotedByUser" in option && option.isVotedByUser ? 
                            <><VoteButton>{option.title}</VoteButton><>{"isWinner" in option && option.isWinner? "this option won with " : <></>}</><>{"lockedInDragonGold" in option ? renderDragonGold(option.lockedInDragonGold) : <></>}</></>:
                            <><VoteButton disabled>{option.title}</VoteButton><>{"isWinner" in option && option.isWinner? "this option won with " : <></>}</><>{"lockedInDragonGold" in option ? renderDragonGold(option.lockedInDragonGold) : <></>}</></>:
                    ballot.status == "open"?
                        <VoteButton>{option.title}</VoteButton>:
                        <><VoteButton disabled>{option.title}</VoteButton><>{"isWinner" in option && option.isWinner? "this option won with " : <></>}</><>{"lockedInDragonGold" in option ? renderDragonGold(option.lockedInDragonGold) : <></>}</></>
                        }
                 <BallotOptionText>{option.description}</BallotOptionText>              
            </BallotOption>
        ))}
        
    </BallotContainer>

const GoverncanceVotingWidget = ({ userInfo }: { userInfo?: UserInfo }) => {

    const { governanceState, governanceBallots } = useSelector((state: AccountState) => ({
        governanceState: state.governanceState,
        governanceBallots: state.governanceBallots,
    }))
    useEffect(() => {
        userInfo ? AccountTransitions.getUserOpenBallots() : AccountTransitions.getOpenBallots()
    }, [userInfo])
    const ballotArray = Object.values(governanceBallots)

    return <>
        <VotingPower>{userInfo ? renderDragonGold(userInfo.dragonGold) : <>0</>} $DG Voting Power</VotingPower>
        <BallotsWrapper>
            {ballotArray.map(ballot =>
                <BallotView key={ballot.id} userInfo={userInfo} ballot={ballot} />
                /*
                    return (
                        <div key={ballotId}>
                            <hr />
                            <h3>{ballot.inquiry}</h3>
                            <p>{ballot.descriptionOfInquiry}</p>
                            {ballot.options.map((option, index) => (
                                <div key={index}>
                                    <p>Option: {option.option} Description: {option.description}</p>
                                    {userInfo && !ballot.voteRegistered ? <button onClick={() => AccountTransitions.voteForBallot(ballot.id, index.toString())}>Vote!</button> : <></>}
                                </div>
                            ))}
                            <p>Ballot State: {ballot.state}</p>
                        </div>
                    )
                })*/
            )}
        </BallotsWrapper>
    </>
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
const DashboardWideCardContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;

    @media only screen and (max-width: 1400px) {
        flex-direction: column;
        align-items: center;
    }
`
const WideDashboardCardContainer = styled(DashboardCardContainer)`
    width: 90%;
    color: white;
    box-shadow: none;
    border: none;
    @media only screen and (max-width: 1400px) {
        width: 100%;
    }
`
const WideDashboardCard = (props: { children?: ReactNode, title: string }) => (
    <WideDashboardCardContainer>
        <DashboardCardTitle>{props.title}</DashboardCardTitle>
        <DashboardCardContent>{props.children}</DashboardCardContent>
    </WideDashboardCardContainer>
)

const DashboardViewContent = () => {
    const userInfo = useSelector((state: AccountState) => state.userInfo)
    return <>
        {userInfo ? (
                <DashboardContainer>
                    <DashboardCard key="dragon-silver-widget" title="Dragon Silver">
                        <DragonSilverWidget {...userInfo} />
                    </DashboardCard>
                    <DashboardCard key="wallet-authentication-widget" title="Associated Wallets">
                        <WalletAssociationWidget {...userInfo} />
                    </DashboardCard>
                </DashboardContainer>
            ) : null}
            <DashboardWideCardContainer>
                <WideDashboardCard key="governance-voting-widget" title="Governance">
                    <GoverncanceVotingWidget userInfo={userInfo} />
                </WideDashboardCard >
            </DashboardWideCardContainer>
        </>
}

export const DashboardView = () => 
    <Provider store={accountStore}>
        <DashboardViewContent />
    </Provider>
