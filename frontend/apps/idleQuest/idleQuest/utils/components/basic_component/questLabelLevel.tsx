import styled from "styled-components"
import Image from "next/image"


interface questLabelLevel {
    children: string
}


const LabelComponent = styled.div`
    position: relative;
    width: 3.5vw;
    height: 3vw;

`

const LabelWrapper = styled.div`
    width: inherit;
    height: inherit;
    position: absolute;
`

const TextWrapper = styled.div`
    position: absolute;
    width: inherit;
    height: inherit;
`

const LabelText = styled.div`

    p{
        font-family: VT323;
        font-size: 0.8vw;
        color: #FDE395;
        line-height: 1.2vw;
        font-weight: 100;
        text-transform: uppercase;
        text-align: center;
    }
`

const LabelTextLevel = styled.div`

    p{
        font-family: VT323;
        font-size: 1.5vw;
        color: #FDE395;
        line-height: 1.2vw;
        font-weight: 100;
        text-transform: uppercase;
        text-align: center;
    }
`



const QuestLabelLevel = ({children}: questLabelLevel) => {
    return (<>
            <LabelComponent>
                <LabelWrapper>
                    <Image 
                        src= "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/questPaper/label.svg" 
                        width={1300} 
                        height={1000} 
                        layout = "responsive" 
                        alt="Label level drunken dragon"/>
                </LabelWrapper>

                <TextWrapper>
                    <LabelText><p>Level</p></LabelText>
                    <LabelTextLevel><p>{children}</p></LabelTextLevel>
                </TextWrapper>
                
            </LabelComponent>
    </>)
}

export default QuestLabelLevel