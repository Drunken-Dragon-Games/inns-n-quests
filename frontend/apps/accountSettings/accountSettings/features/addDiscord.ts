import { discord_client_id, discord_response_type, discord_scope, discord_redirect_uri_add_to_account  } from "../../../../setting";
import { createSliceStatus, actionsGenerator } from "../../../utils/features/utils";
import { combineReducers } from "redux";
import { axiosCustomInstance } from "../../../../axios/axiosApi";
import { generalReducerThunk } from "../../../../features/generalReducer";
import { AxiosError } from "axios";
import { fetchRefreshToken } from "../../../../features/refresh";

const makeNonce = (length: number) => {

    let result = '';

    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    let charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }

    return result;
}


export const handleDiscordAuthAddAccount = () => {
    
    //genera un nonce
    const nonce = makeNonce(20)

    //guarda el nonce como session storage
    sessionStorage.setItem("sessionId_add", nonce);

    //genera el link de disrcord
    const discordLink = `https://discord.com/api/oauth2/authorize?client_id=${discord_client_id}&redirect_uri=${discord_redirect_uri_add_to_account}&response_type=${discord_response_type}&scope=${discord_scope}&state=${nonce}`
    
    return discordLink
}


export const compareNonceAddDiscord = (state: string, code: string): generalReducerThunk => (dispatch) =>{

    dispatch(setCompareNonceAddDiscordStatusPending())
    
    //get and remove state from sessionStorage
    const storedNonce = sessionStorage.getItem('sessionId_add') || "";

    sessionStorage.removeItem('sessionId_add');



    //check incoming nonce and url storedNonce match

    if(storedNonce == state){
        dispatch(setCompareNonceAddDiscordStatusFulfilled())
        dispatch(connectDiscord(code))
    } else{
        dispatch(setCompareNonceAddDiscordStatusRejected()) 
    }
     

}

const  compareNonceAddDiscordStatus  = createSliceStatus("compareNonceAddDiscordStatus")

const [ setCompareNonceAddDiscordStatusIdle, setCompareNonceAddDiscordStatusPending, setCompareNonceAddDiscordStatusFulfilled, setCompareNonceAddDiscordStatusRejected ] = actionsGenerator(compareNonceAddDiscordStatus.actions)


export const connectDiscord = (code: string): generalReducerThunk => async (dispatch) => {
    
    dispatch(setConnectDiscordStatusPending())
    try {
        const registrationResponse = await axiosCustomInstance('api/validateDiscord').post('api/validateDiscord', { "code": code })
        dispatch(setConnectDiscordStatusFulfilled())

    } catch (err:  unknown ) {      
        
        if(err instanceof AxiosError ){
            dispatch(setConnectDiscordStatusRejected(err))
            dispatch(fetchRefreshToken( () => dispatch(connectDiscord(code)), err))
        }
        
    }
}

const  connectDiscordStatus  = createSliceStatus("connectDiscordStatus")

const [ setConnectDiscordStatusIdle, setConnectDiscordStatusPending, setConnectDiscordStatusFulfilled, setConnectDiscordStatusRejected ] = actionsGenerator(connectDiscordStatus.actions)


export const addDiscordStatusReducer = combineReducers({
    status: combineReducers({
        compareNonce: compareNonceAddDiscordStatus.reducer,
        connectDiscord: connectDiscordStatus.reducer
    })
  })
