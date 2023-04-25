import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { UserType } from '@/types/user'

interface UserSliceState {
  user: UserType
}

const initialState: UserSliceState = {
  user: { role: 'admin' },
}

const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserType>) => {
      state.user = action.payload
    },
  },
})

export const { setUser } = userSlice.actions

export default userSlice.reducer
