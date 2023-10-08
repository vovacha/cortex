import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface SidebarState {
  value: boolean
}

const initialState: SidebarState = {
  value: false
}

export const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    showSidebar: (state, action: PayloadAction<SidebarState>) => {
      state.value = action.payload.value
    }
  }
})

// Action creators are generated for each case reducer function
export const { showSidebar } = sidebarSlice.actions

export default sidebarSlice.reducer
