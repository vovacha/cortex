import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import type { AccountState } from '../../types'

interface UpdateWallet {
  accountId: number
  wallet: string | undefined
}

interface UpdateName {
  accountId: number
  name: string
}

const initialState: AccountState = {
  count: 0,
  accounts: [],
  attachedEvmWallets: []
}

export const accountsSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    createAccount: (state, action: PayloadAction<string>) => {
      state.count += 1
      state.accounts.push({ id: state.count, name: action.payload })
    },
    updateName: (state, action: PayloadAction<UpdateName>) => {
      state.accounts.forEach((account) => {
        if (account.id === action.payload.accountId) {
          account.name = action.payload.name
        }
      })
    },
    updateEvmWallet: (state, action: PayloadAction<UpdateWallet>) => {
      state.accounts.forEach((account) => {
        if (account.id === action.payload.accountId) {
          if (action.payload.wallet !== undefined && action.payload.wallet.length > 1) {
            state.attachedEvmWallets.push(action.payload.wallet)
            account.evmWallet = action.payload.wallet
          } else {
            state.attachedEvmWallets.splice(
              state.attachedEvmWallets.indexOf(account.evmWallet ?? ''), 1)
            account.evmWallet = undefined
          }
        }
      })
    },
    clearAccounts: (state) => {
      state.accounts = []
      state.count = 0
      state.attachedEvmWallets = []
    }
  }
})

// Action creators are generated for each case reducer function
export const { createAccount, updateEvmWallet, updateName, clearAccounts } = accountsSlice.actions

export default accountsSlice.reducer
