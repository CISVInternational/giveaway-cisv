import { createStore, applyMiddleware } from 'redux';

import rootReducer from './rootReducer';

import createSagaMiddleware from 'redux-saga'

function* exampleSaga() {
    console.log("Example saga reached");
}

const sagaMiddleware = createSagaMiddleware();
const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));

sagaMiddleware.run(exampleSaga);
export default store;