import { v4 as uuidv4 } from 'uuid';
import { createSlice, PayloadAction } from '@reduxjs/toolkit'; 
import { combineReducers } from "redux";
import { axiosCustomInstance } from '../../../../../../axios/axiosApi'; 
import { createSliceStatus, actionsGenerator } from "../../../../../utils/features/utils"
import { generalReducerThunk } from '../../../../../../features/generalReducer';
import { AxiosError } from "axios"
import { setAdventuresInQuest } from '../../console/features/adventurers';
import { setAvailableQuestUnselect } from '../../../features/interfaceNavigation';
import { setAddInProgressQuest } from '../../inProgressQuests/features/inProgressQuest';
import { fetchRefreshToken } from '../../../../../../features/refresh';
import { AvailableQuestType } from '../../../../../../types/idleQuest';

//fetch para obeter los available quest si es la primera vez que se piden se realiza una peticion de 10 y posteriormente de 5 en 5 

export const getAvailableQuest = (firstTime? : boolean): generalReducerThunk => async (dispatch) =>{

    dispatch(setFetchGetAvailableQuestStatusPending())

    try { 

        const response = await axiosCustomInstance('/quests/api/quests').get('/quests/api/quests')
        dispatch(setFetchGetAvailableQuestStatusFulfilled())

        //dependiendo si es la primera vez o no que se piden los quest durante el renderizado
        if(firstTime == true){
            dispatch(setAvailableQuest(response.data))
        } else{
            dispatch(setNewExtraQuests(response.data))
        }     
        
    } catch (err: unknown) {
        
        if(err instanceof AxiosError ){
            dispatch(setFetchGetAvailableQuestStatusErrors(err.response))
            dispatch(fetchRefreshToken( () => dispatch(getAvailableQuest(firstTime)), err))
        }
    }

}


//reducer para monitorear el estado del request para los available quest 

const  fetchGetAvailableQuestStatus  = createSliceStatus("fetchGetAvailableQuestStatus")
const [ setFetchGetAvailableQuestStatusIdle, setFetchGetAvailableQuestStatusPending, setFetchGetAvailableQuestStatusFulfilled, setFetchGetAvailableQuestStatusErrors ] = actionsGenerator(fetchGetAvailableQuestStatus.actions)


//fetch para tomar a los available quests

export const takeAvailableQuest = (questId: string, adventurers: (string | undefined)  [], questUiidFront: string  ): generalReducerThunk  => async (dispatch) =>{

    dispatch(setFetchTakeAvailableQuestStatusPending())  

    //filtrar si en el array hay undefined

    const adventurers_id = adventurers.filter(originalElement => originalElement !== undefined)

    
    try {  

        //fetch para aceptar el quest
        const response = await axiosCustomInstance('/quests/api/accept').post('/quests/api/accept', {quest_id: questId, adventurer_ids: adventurers_id})

        // se agrega a los ques in progress
        dispatch(setAddInProgressQuest(response.data))
            
        //se agrega a los aventureros en el quest la propiedad de in_quest
        dispatch(setAdventuresInQuest(adventurers))

        //deseleciona al available quest
        dispatch(setAvailableQuestUnselect())

        // dispatch(setQuestTakenId(questUiidFront))
            
        dispatch(setFetchTakeAvailableQuestStatusFulfilled())

        dispatch(setTakenId(questUiidFront))
                    
    } catch (err: unknown) {

        if(err instanceof AxiosError ){
            dispatch(setFetchTakeAvailableQuestStatusErrors(err.response))
            dispatch(fetchRefreshToken( () => dispatch(takeAvailableQuest(questId, adventurers, questUiidFront)), err))
        }
    }

}

//reducer para monitorear el estado del request para los available quest 

const  fetchTakeAvailableQuestStatus  = createSliceStatus("fetchTakeAvailableQuestStatus")

const [ setFetchTakeAvailableQuestStatusIdle, setFetchTakeAvailableQuestStatusPending, setFetchTakeAvailableQuestStatusFulfilled, setFetchTakeAvailableQuestStatusErrors ] = actionsGenerator(fetchTakeAvailableQuestStatus.actions)


//reducer para manejar los cambios en los datos de availablequest

interface PositionType{
    width: number
    height: number
    uiid: string
}

interface AvailableInitialQuestType {
    availableQuest: AvailableQuestType []
    shownQuest: AvailableQuestType [] 
}

const initialStateAvailableQuest: AvailableInitialQuestType = {availableQuest: [], shownQuest: []}


const AddUuid = (quests: AvailableQuestType []): AvailableQuestType [] =>{

    quests.map((availableQuest) => {
        const uiid = uuidv4()
        availableQuest.uiid = uiid
    });

    return quests
}


