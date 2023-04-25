import { configureStore } from '@reduxjs/toolkit'
import menu from './mobileMenu/slice'
import user from './user/slice'
import settings from "./settings/slice"
import admin from "./admin/slice"
import searchUsers from "./searchUsers/slice"

export const store = configureStore({
  reducer: {
    menu,
    user,
    settings,
    admin,
    searchUsers
  },
})

export type RootState = ReturnType<typeof store.getState>
