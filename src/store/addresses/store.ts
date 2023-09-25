import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import type { WalletWithTargetAddress } from '../../types'

const initialState: WalletWithTargetAddress[] = []

export const addressesSlice = createSlice({
  name: 'addresses',
  initialState,
  reducers: {
    addAddresses: (state, action: PayloadAction<WalletWithTargetAddress[]>) => {
      state.push(...action.payload)
    }
  }
})

// Action creators are generated for each case reducer function
export const { addAddresses } = addressesSlice.actions

export default addressesSlice.reducer
