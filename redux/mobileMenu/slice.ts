import { createSlice, PayloadAction } from '@reduxjs/toolkit'


const initialState = {
  openMenu: false,
  isFullWidthMenu: true,
}

const menuSlice = createSlice({
  name: 'menu',
  initialState: initialState,
  reducers: {
    setOpen: (state, action: PayloadAction<boolean>) => {
      state.openMenu = action.payload
    },
    setIsFullWidthMenu: (state, action: PayloadAction<boolean>) => {
      state.isFullWidthMenu = action.payload
    },
  },
})

export const { setOpen, setIsFullWidthMenu } = menuSlice.actions

export default menuSlice.reducer
