import { configureStore, combineReducers } from '@reduxjs/toolkit'
import loggerReducer from './logger/store'
import walletsReducer from './wallets/store'
import addressesReducer from './addresses/store'
import sidebarReducer from './sidebar/store'
import accountsReducer from './accounts/store'
import apiKeysReducer from './api-keys/store'
import storage from 'redux-persist/lib/storage'
import { persistReducer, persistStore } from 'redux-persist'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'
import thunk from 'redux-thunk'

const rootPersistConfig = {
  key: 'root',
  storage,
  stateReconciler: autoMergeLevel2
  // whitelist: ['accounts', 'wallets']
}

const rootReducer = combineReducers({
  logger: loggerReducer,
  wallets: walletsReducer,
  addresses: addressesReducer,
  sidebar: sidebarReducer,
  accounts: accountsReducer,
  apiKeys: apiKeysReducer
})

// https://stackoverflow.com/questions/65606288/typescript-reduxjs-toolkit-reducer-generated-by-createslice-is-not-assignable
const persistedReducer = persistReducer(rootPersistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk]
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof rootReducer>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export const persistor = persistStore(store)
// https://blog.logrocket.com/persist-state-redux-persist-redux-toolkit-react/#persisting-state-redux-persist
