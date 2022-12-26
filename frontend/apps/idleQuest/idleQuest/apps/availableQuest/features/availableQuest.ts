import { v4 as uuidv4 } from 'uuid';
import { createSlice, PayloadAction } from '@reduxjs/toolkit'; 
import { combineReducers } from "redux";
import { axiosCustomInstance } from '../../../../../../axios/axiosApi'; 
import { createSliceStatus, actionsGenerator } from "../../../../../utils/features/utils"
import { generalReducerThunk } from '../../../../../../features/generalReducer';
import { AxiosError } from "axios"
import { setAdventuresInQuest } from '../../console/features/adventurers';
import { available } from '../../../dummy_data';
import { setAvailableQuestUnselect } from '../../../features/interfaceNavigation';

//fetch para obeter los available quest si es la primera vez que se piden se realiza una peticion de 10 y posteriormente de 5 en 5 

export const getAvailableQuest = (firstTime? : boolean): generalReducerThunk => async (dispatch) =>{

    dispatch(setFetchGetAvailableQuestStatusPending())

    try { 

        if(process.env["NEXT_PUBLIC_API_BASE_HOSTNAME"] !== undefined){
            const response = await axiosCustomInstance('/quests/api/quests').get('/quests/api/quests')
        
            dispatch(setFetchGetAvailableQuestStatusFulfilled())
    
            //dependiendo si es la primera vez o no que se piden los quest durante el renderizado
            if(firstTime == true){
                dispatch(setAvailableQuest(response.data))
            } else{
                // dispatch(setNewQuests(response.data))
            }

        } else{
                
            dispatch(setAvailableQuest(available))
            dispatch(setFetchGetAvailableQuestStatusFulfilled())
        }
        
    } catch (err: unknown) {
        
        // if(err instanceof AxiosError ){
        //     dispatch(setFetchGetAvailableQuestStatusErrors(err.response))
        //     dispatch(fetchRefreshToken( () => dispatch(getAvailableQuest(firstTime)), err))
        // }
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
        

        
        if(process.env["NEXT_PUBLIC_API_BASE_HOSTNAME"] !== undefined){
        
                //fetch para aceptar el quest
            const response = await axiosCustomInstance('/quests/api/accept').post('/quests/api/accept', {quest_id: questId, adventurer_ids: adventurers_id})

            // se agrega a los ques in progress
            // FIXME: add the import and DUmmy data
            // dispatch(setAddInProgressQuest(response.data))
            
            //se agrega a los aventureros en el quest la propiedad de in_quest
            dispatch(setAdventuresInQuest(adventurers))

            //deseleciona al available quest
            dispatch(setAvailableQuestUnselect())

            
            dispatch(setFetchTakeAvailableQuestStatusFulfilled())

            //se agrega a la interfaz que quest se ha tomado para que los paper props puedan compararse y si tienen ese id ejecutan la accion de salida y eliminarse
            // dispatch(setQuestTakenId(questUiidFront))

        } else{
            
             // se agrega a los ques in progress
             // FIXME: add the import and DUmmy data
            //  dispatch(setAddInProgressQuest())
            
             //se agrega a los aventureros en el quest la propiedad de in_quest
            dispatch(setAdventuresInQuest(adventurers)) 
             //deseleciona al available quest
            dispatch(setAvailableQuestUnselect())

        
            dispatch(setFetchTakeAvailableQuestStatusFulfilled())

             //se agrega a la interfaz que quest se ha tomado para que los paper props puedan compararse y si tienen ese id ejecutan la accion de salida y eliminarse
             // FIXME: add the import 
            //  dispatch(setQuestTakenId(questUiidFront))
        }
        

        
    } catch (err: unknown) {

        // if(err instanceof AxiosError ){
        //     dispatch(setFetchTakeAvailableQuestStatusErrors(err.response))
        //     dispatch(fetchRefreshToken( () => dispatch(takeAvailableQuest(questId, adventurers, questUiidFront)), err))
        // }
    }

}

//reducer para monitorear el estado del request para los available quest 

const  fetchTakeAvailableQuestStatus  = createSliceStatus("fetchTakeAvailableQuestStatus")

const [ setFetchTakeAvailableQuestStatusIdle, setFetchTakeAvailableQuestStatusPending, setFetchTakeAvailableQuestStatusFulfilled, setFetchTakeAvailableQuestStatusErrors ] = actionsGenerator(fetchTakeAvailableQuestStatus.actions)


//reducer para manejar los cambios en los datos de availablequest

interface initialStateNavigationConsole{
    page: "available" | "in_progress"
}

const initialStateNavigationConsole: initialStateNavigationConsole = {page: "available"}

