import { useMemo, useState } from "react"
import styled from "styled-components"
import { Adventurer, AdventurerCollection, mapQuestScroll, SelectedQuest, TakenQuest, takenQuestTimeLeft } from "../../dsl"
import { InventoryItem } from "../../dsl/inventory"
import { PixelArtImage, vmax } from "../../utils"
import AdventurerSprite from "../adventurer-card/adventurer-sprite"
import InventoryBox from "./inventory-box"

const InventoryBrowserContainer = styled.div`
    box-sizing: border-box;
    margin: 0.5vmax;
    padding-left: 0.5vmax;
    height: calc(100% - 1vmax);
    width: 36vw;
    
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

const ItemBoxWrapper = styled.div<{ collection: AdventurerCollection }>`
`

type InventoryItemViewState = [string | undefined, boolean | undefined, boolean | undefined]

const useInventoryItemViewState = (props: InventoryItemViewProps): InventoryItemViewState => {
    const [info, selected, disabled] = useMemo(() => {
        const item = props.item
        if (item && item.ctype === "adventurer") {
            return [
                // info
                `${item.realATH}/${item.realINT}/${item.realCHA}`,
                // selected
                props.adventurerSlots?.some((a) => a && a.adventurerId === item.adventurerId) ||
                props.selectedAdventurer?.adventurerId === item.adventurerId,
                // disabled
                props.selectedQuest && 
                props.selectedQuest.ctype === "available-quest" && 
                item.inChallenge
            ]
        } else if (item && item.ctype === "taken-quest") {
            return [
                // info
                "", //takenQuestTimeLeft(item), We actially dont want to memo this one
                // selected
                props.selectedQuest &&
                props.selectedQuest.ctype === "taken-quest" &&
                props.selectedQuest.takenQuestId === item.takenQuestId,
                // disabled
                false
            ]
        } else {
            return [undefined, undefined, undefined]
        }
    }, [props.item, props.selectedQuest, props.adventurerSlots, props.selectedAdventurer])
    // Calculate the time left for the quest every time we render
    const timerInfo = props.item && props.item.ctype === "taken-quest" ? takenQuestTimeLeft(props.item) : info
    return [timerInfo, selected, disabled]
}

interface InventoryItemViewProps {
    item?: InventoryItem,
    adventurerSlots?: (Adventurer | null)[],
    selectedQuest?: SelectedQuest,
    selectedAdventurer?: Adventurer,
    onItemClick?: (item: InventoryItem) => void
}

const InventoryItemView = (props: InventoryItemViewProps) => {
    const [hover, setHover] = useState(false)
    const [info, selected, disabled] = useInventoryItemViewState(props)
    return (
        <ItemBox
            onClick={() => !disabled && props.onItemClick && props.item && props.onItemClick(props.item)}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            selected={selected}
            disabled={disabled}
            hover={hover}
            empty={!props.item}
            info={info}
        > { 
        props.item?.ctype === "adventurer" ? 
            <AdventurerSprite
                adventurer={props.item}
                emoji={hover ? props.item.adventurerId : undefined}
                units={vmax(0.7)}
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
                        selectedQuest={props.selectedQuest}
                        onItemClick={props.onItemClick} 
                    />
                )}
                {props.takenQuests.map((item) => 
                    <InventoryItemView 
                        key={item.takenQuestId} 
                        item={item} 
                        adventurerSlots={props.adventurerSlots}
                        selectedAdventurer={props.selectedAdventurer}
                        selectedQuest={props.selectedQuest}
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