import { useMemo, useState } from "react"
import styled from "styled-components"
import { PixelArtImage } from "../../../utils"
import { Adventurer, mapQuestScroll, TakenQuest, takenQuestTimeLeft } from "../../dsl"
import { InventoryItem, itemId } from "../../dsl/inventory"
import AdventurerSprite from "../adventurer-card/adventurer-sprite"
import InventoryBox from "./inventory-box"

const InventoryBrowserContainer = styled.div`
    padding: 0.5vmax;
    
    direction: rtl;
    overflow-x: hidden;
    overflow-y: scroll;

    ::-webkit-scrollbar {
        width: 0.4vmax; 
      }
      
    /* Track */
    ::-webkit-scrollbar-track {
        background: #495362;
        background-clip: padding-box;
        border-left: 0.1vmax solid transparent;
        border-right: 0.1vmax solid transparent;
    }
       
    /* Handle */
    ::-webkit-scrollbar-thumb {
        background: rgba(0, 0, 0, 0);
        border-top: 0.3vmax solid rgba(0, 0, 0, 0);
        border-right: 0.5vmax  solid #8A8780;
        border-bottom: 0.3vmax  solid rgba(0, 0, 0, 0);;
        border-left: 0.5vmax  solid #8A8780;
    }
      
    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
        background: #585652; 
    }
`

const DirectionFix = styled.div`
    direction: ltr;

    display: inline-flex;
    flex-wrap: wrap;

    width: 35vmax;
    gap: 0.5vmax;

`

const ItemBox = styled(InventoryBox)`
    width: 8vmax;
    height: 8vmax;
`

const InventoryItemView = (props: { item?: InventoryItem, onItemClick?: (item: InventoryItem) => void }) => {
    const [hover, setHover] = useState(false)
    const info = useMemo(() => {
        if (props.item?.ctype === "adventurer") {
            return `${props.item.athleticism}/${props.item.intellect}/${props.item.charisma}`
        } else if (props.item?.ctype === "taken-quest") {
            return takenQuestTimeLeft(props.item)
        } else {
            return undefined
        }
    }, [props.item])
    return (
        <ItemBox
            onClick={() => props.onItemClick && props.item && props.onItemClick(props.item)}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            selected={props.item && hover}
            hover={hover}
            empty={!props.item}
            info={info}
        > { 
            props.item?.ctype === "adventurer" ? 
                <AdventurerSprite
                    adventurer={props.item}
                    emoji={hover ? props.item.adventurerId : undefined}
                    scale={0.7}
                /> :
            props.item?.ctype === "taken-quest" ? 
                <PixelArtImage
                    src={mapQuestScroll(props.item)}
                    alt="quest scroll"
                    width={7.3} height={6}
                /> :
            <></>
        } </ItemBox>
    )
}

interface InventoryBrowserProps {
    inventory: InventoryItem[]
    onItemClick?: (item: InventoryItem) => void
}

const InventoryBrowser = ({ inventory, onItemClick }: InventoryBrowserProps) => {
    return (
        <InventoryBrowserContainer>
            <DirectionFix>
                {inventory.map((item) => (
                    <InventoryItemView item={item} onItemClick={onItemClick} />
                ))}
                <InventoryItemView />
                <InventoryItemView />
                <InventoryItemView />
                <InventoryItemView />
                <InventoryItemView />
                <InventoryItemView />
                <InventoryItemView />
                <InventoryItemView />
                <InventoryItemView />
            </DirectionFix>
        </InventoryBrowserContainer>
    )
}

export default InventoryBrowser