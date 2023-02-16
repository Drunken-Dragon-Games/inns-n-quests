import { useMemo, useState } from "react"
import styled from "styled-components"
import { PixelArtImage } from "../../../utils"
import { Adventurer, mapQuestScroll, SelectedQuest, TakenQuest, takenQuestTimeLeft } from "../../dsl"
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

type InventoryItemViewState = [string | undefined, boolean | undefined]

const useInventoryItemViewState = (props: InventoryItemViewProps): InventoryItemViewState => 
    useMemo(() => {
        const item = props.item
        if (item && item.ctype === "adventurer") {
            return [
                `${item.athleticism}/${item.intellect}/${item.charisma}`,
                props.adventurerSlots?.some((a) => a && a.adventurerId === item.adventurerId) ||
                props.selectedAdventurer?.adventurerId === item.adventurerId
            ]
        } else if (item && item.ctype === "taken-quest") {
            return [
                takenQuestTimeLeft(item),
                props.selectedQuest &&
                props.selectedQuest.ctype === "taken-quest" &&
                props.selectedQuest.takenQuestId === item.takenQuestId
            ]
        } else {
            return [undefined, undefined]
        }
    }, [props.item, props.selectedQuest, props.adventurerSlots, props.selectedAdventurer])

interface InventoryItemViewProps {
    item?: InventoryItem,
    adventurerSlots?: (Adventurer | null)[],
    selectedQuest?: SelectedQuest,
    selectedAdventurer?: Adventurer,
    onItemClick?: (item: InventoryItem) => void
}

const InventoryItemView = (props: InventoryItemViewProps) => {
    const [hover, setHover] = useState(false)
    const [info, selected] = useInventoryItemViewState(props)
    return (
        <ItemBox
            onClick={() => props.onItemClick && props.item && props.onItemClick(props.item)}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            selected={selected}
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
        <></> } </ItemBox>
    )
}

const useInventoryBrowserState = (props: InventoryBrowserProps) => 
    useMemo(() => {
        const itemsSum = props.adventurers.length + props.takenQuests.length
        const slotsTail = itemsSum % 4
        const extraSlots = slotsTail === 0 ? 4 : 4 - slotsTail
        const amountIfWithExtraSlots = itemsSum + extraSlots
        const amountIfWithoutExtraSlots = (4 * 8) - itemsSum
        const totalExtraSlots = amountIfWithExtraSlots >= 4 * 8 ? extraSlots : amountIfWithoutExtraSlots
        const extraSlotsArray = Array(totalExtraSlots).fill(0)
        return extraSlotsArray
    }, [props.adventurers, props.takenQuests])

interface InventoryBrowserProps {
    adventurers: Adventurer[],
    takenQuests: TakenQuest[],
    adventurerSlots: (Adventurer | null)[],
    selectedQuest?: SelectedQuest,
    selectedAdventurer?: Adventurer,
    onItemClick?: (item: InventoryItem) => void
}

const InventoryBrowser = (props: InventoryBrowserProps) => {
    const extraSlotsArray = useInventoryBrowserState(props)
    return (
        <InventoryBrowserContainer>
            <DirectionFix>
                {props.adventurers.map((item) => 
                    <InventoryItemView 
                        key={item.adventurerId} 
                        item={item} 
                        adventurerSlots={props.adventurerSlots}
                        selectedAdventurer={props.selectedAdventurer}
                        onItemClick={props.onItemClick} 
                    />
                )}
                {props.takenQuests.map((item) => 
                    <InventoryItemView 
                        key={item.takenQuestId} 
                        item={item} 
                        selectedQuest={props.selectedQuest}
                        adventurerSlots={props.adventurerSlots}
                        onItemClick={props.onItemClick} 
                    />
                )}
                {extraSlotsArray.map((_, i) => 
                    <InventoryItemView key={i} />
                )}
            </DirectionFix>
        </InventoryBrowserContainer>
    )
}

export default InventoryBrowser