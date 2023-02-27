import { useMemo, useState } from "react"
import styled from "styled-components"
import { AdventurerSprite, FurnitureSprite } from "../../../common-components"
import {
    Adventurer, takenQuestTimeLeft
} from "../../../dsl"
import { notEmpty, PixelArtImage, useDrag, vmax } from "../../../utils"
import { DraggableItem, InventoryItem, InventorySelection, isDraggableItem, mapQuestScroll } from "../inventory-dsl"
import { InventoryState } from "../inventory-state"
import InventoryBox from "./inventory-box"

const InventoryPageContainer = styled.div`
    box-sizing: border-box;
    margin: 0.5vmax;
    padding-left: 0.5vmax;
    height: calc(100% - 1vmax);
    width: 100%;
    
    direction: rtl;
    overflow-x: hidden;
    overflow-y: scroll;

    ::-webkit-scrollbar {
        width: 0.4vw; 
      }
      
    /* Track */
    ::-webkit-scrollbar-track {
        background: #495362;
        background-clip: padding-box;
        border-left: 0.1vw solid transparent;
        border-right: 0.1vw solid transparent;
    }
       
    /* Handle */
    ::-webkit-scrollbar-thumb {
        background: rgba(0, 0, 0, 0);
        border-top: 0.3vw solid rgba(0, 0, 0, 0);
        border-right: 0.5vw  solid #8A8780;
        border-bottom: 0.3vw  solid rgba(0, 0, 0, 0);;
        border-left: 0.5vw  solid #8A8780;
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

    width: 100%;
    gap: 0.5vmax;

`

const ItemBox = styled(InventoryBox)`
    position: relative;
    width: 8vmax;
    height: 8vmax;
`

type InventoryItemViewState = {
    info?: string
    selected?: boolean
    disabled?: boolean
    center?: boolean
    overflowHidden?: boolean
}

const useInventoryItemViewState = (props: InventoryItemViewProps): InventoryItemViewState => {
    const state = useMemo(() => {
        const item = props.item
        if (item && item.ctype === "adventurer") {
            return {
                info: `${item.realATH}/${item.realINT}/${item.realCHA}`,
                selected:
                    props.selectedParty?.some((a) => a && a.adventurerId === item.adventurerId) ||
                    props.selection?.ctype === "adventurer" &&
                    props.selection?.adventurerId === item.adventurerId,
                disabled:
                    props.selection && 
                    props.selection.ctype === "available-quest" && 
                    item.inChallenge,
                center: false,
                overflowHidden: false,
            }
        } else if (item && item.ctype === "taken-quest") {
            return {
                info: "", //takenQuestTimeLeft(item), We actially dont want to memo this one
                selected:
                    props.selection &&
                    props.selection.ctype === "taken-quest" &&
                    props.selection.takenQuestId === item.takenQuestId,
                disabled: false,
                center: true,
                overflowHidden: false,
            }
        } else if (item && item.ctype === "furniture") {
            return {
                info: "",
                selected:
                    props.selection &&
                    props.selection.ctype === "furniture" &&
                    props.selection.furnitureId === item.furnitureId,
                disabled: false,
                center: false,
                overflowHidden: true,
            }
        } else return {}
    }, [props.item, props.selection, props.selectedParty])
    // Calculate the time left for the quest every time we render
    return props.item && props.item.ctype === "taken-quest" 
        ? {...state, info: takenQuestTimeLeft(props.item) } 
        : state
}

interface InventoryItemViewProps {
    item?: InventoryItem,
    selectedParty?: (Adventurer | null)[],
    selection?: InventorySelection,
    onItemClick: (item: InventoryItem) => void
    onItemDrag: (item: DraggableItem, position: [number, number]) => void
    onItemDragEnd: (item: DraggableItem) => void
}

const InventoryItemView = (props: InventoryItemViewProps) => {
    const [hover, setHover] = useState(false)
    const state = useInventoryItemViewState(props)
    const { vector, onStartDrag } = useDrag({
        onDrag: (position) => 
            isDraggableItem(props.item) && props.onItemDrag(props.item, position),
        onDrop: () => 
            isDraggableItem(props.item) && props.onItemDragEnd(props.item),
    })
    const effectiveDragging = 
        isDraggableItem(props.item) &&
        notEmpty(vector) && 
        (Math.abs(vector[0]) > 20 || Math.abs(vector[1]) > 20)
    return (
        <ItemBox
            //onClick={() => !state.disabled && props.onItemClick && props.item && props.onItemClick(props.item)}
            onMouseUp={() => !state.disabled && !effectiveDragging && props.onItemClick && props.item && props.onItemClick(props.item)}
            onMouseDown={onStartDrag}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            selected={state.selected}
            disabled={state.disabled || effectiveDragging}
            center={state.center}
            hover={hover}
            empty={!props.item}
            info={state.info}
            overflowHidden={state.overflowHidden}
        > 
        { props.item?.ctype === "adventurer" ? 
            <AdventurerSprite
                adventurer={props.item}
                emoji={hover ? props.item.adventurerId : undefined}
                units={vmax(0.8)}
            /> 
        : props.item?.ctype === "taken-quest" ? 
            <PixelArtImage
                src={mapQuestScroll(props.item)}
                alt="quest scroll"
                width={7.3} height={6}
            /> 
        : props.item?.ctype === "furniture" ? 
            <FurnitureSprite
                furniture={props.item}
                units={vmax(0.8)}
            /> :
        <></> } 
        </ItemBox>
    )
}

const useInventoryPageState = (state: InventoryState, page: PageName) => 
    useMemo(() => {
        const items = 
            page == "adventurers" ? state.adventurers :
            page == "furniture" ? state.furniture
            : state.takenQuests
        const slotsTail = items.length % 4
        const extraSlots = slotsTail === 0 ? 4 : 4 - slotsTail
        const amountIfWithExtraSlots = items.length + extraSlots
        const amountIfWithoutExtraSlots = (4 * 8) -items.length 
        const totalExtraSlots = amountIfWithExtraSlots >= 4 * 8 ? extraSlots : amountIfWithoutExtraSlots
        const extraSlotsArray = Array(totalExtraSlots).fill(0)
        return [items, extraSlotsArray]
    }, [state.adventurers, state.takenQuests, page])

export type PageName = "adventurers" | "taken-quests" | "furniture"

interface InventoryPageProps {
    className?: string,
    inventoryState: InventoryState,
    page?: PageName
    onItemClick: (item: InventoryItem) => void
    onItemDrag: (item: DraggableItem, position: [number, number]) => void
    onItemDragEnd: (item: DraggableItem) => void
}

const InventoryPage = ({ className, inventoryState, page = "adventurers", onItemClick, onItemDrag, onItemDragEnd }: InventoryPageProps) => {
    const [items, extraSlotsArray] = useInventoryPageState(inventoryState, page)
    return (
        <InventoryPageContainer className={className}>
            <DirectionFix>
                {items.map((item, index) =>
                    <InventoryItemView
                        key={index}
                        item={item}
                        selectedParty={inventoryState.selectedParty}
                        selection={inventoryState.selection}
                        onItemClick={onItemClick}
                        onItemDrag={onItemDrag}
                        onItemDragEnd={onItemDragEnd}
                    />
                )}
                {extraSlotsArray.map((_, i) => 
                    <InventoryItemView 
                        key={i} 
                        onItemClick={onItemClick}
                        onItemDrag={onItemDrag}
                        onItemDragEnd={onItemDragEnd}
                    />
                )}
            </DirectionFix>
        </InventoryPageContainer>
    )
}

export default InventoryPage