
import { createSlice, PayloadAction } from '@reduxjs/toolkit'


const initialState = {
  login: "",
  email: ""
}

const searchUsers = createSlice({
  name: 'searchUsers',
  initialState: initialState,
  reducers: {
    setLogin: (state, action: PayloadAction<string>) => {
      state.login = action.payload
    },
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload
    },
  },
})

export const { setEmail, setLogin } = searchUsers.actions

export default searchUsers.reducer
