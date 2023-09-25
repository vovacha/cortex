import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import type { LogRecord } from '../../types'

const initialState: LogRecord[] = []

export const loggerSlice = createSlice({
  name: 'logger',
  initialState,
  reducers: {
    logger: (state, action: PayloadAction<LogRecord>) => {
      state.push(action.payload)
    }
  }
})

// Action creators are generated for each case reducer function
export const { logger } = loggerSlice.actions

export default loggerSlice.reducer
