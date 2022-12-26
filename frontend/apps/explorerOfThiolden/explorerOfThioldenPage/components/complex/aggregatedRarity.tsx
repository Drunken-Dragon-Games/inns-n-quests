import styled from "styled-components"
import Image from "next/image"
import { TextElMessiri } from "../basic_components"
import RarityColumn from "../basic_components/rarityColumn"
import RaritySlot from "../basic_components/raritySlot"
import { useGetRarity } from "../../hooks"
// import { selectGeneralStateReducer } from "../../features/generalState"
import { useSelector } from "react-redux"
// import all-adv-info from "../../data/all-adv-info"
import { useGeneralSelector } from "../../../../../features/hooks"
import { selectGeneralReducer } from "../../../../../features/generalReducer"

const AgregatedRarityContainer = styled.div`
    width: 17.5vw;
    height: auto;
    @media only screen and (max-width: 414px) {
        padding: 0vw 15vw;
        width: 100%;    }
`

const HeaderWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-bottom: 0.521vw;
    @media only screen and (max-width: 414px) {
        width: 100%;    
        margin-bottom: 5vw;
    }
`

const ColumnsWrapper = styled.div`
    display: flex;
    @media only screen and (max-width: 414px) {
        flex-direction: column;
    }  
`

const TitleWrapper = styled.div`
    @media only screen and (max-width: 414px) {
        margin-bottom: 3vw;
    }  
`


const AggregatedRarity =() =>{

    const generalSelector = useGeneralSelector(selectGeneralReducer)
    
    const rarities = useGetRarity(generalSelector.exploreOfThioldenReducer.data.data)
    
    return(<>
        <AgregatedRarityContainer>
            <HeaderWrapper>
                <TitleWrapper>
                    <TextElMessiri textAlign="center" fontsize={1.302} color={"#ffffff"} fontsizeMobile={5}  lineHeightMobil ={5.2}>Aggregated Rarity</TextElMessiri>
                </TitleWrapper>
                <Image src="https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/s2Explorer/rarities/golden_line.svg"
                       alt = "card drunken dragon"   
                       layout = "responsive" 
                       width={11.310} 
                       height={0.457}></Image>
            </HeaderWrapper>
            {rarities   !== null
            
                ?

                     <ColumnsWrapper>
                        <RarityColumn columnName='Faction' iconSrc='https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/s2Explorer/rarities/faction.svg'>
                            <RaritySlot name='Vilnay' amount={rarities.factionRarity.vilnay.percentage} src='https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/s2Explorer/rarities/nurmyr_1.svg'></RaritySlot>
                            <RaritySlot name='Auristar' amount={rarities.factionRarity.auristar.percentage} src='https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/s2Explorer/rarities/auristar.svg'></RaritySlot>
                            <RaritySlot name='Kullmyr' amount={rarities.factionRarity.kullmyr.percentage} src='https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/s2Explorer/rarities/kullmyr.svg'></RaritySlot>
                            <RaritySlot name='Jaggermyr' amount={rarities.factionRarity.jagermyr.percentage} src='https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/s2Explorer/rarities/jaggermyr.svg'></RaritySlot>
                            <RaritySlot name='Nurmyr' amount={rarities.factionRarity.nurmyr.percentage} src='https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/s2Explorer/rarities/nurmyr_2.svg'></RaritySlot>
                            <RaritySlot name='Adv. East' amount={rarities.factionRarity.advofeast.percentage} src='https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/s2Explorer/rarities/adveast.svg'></RaritySlot>
                            <RaritySlot name='Dead Queen' amount={rarities.factionRarity.deadqueen.percentage} src='https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/s2Explorer/rarities/dead_queen.svg'></RaritySlot>
                            <RaritySlot name='Drunken Dragon' amount={rarities.factionRarity.drunkendragon.percentage} src='https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/s2Explorer/rarities/drunken_faction.svg'></RaritySlot>
                        </RarityColumn>
                        <RarityColumn columnName='APS Material' iconSrc='https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/s2Explorer/rarities/aps.svg'>
                            <RaritySlot name='Bronze' amount={rarities.materialRarety.bronze.percentage} src='https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/s2Explorer/rarities/bronze.svg'></RaritySlot>
                            <RaritySlot name='Silver' amount={rarities.materialRarety.silver.percentage} src='https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/s2Explorer/rarities/silver.svg'></RaritySlot>
                            <RaritySlot name='Gold' amount={rarities.materialRarety.gold.percentage} src='https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/s2Explorer/rarities/gold.svg'></RaritySlot>
                            <RaritySlot name='Diamond' amount={rarities.materialRarety.diamond.percentage} src='https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/s2Explorer/rarities/diamond.svg'></RaritySlot>
                            <RaritySlot name='Myrthrill' amount={rarities.materialRarety.myrthrill.percentage} src='https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/s2Explorer/rarities/myrthrill.svg'></RaritySlot>
                            <RaritySlot name='Drunken Dragon' amount={rarities.materialRarety.drunkendragon.percentage} src='https://d1f9hywwzs4bxo.cloudfront.net/modules/ddu-app/s2Explorer/rarities/drunken.svg'></RaritySlot>
                        </RarityColumn>
                    </ColumnsWrapper>
                : null
                }
    
        </AgregatedRarityContainer>
    </>)
}

export default AggregatedRarity