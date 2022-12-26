import styled from "styled-components"
import Image from "next/image"
import { useGetEmoji } from "../../hooks"

const EmojiWrapper = styled.div`
    position: relative;
    width: 2.2vw;
    height: 1.8vw;
`

const BubleEmoji= styled.div`
    position: absolute;

    img{
        width: 2.2vw !important;
        height: 1.8vw !important;
        image-rendering: -moz-crisp-edges;
        image-rendering: -webkit-crisp-edges;
        image-rendering: pixelated;
        image-rendering: crisp-edges;
    }
`
const EmojiImg = styled.div`
    position: absolute;
    left: 0.43vw;
    top: 0.1vw;

    img{
        width: 1.3vw !important;
        height: 1.3vw !important;
        image-rendering: -moz-crisp-edges;
        image-rendering: -webkit-crisp-edges;
        image-rendering: pixelated;
        image-rendering: crisp-edges;
    }
`
interface emoji{
    questStatus: "failed" | "succeeded" | null
    isAdventureDead:boolean
    type: string
}
const Emoji = ({questStatus, isAdventureDead, type}:emoji) =>{


    // regresa el numero o nombre de emoji necesario
    const emojiImg = useGetEmoji(questStatus, isAdventureDead, type)

    return(<>
  
        <EmojiWrapper>
            <BubleEmoji>
                <Image src= "https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/emoji/buble_emoji.webp"  alt="emoji buble" width={2000} height={1250} />
            </BubleEmoji>

            <EmojiImg>
                <Image src= {`https://d1f9hywwzs4bxo.cloudfront.net/modules/quests/emoji/emoji_${emojiImg}.webp`} alt="emoji" width={2000} height={1250} />
            </EmojiImg>
        </EmojiWrapper>

    </>)
}

export default Emoji