import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import type { Wallet } from '../../types'

const initialState: Wallet[] = []

// const initialState: Wallet[] = {
//   wallets: []
// }

export const walletsSlice = createSlice({
  name: 'wallets',
  initialState,
  reducers: {
    addWallets: (state, action: PayloadAction<Wallet[]>) => {
      state.push(...action.payload)
      // TODO: check docs. mutate => state.wallets = action.payload
    }
  }
})

// Action creators are generated for each case reducer function
export const { addWallets } = walletsSlice.actions

export default walletsSlice.reducer
