import { createSlice, PayloadAction } from '@reduxjs/toolkit'; 
import { combineReducers } from "redux";
import { axiosCustomInstance } from '../../../../../../axios/axiosApi'; 
import { createSliceStatus, actionsGenerator } from "../../../../../utils/features/utils"
import { GeneralReducerThunk } from '../../../../../../features/generalReducer';
import { AxiosError } from 'axios';
import { fetchRefreshToken } from '../../../../../../features/refresh';
import { DataAdventurerType } from '../../../../../../types/idleQuest';

//fetch para obeter a los aventureros

export const getAdventurers = () : GeneralReducerThunk => async (dispatch) =>{
  
    dispatch(setFetchGetAdventurersStatusPending())

    try {  

        //fetch para obeter a los aventureros
        const response = await axiosCustomInstance('/quests/api/adventurers').get('/quests/api/adventurers')   
        dispatch(setAdventurers(response.data))  
        dispatch(setFetchGetAdventurersStatusFulfilled())
 
    } catch (err: unknown) {
        
        if(err instanceof AxiosError ){
            dispatch(setFetchGetAdventurersStatusErrors(err.response))
            dispatch(fetchRefreshToken( () => dispatch(getAdventurers()), err))
        }
    }
  
}

//reducer para monitorear el estado del request para los aventureros
  
const  fetchGetAdventurersStatus  = createSliceStatus("fetchGetAdventurersStatus")
const [ setFetchGetAdventurersStatusIdle, setFetchGetAdventurersStatusPending, setFetchGetAdventurersStatusFulfilled, setFetchGetAdventurersStatusErrors ] = actionsGenerator(fetchGetAdventurersStatus.actions)

//reducer para manejar los cambios en los datos de adventurers





//funcion para ordenar por nivel los aventureros INPUT array de aventureros 
const sortingLevel = (adventurersArray: DataAdventurerType []) => {
    

    adventurersArray.sort(function (a: DataAdventurerType , b: DataAdventurerType) {
        if (a.experience > b.experience) {
          return -1;
        }
        if (a.experience < b.experience) {
          return 1;
        }

        return 0;
    });

}


const adventurersSorting = (adventurers: DataAdventurerType[] ) =>{
    const adventurersFree = adventurers.filter((element) => element.in_quest  == false);
    const adventurersInQuest = adventurers.filter((element) => element.in_quest  == true);

    sortingLevel(adventurersFree);
    sortingLevel(adventurersInQuest);

    return adventurersFree.concat(adventurersInQuest)
}


interface initialStateAdventurer{
    data:  DataAdventurerType [] 
}


interface AdventurerAfterQuestType{
    adventurerId: string
    experience?: number
    type?: "pixeltile" | "gma" | 'aot'
    dead_cooldown?: number
}


const initialStateAdventurer:  initialStateAdventurer = {data: []}

const adventurers = createSlice({
    name: "adventurers ",
    initialState: initialStateAdventurer,
    reducers: {
        
        //Este caso primero se hacen dos arrays dividiendo entre los aventureros disponibles y los que no y posteriormente se ordena por cantidad de experiencia

        setAdventurers: (state, action: PayloadAction<DataAdventurerType[]>) => {

            const adventurersSorted = adventurersSorting(action.payload)
            state.data = adventurersSorted

        },

        setAdventuresInQuest: (state, action: PayloadAction<(string | null)[]>) => {

            const adventurerArrays =  state.data.map(adventurer =>{
                
                action.payload.forEach((adventurerId) => {
                    if(adventurerId == adventurer.adventurerId){
                        adventurer.in_quest = true
                        return adventurer
                    }
                })

                return adventurer
                
            })
    
            const adventurersSorted = adventurersSorting(adventurerArrays)

            state.data = adventurersSorted
        },

        setFreeAdventurers: (state, action: PayloadAction<AdventurerAfterQuestType []>) => {

            //crea un array con todos los id de los aventureros en el array
            const adventurersIds = action.payload.map (adventurer => adventurer.adventurerId)

             //este reducer toma el array con los ids y el estado con el array de los aventureros y cuando tenga el mismo id cambia la propiedad in_quest  a false
        
            const adventurerArrays =  state.data.map (adventurer => {            
                adventurersIds.forEach(adventurerId => {
                    if(adventurerId == adventurer.adventurerId){
                        adventurer.in_quest = false
                        return adventurer
                    }
                })
            return adventurer
            })

            const adventurersSorted = adventurersSorting(adventurerArrays)

            state.data = adventurersSorted

        },

          //Este caso recibe un array de aventureros para dar expericia de un quest y cambia la propiedad de experience a la nueva expericia y el nuevo nivel
        setExperienceReward: (state, action: PayloadAction<DataAdventurerType[]>) => {
    
            const adventurers =  state.data.map (adventurer =>{            
                action.payload.forEach(adventurerRewarded => {

                    if(adventurerRewarded.adventurerId == adventurer.adventurerId){
                        adventurer.experience = adventurerRewarded.experience
                        return adventurer
                    }
                })
                return adventurer   
            })

            const adventurersSorted = adventurersSorting(adventurers)

            state.data = adventurersSorted

        },

        //este caso setea la muerte llega un array con los heroes muertos y se compara con el estado el array de aventureros se comparan los id y enn caso de que el tipo sea pixeltile se setea la experioencia a 0 y en casa gma se setea el cooldown de muerto
        setDeath: (state, action: PayloadAction<DataAdventurerType[]>) => {
    
            const adventurers =  state.data.map ((adventurer ) =>{                            
                action.payload.forEach((deathAdventurerData: AdventurerAfterQuestType) => {
                    if(deathAdventurerData.adventurerId == adventurer.adventurerId){
                        if(deathAdventurerData.type == "pixeltile"){
                            adventurer.experience = 0
                        } else if (deathAdventurerData.type == "gma"){
                            adventurer.metadata.dead_cooldown = deathAdventurerData.dead_cooldown
                            adventurer.metadata.is_alive = false;
                        }
                        return adventurer
                    }
                })
                return adventurer   
            })
            
            const adventurersSorted = adventurersSorting(adventurers)

            state.data = adventurersSorted
        },

        //este caso esta hecho para meter un placeholder en cuando se recluta un aventurero en el faucet
        setRecruitment: (state) => {

            const recruiter: DataAdventurerType = {
                adventurerId: "b9930b53-aed1-4feb-a424-2c75f3f123456d2asdasdafgasd6bf",
                name: "placeholeder",
                race: "human",
                class: "fighter",

                assetRef: "placeholder",
                sprite: "./images/pixeltiles_props/adventurer_prop",
                hp: 1,
                athleticism: 0,
                intellect: 0,
                charisma: 0,
                inChallenge: false,
                collection: "pixel-tiles",

                // Old properties, remove once the new backend models have been implemented 
                experience: 0,
                in_quest: false,
                on_chain_ref: "placeholder",
                onRecruitment: true,
                //sprites: "./images/pixeltiles_props/adventurer_prop",
                //type: "pixeltile",
                metadata: {},
            }

            state.data =  state.data.concat(recruiter)

        },
    },
});

export const { setAdventurers, setAdventuresInQuest, setFreeAdventurers, setExperienceReward, setDeath, setRecruitment  } = adventurers.actions



// combinacion de reducer

export const adventurersGeneralReducer = combineReducers({
    data: adventurers.reducer,
    getAdventurersStatus: fetchGetAdventurersStatus.reducer
})