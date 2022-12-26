import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import {loginDispatch, loginRootState} from './appLogin'

export const useLoginDispatch = () => useDispatch<loginDispatch>();
export const useLoginSelector: TypedUseSelectorHook<loginRootState> = useSelector;