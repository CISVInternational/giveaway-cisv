import { combineReducers } from 'redux';
import * as sliceGeneral from "./slices/general.slice"

const rootReducer = combineReducers({
    [sliceGeneral.name] : sliceGeneral.reducer
});

export default rootReducer;