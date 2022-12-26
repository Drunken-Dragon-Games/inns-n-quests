import { Card, ArrowForward, ArrowBackward, CardPlaceHolder } from "../basic_components"
import styled from "styled-components"
import { useGetRandomNumber, useCurrentCard } from "../../hooks"
import { useState, useEffect } from "react"
import { useGeneralDispatch, useGeneralSelector } from "../../../../../features/hooks"
import { selectGeneralReducer } from '../../../../../features/generalReducer'
import { setSelected } from "../../features/explorerOfThiolden"
import { LinkDisable, Button } from "../../../../utils/components/basic_components"

const CardSectionWrapper = styled.div`
    width: 100%;
    height: 110vw;
    position: relative;
    overflow: hidden;
`

const ArrowWrapper = styled.div`
    display: flex;
    position: relative;
    width: 100%;
    height: 10vw;
`

const ArrowForwardWrapper = styled.div`
    position: absolute;
    right: 25vw;
`

const ArrowBackwardWrapper = styled.div`
    position: absolute;
    left: 15vw;
`

const ButtonMintPosition = styled.div`
    margin: 2vw 0vw 10vw 0vw;
    display: flex;
`

const Center = styled.div`
    margin: auto;
`
interface CardArray {
    Adventurer: string
    athleticism: number
    charisma: number
    image: string
    intellect: number
    tokenNumber: number
    uuid: string
}

const CardSectionMobile = () =>{

    const generalDispatch = useGeneralDispatch()
    const generalSelector = useGeneralSelector(selectGeneralReducer)
    
    const dataArray= generalSelector.exploreOfThioldenReducer.data.data
        
    const randomIndex = useGetRandomNumber(0, dataArray)
    
    const [movement, setMovement] = useState<string>("idle")
    const [ radomNumber, setRandomNumber] =useState(randomIndex)
    const [displayedArray] = useCurrentCard(dataArray, radomNumber)
    
    useEffect(() => {
        setMovement("idle")
        generalDispatch(setSelected(radomNumber))
    }, [radomNumber ])

      
    useEffect(() => {
        setRandomNumber(randomIndex)
        
    }, [randomIndex ])
    

    const randomNumber = (number: number) =>{
        if(number < 0){
            setRandomNumber((dataArray.length-1))
        } else if( number > (dataArray.length-1)){
            setRandomNumber(0)
        }   else{
            setRandomNumber(number)
        }
    }


    return (<>
            <CardSectionWrapper>
            {displayedArray.length > 0 
                ?
                displayedArray.map((el : CardArray, index: number)=>{
                    return <Card mobile = {true} src ={el.image} index = {index}  movement={movement} key ={el.uuid}/>})
                : <>
                    <CardPlaceHolder index={0} mobile={true}/>
                    <CardPlaceHolder index={1} mobile={true}/>
                    <CardPlaceHolder index={2}  mobile={true}/>
                    <CardPlaceHolder index={3}  mobile={true}/>
                    <CardPlaceHolder index={4}  mobile={true}/>
                    <CardPlaceHolder index={5}  mobile={true}/>
                    <CardPlaceHolder index={6}  mobile={true}/>
                </>}
            </CardSectionWrapper>

            <ButtonMintPosition>
                <Center>
                    <LinkDisable url = "https://www.jpg.store/collection/drunkendragon?tab=minting " openExternal ={true}>
                        <Button action = { ()=> null} size="big">MINT NOW!</Button>
                    </LinkDisable>
                </Center>
            </ButtonMintPosition>
            

            <ArrowWrapper>
                <ArrowForwardWrapper>
                    <ArrowForward clickAble = {displayedArray.length > 0} onClick={() => {setMovement("left"); randomNumber(radomNumber + 1)}}/>
                </ArrowForwardWrapper>
               <ArrowBackwardWrapper>
                    <ArrowBackward clickAble = {displayedArray.length > 0} onClick={() => {setMovement("right"); randomNumber(radomNumber - 1)}}/> 
               </ArrowBackwardWrapper>
                
            </ArrowWrapper>
    </>)
}

export default CardSectionMobile