import { configureStore } from '@reduxjs/toolkit'
import loggerReducer from './logger/store'
import walletsReducer from './wallets/store'
import addressesReducer from './addresses/store'

export const store = configureStore({
  reducer: {
    logger: loggerReducer,
    wallets: walletsReducer,
    addresses: addressesReducer
  }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

// shared-components -> button
// components (modules) -> bigger stuff
// App -> components