interface AvailableInitialQuest {
    availableQuest: availableQuest[]
    shownQuest: availableQuest[] 
}

interface availableQuest {
    uiid?: string
    id: string
    name: string
    description: string
    reward_ds: number
    reward_xp: number
    difficulty: number
    slots: number
    rarity: string
    duration: number
    width?: number
    height?: number
}

interface position{
    width: number
    height: number
    uiid: string
}

interface AvailableInitialQuest {
    availableQuest: availableQuest[]
    shownQuest: availableQuest[] 
}

const initialStateAvailableQuest: AvailableInitialQuest = {availableQuest: [], shownQuest: []}


const AddUuid = (quests: availableQuest[]): availableQuest[] =>{

    quests.map((availableQuest: availableQuest) => {
        const uiid = uuidv4()
        availableQuest.uiid = uiid
    });

    return quests
}


const availableQuests = createSlice({
    name: "availableQuests",
    initialState: initialStateAvailableQuest,
    reducers: {

        setAvailableQuest:  (state, action: PayloadAction<availableQuest[]>)=> {

            const questWithUuid = AddUuid(action.payload)

            state.availableQuest = questWithUuid
            state.shownQuest = questWithUuid.length > 4 ? questWithUuid.slice(0, 4) : questWithUuid
        },

        setDeleteAvailableQuest:  (state, action: PayloadAction<string>)=> {

            // con este reducer se eliminan el quest que tenga el id igual al payload
            const newArray = state.availableQuest.filter( quest => quest.uiid !== action.payload)

            const index = state.shownQuest.findIndex((el: availableQuest) => el.uiid === action.payload)

            // remplaza el siguiente quest en la posicion del quest eliminado
            state.shownQuest[index] = newArray[3] as availableQuest

            state.availableQuest = newArray
        
        },

        setPositionAvailableQuest:  (state, action: PayloadAction<position>)=> {

            state.shownQuest.forEach((quest: availableQuest) =>{
                
                if(quest.uiid == action.payload.uiid){
                    quest.width = action.payload.width
                    quest.height = action.payload.height
                }
                
            })
        
        },

        setNewExtraQuests:  (state, action: PayloadAction<availableQuest[]>)=> {

             //se asigna el uiid a los nuevos quest llegados;
            const questWithUuid = AddUuid(action.payload)


            //se agregan los nuevos quest al availableQuestArray
            state.availableQuest = state.availableQuest.concat(questWithUuid)
            
            //agrega los quest restantes al shownQuest array
            const rePlaced = state.shownQuest.reduce ((acc: availableQuest [] , originalElement: availableQuest) =>{
                
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


interface SelectAdventurer {
    index: number,
    id?: string | undefined,
    unSelect: boolean,
}

interface initialStateSelectAdventurer{
    selectAdventurer: (string | undefined) []
}

const initialStateSelectAdventurer: initialStateSelectAdventurer = {selectAdventurer: []}

const selectAdventurer = createSlice({
    name: "selectAdventurer",
    initialState: initialStateSelectAdventurer,
    reducers: {
        setSelectAdventurer:  (state, action: PayloadAction<SelectAdventurer>)=> {
            
            // se crea un nuevo array y se igual al anterior
            let newArray : (string | undefined) [] =  []
                
            newArray = state.selectAdventurer
    
            //si la condicion es verdad lo agrega directament al array
            if(action.payload.unSelect == false){
                newArray[action.payload.index] = action.payload.id
            }  
            //si la condicion es falsa la quita del array
            else if (action.payload.unSelect == true){
    
                //marca undefined el indice que viene en el payload
                newArray[action.payload.index] = undefined

                //con esta funcion verifica si el array esta vacio 
                const isEmpty = newArray.reduce ((acc: boolean [] , originalElement: (string | undefined)) =>{
                    if(originalElement != undefined){
                        return [false]
                    }

                    return acc
                    
                },[true])

                if(isEmpty[0] == true){
                    state.selectAdventurer = []
                }
            }  
        },

        setClearSelectedAdventurers:  ( state )=> {
            
            state.selectAdventurer = []
            
        }
    },
});

export const { setSelectAdventurer, setClearSelectedAdventurers } = selectAdventurer.actions

//combinacion de Reducers

export const availableQuestGeneralReducer = combineReducers({
    data: combineReducers({
        quest: availableQuests.reducer,
        selectAdventurer: selectAdventurer.reducer
    }),
    status: combineReducers({
        getAvailableQuestStatus: fetchGetAvailableQuestStatus.reducer,
        takeAvailableQuestStatus: fetchTakeAvailableQuestStatus.reducer
    })   
})

