import { useEffect, useState } from "react"
import styled from "styled-components"
import { CrispPixelArtImage, notEmpty } from "../../../../../../utils"
import { Adventurer, EmojiName } from "../../../../../dsl"
import { AdventurerSprite } from "../../../../utils/components/basic_component"
import AdventurerCard from "../complex/adventurer-card"

const AdventurerSlotContainer = styled.div<{ interactuable: boolean }>`
    height: 8vw;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    ${props => props.interactuable ? `cursor: pointer;` : ``}
`

const EmptySlotContainer = styled.div`
    width: 2.3vw;
    height: 2.3vw;
    position: absolute;
`

const EmptySlot = () =>
    <EmptySlotContainer>
        <CrispPixelArtImage
            src="https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/questPaper/dropbox.png"
            alt="adventurer slot in quest"
            width={100}
            height={100}
            layout="responsive"
        />
    </EmptySlotContainer>

/*
const AdventurerWrapper = styled.div`
    display: flex;
    height: inherit;
    width: inherit;
    flex-direction: column;
    align-items: center;
`

const EmojiContainer = styled.div`
    position: absolute;
    margin-top: -2vh;
    z-index: 5;
    width: 1.8vw;
    height: 1.5vw;
`

const StyledAdventurerSprite = styled(AdventurerSprite)`
    margin-top: auto;
`

const Emoji = ({ emoji }: { emoji?: EmojiName }) => {
    const image = (() => {
        switch (emoji) {
            case "over-confident": return "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/mood/over_confident.webp"
            case "confident": return "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/mood/confident.webp"
            case "insecure": return "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/mood/insecure.webp"
            case "fearful": return "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/mood/fearful.webp"
            case "panicking": return "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/mood/panicking.webp"
            case "terrified": return "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/mood/terrified.webp"
            default: return "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/questPaper/close_icon.png"
        }
    })()
    return notEmpty(emoji) ?
        <EmojiContainer>
            <CrispPixelArtImage
                src={image}
                alt="adventurer emoji bubble"
                width={1.8}
                height={1.5}
                layout="responsive"
            />
        </EmojiContainer>
    : <></>
}
*/

interface AdventurerSlotProps {
    className?: string,
    adventurer: Adventurer | null,
    emoji?: EmojiName,
    onUnselectAdventurer?: (adventurer: Adventurer) => void
}

const AdventurerSlot = ({ className, adventurer, emoji, onUnselectAdventurer }: AdventurerSlotProps) => {
    const [hovering, setHovering] = useState<boolean>(false)
    const interactuable = notEmpty(onUnselectAdventurer) && notEmpty(adventurer)
    const displayedEmoji = interactuable && hovering ? "cross" : emoji
    const render = interactuable && hovering ? "hovered" : "normal"
    return (
        <AdventurerSlotContainer
            className={className}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            onClick={() => interactuable ? onUnselectAdventurer(adventurer) : null}
            interactuable={interactuable}
        >
            <EmptySlot />
            {interactuable ?
                <AdventurerCard
                    adventurer={adventurer}
                    emoji={displayedEmoji}
                    render={render}
                    displayAPS={true}
                />
            : <></> }
        </AdventurerSlotContainer>
    )

    /*
    const old = (
        <>
            <DropBoxElement 
                // ref={drop} 
                onMouseOver = {adventurerData.sprite != undefined ? () => setOnHover(true) : () => null} 
                onMouseLeave ={adventurerData.sprite != undefined ? () => setOnHover(false) : () => null}              
            >
                <ConditionalRender condition={adventurerData.sprite != undefined }>
                    <Center>
                        <AdventureWrapper>
                            <FeelingAnimationWrapper hover ={onHover}>
                                <Feelings level = {level} questLevel ={questLevel}/>
                            </FeelingAnimationWrapper>

                            <DeleteAnimationWrapper 
                                hover ={onHover} 
                                onClick = {() => {
                                    removeAdventurer(id!)
                                    setOnHover(false)
                                }}
                            >
                                <Image src= "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/questPaper/close_icon.png"  alt="fail mark image" width={2000} height={1250} />
                            </DeleteAnimationWrapper>

                            <AdventurerCenterWrapper>
                                <div>                                    
                                    <RescalingImg  
                                        src= {adventurerData.sprite}
                                        collection={adventurerData.collection} 
                                    />
                                </div>

                            </AdventurerCenterWrapper>
        
                        </AdventureWrapper>
                    </Center>
                </ConditionalRender>

                    <AdventurerSlotContainer>
                        <Flex>
                            <Image src= "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/dashboard/questPaper/dropbox.png"  alt="paper prop" width={2000} height={2000} layout="responsive" />
                        </Flex>
                    </AdventurerSlotContainer>

            </DropBoxElement>
        </>
    )
    */
}

export default AdventurerSlot