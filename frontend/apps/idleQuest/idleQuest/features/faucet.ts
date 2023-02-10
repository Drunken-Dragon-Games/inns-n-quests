
import { createSliceStatus, actionsGenerator } from '../../../utils/features/utils'; 
import { GeneralReducerThunk } from '../../../../features/generalReducer';
import { axiosCustomInstance } from '../../../../axios/axiosApi';
import { AxiosError } from 'axios';
import { getAdventurers } from '../apps/availableQuest/quest-board-state';

export const fetchMintTest = (): GeneralReducerThunk => async (dispatch) =>{

    dispatch(setFetchAddressPostStatusPending())

    try {  
        // se hace el fetch al backend y regresa una transaccion para firmar
      
        const response = await axiosCustomInstance('/quests/api/mint-test-nft').post('/quests/api/mint-test-nft')
    
        dispatch(getAdventurers())
        dispatch(setFetchAddressPostStatusFulfilled())
        
      } catch (err: unknown) {
        
    
        if(err instanceof AxiosError ){
          dispatch(setFetchAddressPostStatusErrors(err.response))
        //   dispatch(fetchRefreshToken( () => dispatch(AddressPost(Address)), err))
        }
      }

}


//reducer para monitorear el estado del request para los available quest 

const  fetchAddressPostStatus  = createSliceStatus("fetchAddressPostStatus")

const [ setFetchAddressPostStatusIdle, setFetchAddressPostStatusPending, setFetchAddressPostStatusFulfilled, setFetchAddressPostStatusErrors ] = actionsGenerator(fetchAddressPostStatus.actions)

