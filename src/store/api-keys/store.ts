import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import { type ApiKeysState, type BaseApiKey } from '../../types'

const initialState: ApiKeysState = {
  count: 0,
  keys: []
}

export const apiKeysSlice = createSlice({
  name: 'apiKeys',
  initialState,
  reducers: {
    createApiKey: (state, action: PayloadAction<BaseApiKey>) => {
      state.count += 1
      state.keys.push({ id: state.count, ...action.payload })
    },
    clearKeys: (state) => {
      state.keys = []
      state.count = 0
    }
  }
})

// Action creators are generated for each case reducer function
export const { createApiKey, clearKeys } = apiKeysSlice.actions

export default apiKeysSlice.reducer
