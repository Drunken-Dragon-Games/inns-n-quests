import { discord_client_id, discord_redirect_uri, discord_response_type, discord_scope  } from "../../../setting";
import { LoginThunk } from "./appLogin";
import { setIsAuthenticated } from "./authentication"
import { axiosCustomInstance } from "../../../axios/axiosApi";
import { createSliceStatus, actionsGenerator } from "../../utils/features/utils";
import { combineReducers } from "redux";


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



export const handleDiscordAuth = () => {

    //genera un nonce
    const nonce = makeNonce(20)

    //guarda el nonce como session storage
    sessionStorage.setItem("sessionId", nonce);

    //genera el link de disrcord
    const discordLink = `https://discord.com/api/oauth2/authorize?client_id=${discord_client_id}&redirect_uri=${discord_redirect_uri}&response_type=${discord_response_type}&scope=${discord_scope}&state=${nonce}`
    
    return discordLink
}


export const compareNonce = (state: string, code: string): LoginThunk => (dispatch) =>{

    //get and remove state from sessionStorage
    const storedNonce = sessionStorage.getItem('sessionId') || "";

    sessionStorage.removeItem('sessionId');

    //check incoming nonce and url storedNonce match
    storedNonce != state ? dispatch(setIsAuthenticated("rejected")) : dispatch(connectDiscord(code) as any)

}


export const connectDiscord = (code: string): LoginThunk => async (dispatch) => {
    
    dispatch(setConnectDiscordStatusPending())
    
    try {
        const registrationResponse = await axiosCustomInstance('api/discordRegistration').post('api/discordRegistration', { "code": code })
        
        localStorage.setItem('authenticationMethod', 'Discord');

        localStorage.setItem("refresh", registrationResponse.data.refreshToken);

        dispatch(setConnectDiscordStatusFulfilled())

        dispatch(setIsAuthenticated("authenticated"))

    } catch (error: any) {

        dispatch(setConnectDiscordStatusStatusRejected(error.message))

    }
}

const  connectDiscordStatus  = createSliceStatus("connectDiscordStatus")

const [ setWalletStatusIdle, setConnectDiscordStatusPending, setConnectDiscordStatusFulfilled, setConnectDiscordStatusStatusRejected ] = actionsGenerator(connectDiscordStatus.actions)

export const discordCompleteReducer = combineReducers({
    connectDiscordStatus: connectDiscordStatus.reducer,
  })
  