const availableQuests = createSlice({
    name: "availableQuests",
    initialState: initialStateAvailableQuest,
    reducers: {

        setAvailableQuest:  (state, action: PayloadAction<AvailableQuestType[]>)=> {

            const questWithUuid = AddUuid(action.payload)

            state.availableQuest = questWithUuid
            state.shownQuest = questWithUuid.length > 4 ? questWithUuid.slice(0, 4) : questWithUuid
        },

        setDeleteAvailableQuest:  (state, action: PayloadAction<string>)=> {

            // con este reducer se eliminan el quest que tenga el id igual al payload
            const newArray = state.availableQuest.filter( quest => quest.uiid !== action.payload)

            const index = state.shownQuest.findIndex((el) => el.uiid === action.payload)

            // remplaza el siguiente quest en la posicion del quest eliminado
            state.shownQuest[index] = newArray[3] 

            state.availableQuest = newArray
        
        },

        setPositionAvailableQuest:  (state, action: PayloadAction<PositionType>)=> {

            state.shownQuest.forEach((quest) =>{
                if(quest.uiid == action.payload.uiid){
                    quest.width = action.payload.width
                    quest.height = action.payload.height
                }
            })
        
        },

        setNewExtraQuests:  (state, action: PayloadAction<AvailableQuestType[]>)=> {

             //se asigna el uiid a los nuevos quest llegados;
            const questWithUuid = AddUuid(action.payload)

            //se agregan los nuevos quest al availableQuestArray
            state.availableQuest = state.availableQuest.concat(questWithUuid)

            //agrega los quest restantes al shownQuest array
            const rePlaced = state.shownQuest.reduce ((acc: AvailableQuestType [] , originalElement) =>{
                if (originalElement == undefined){
                    return acc.concat(questWithUuid[0])
                }
                return acc.concat(originalElement)
            },[])

            state.shownQuest = rePlaced        
        }
    },
});

export const { setAvailableQuest, setDeleteAvailableQuest, setPositionAvailableQuest, setNewExtraQuests } = availableQuests.actions


interface SelectAdventurerDragType extends SelectAdventurerType{
    index: number
}

interface  SelectAdventurerClickType extends SelectAdventurerType{
    maxLength: number
}

interface SelectAdventurerType {
    id: string | null,
}

interface InitialStateSelectAdventurerType{
    selectAdventurer: (string | null) []
}

const initialStateSelectAdventurer: InitialStateSelectAdventurerType = {selectAdventurer: []}

const selectAdventurer = createSlice({
    name: "selectAdventurer",
    initialState: initialStateSelectAdventurer,
    reducers: {
        setSelectAdventurerDrag:  (state, action: PayloadAction<SelectAdventurerDragType>)=> {
            
            // se crea un nuevo array y se igual al anterior
            // let newArray : (string | undefined) [] =  []
                
            // newArray = state.selectAdventurer
    
            // //si la condicion es verdad lo agrega directament al array
            // if(action.payload.unSelect == false){
            //     newArray[action.payload.index] = action.payload.id
            // }  
            // //si la condicion es falsa la quita del array
            // else if (action.payload.unSelect == true){
    
            //     //marca undefined el indice que viene en el payload
            //     newArray[action.payload.index] = undefined

            //     //con esta funcion verifica si el array esta vacio 
            //     const isEmpty = newArray.reduce ((acc: boolean [] , originalElement: (string | undefined)) =>{
            //         if(originalElement != undefined){
            //             return [false]
            //         }
            //         return acc
            //     },[true])
            //     if(isEmpty[0] == true){
            //         state.selectAdventurer = []
            //     }
            // }  
        },

        setSelectAdventurerClick: (state, action:PayloadAction<SelectAdventurerClickType>) => {

            const newSelectedArray = state.selectAdventurer

            const indexNull = newSelectedArray.indexOf(null)

            if(indexNull === -1){
                if(state.selectAdventurer.length < action.payload.maxLength){
                    newSelectedArray.push(action.payload.id)
                }
            } else {
                newSelectedArray[indexNull] = action.payload.id
            }
           

            state.selectAdventurer =  newSelectedArray
        },

        setUnselectAdventurerClick: (state, action:PayloadAction<string>) => {

            const newSelectedAdventurerArray = state.selectAdventurer.map( adventurerId => {
                if(adventurerId === action.payload){
                    return null
                }

                return  adventurerId
            })

            
            state.selectAdventurer =  newSelectedAdventurerArray
        },
        setClearSelectedAdventurers:  ( state )=> {
            
            state.selectAdventurer = []
            
        }
    },
});

export const { setSelectAdventurerDrag, setSelectAdventurerClick, setUnselectAdventurerClick,  setClearSelectedAdventurers } = selectAdventurer.actions

//taken id

interface TakenIdType {
    id: string | null
}

const initialTakenId: TakenIdType = {id: null}

const takenId = createSlice({
    name: "takenId",
    initialState: initialTakenId,
    reducers: {
        setTakenId:  (state, action: PayloadAction<string>)=> {
            state.id = action.payload    
        },

        setTakenIdReset:  ( state )=> {
            state.id = null   
        }
    },
});

export const { setTakenId, setTakenIdReset } = takenId.actions

//combinacion de Reducers

export const availableQuestGeneralReducer = combineReducers({
    data: combineReducers({
        quest: availableQuests.reducer,
        selectAdventurer: selectAdventurer.reducer,
        takenId: takenId.reducer
    }),
    status: combineReducers({
        getAvailableQuestStatus: fetchGetAvailableQuestStatus.reducer,
        takeAvailableQuestStatus: fetchTakeAvailableQuestStatus.reducer
    })   
})

