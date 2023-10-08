import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import type { WalletState, BaseWallet } from '../../types'

const initialState: WalletState = {
  count: 0,
  wallets: []
}

export const walletsSlice = createSlice({
  name: 'wallets',
  initialState,
  reducers: {
    createWallet: (state, action: PayloadAction<BaseWallet>) => {
      // Check if already exists
      for (const w of state.wallets) {
        if (w.address === action.payload.address) {
          return
        }
      }
      state.count += 1
      state.wallets.push({ id: state.count, ...action.payload })
    },
    clearWallets: (state) => {
      state.count = 0
      state.wallets = []
    }
  }
})

// Action creators are generated for each case reducer function
export const { createWallet, clearWallets } = walletsSlice.actions

export default walletsSlice.reducer
