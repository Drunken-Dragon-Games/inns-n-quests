import styled from "styled-components"
import { 
    Card, 
    ArrowForward, 
    ArrowBackward, 
    CardPlaceHolder, 
    SocialMedia } from "../basic_components"
import { useEffect, useState } from "react"
import { useCurrentCard, useGetRandomNumber, useKeyPress } from "../../hooks"
import { setSelected } from "../../features/explorerOfThiolden"
import { useGeneralDispatch, useGeneralSelector } from "../../../../../features/hooks"
import { selectGeneralReducer } from '../../../../../features/generalReducer'
import { ConditionalRender } from "../../../../utils/components/basic_components"

const CardSectionComponent = styled.section`
    width: 48.958vw;
    height: 50.250vw;
    position: relative;
    overflow: hidden;
    min-width:  48.958vw;
`

const ArrowContainerPosition = styled.div`
    position: absolute;
    right: 3vw;
    top: 15vw;
`

const ArrowsContainer = styled.div`
    position: relative;
    height: 2.053vw;
    width: 31.958vw;
    margin-top: 4vw;
    z-index: 7;
`

const ArrowsForwardWrapper = styled.div`
    position: absolute;
    top: 0vw;
    right: -2vw;
    width: 2.203vw;
    height: 2.053vw;
`

const ArrowsBackwardWrapper = styled.div`
    position: absolute;
    bottom: 0vw;
    width: 2.203vw;
    height: 2.053vw;
`
const SocialMediaPosition = styled.div`
    position: absolute;
    width: 4vw;
    right: 0vw;
    top: 12vw;
    z-index: 7;
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

interface CardSection{
    dataArray: CardArray []
}

const CardSection =() =>{

    const generalDispatch = useGeneralDispatch()
    const generalSelector = useGeneralSelector(selectGeneralReducer)
        

    const dataArray= generalSelector.exploreOfThioldenReducer.data.data
    
    const randomIndex = useGetRandomNumber(0, dataArray)
    
    const [movement, setMovement] = useState<string>("idle")
    const [ radomNumber, setRandomNumber] =useState(randomIndex)
    const [displayedArray] = useCurrentCard(dataArray, radomNumber)

    const leftPress = useKeyPress("ArrowLeft");
    const rightPress = useKeyPress("ArrowRight");
    


    useEffect(() => {
        setMovement("idle")
        generalDispatch(setSelected(radomNumber))
    }, [radomNumber ])

      
    useEffect(() => {
        setRandomNumber(randomIndex)
        
    }, [randomIndex ])
    

    useEffect(() => {
        if(leftPress == true){
            randomNumber(radomNumber - 1)
        }
    },[leftPress])

    useEffect(() => {
        if(rightPress == true){
            randomNumber(radomNumber + 1)
        }
    },[rightPress])

    const randomNumber = (number: number) =>{
        if(number < 0){
            setRandomNumber((dataArray.length-1))
        } else if( number > (dataArray.length-1)){
            setRandomNumber(0)
        }   else{
            setRandomNumber(number)
        }
    }


    return(<>


        <CardSectionComponent>
        
                <ArrowContainerPosition>

                    <ArrowsContainer>

                        <ArrowsForwardWrapper>
                            <ArrowForward clickAble = {displayedArray.length > 0} onClick={() => {setMovement("left"); randomNumber(radomNumber + 1)}}/>
                        </ArrowsForwardWrapper>

                        <ArrowsBackwardWrapper>
                            <ArrowBackward clickAble = {displayedArray.length > 0} onClick={() => {setMovement("right"); randomNumber(radomNumber - 1)}}/>    
                        </ArrowsBackwardWrapper>

                    </ArrowsContainer>

                </ArrowContainerPosition>
                
                <SocialMediaPosition>
                    <SocialMedia/>
                </SocialMediaPosition>
            
                <ConditionalRender condition={displayedArray.length > 0 }>
                    {
                        displayedArray.map((el: CardArray, index: number) => {
                            return  <Card mobile = {false} src ={el.image} index = {index} movement={movement} key ={el.uuid}/>
                            })
                    }
                </ConditionalRender>

                <ConditionalRender condition={displayedArray.length == 0 }>
                    <CardPlaceHolder index={0} mobile={false}/>
                    <CardPlaceHolder index={1}  mobile={false}/>
                    <CardPlaceHolder index={2}  mobile={false}/>
                    <CardPlaceHolder index={3}  mobile={false}/>
                    <CardPlaceHolder index={4}  mobile={false}/>
                    <CardPlaceHolder index={5}  mobile={false}/>
                    <CardPlaceHolder index={6}  mobile={false}/>
                </ConditionalRender>

        </CardSectionComponent>
    </>)
}

export default CardSection