import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  full_name: "",
  telegram_mention: "",
  biography: "",
  github_url: "",
  login: "",
  avatar: "",
  email: "",
  password: "",
};

const settingSlice = createSlice({
  name: "settings",
  initialState: initialState,
  reducers: {
    updateFullName: (state, action: PayloadAction<string>) => {
      state.full_name = action.payload;
    },
    updateTelegramMention: (state, action: PayloadAction<string>) => {
      state.telegram_mention = action.payload;
    },
    updateBiography: (state, action: PayloadAction<string>) => {
      state.biography = action.payload;
    },
    updateGithubUrl: (state, action: PayloadAction<string>) => {
      state.github_url = action.payload;
    },
    updateLogin: (state, action: PayloadAction<string>) => {
      state.login = action.payload;
    },
    updateAvatar: (state, action: PayloadAction<string>) => {
      state.avatar = action.payload;
    },
    updateEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    updatePassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
    },
  },
});

export const {
  updateBiography,
  updateFullName,
  updateGithubUrl,
  updateLogin,
  updateTelegramMention,
  updateAvatar,
  updateEmail,
  updatePassword,
} = settingSlice.actions;

export default settingSlice.reducer;
