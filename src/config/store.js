import { createStore, applyMiddleware } from "redux"
import createSagaMiddleware from "redux-saga"

import reducers from "../reducers"
import rootSaga from "./sagas"
import { loadState, saveState } from "./localStorage"

const sagaMiddleware = createSagaMiddleware()
const middleware = [sagaMiddleware]

const persistedState = loadState()
const store = createStore(reducers, persistedState, applyMiddleware(...middleware))

store.subscribe(() => saveState(store.getState()))

sagaMiddleware.run(rootSaga)

export default store
