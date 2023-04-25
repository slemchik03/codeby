import { ICategory } from "@/utils/server/get/getCategory";
import { INews } from "@/utils/server/get/getNews";
import { ITask } from "@/utils/server/get/getTask";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IInitialState {
  newsToUpdate: INews | null;
  categoryToUpdate: ICategory | null;
  taskToUpdate: ITask | null;
}

const initialState: IInitialState = {
  newsToUpdate: null,
  categoryToUpdate: null,
  taskToUpdate: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState: initialState,
  reducers: {
    setNewsToUpdate: (state, action: PayloadAction<INews>) => {
      state.newsToUpdate = action.payload;
    },
    setCategoryToUpdate: (state, action: PayloadAction<ICategory>) => {
      state.categoryToUpdate = action.payload;
    },
    setTaskToUpdate: (state, action: PayloadAction<ITask | null>) => {
      state.taskToUpdate = action.payload;
    },
  },
});

export const { setNewsToUpdate, setCategoryToUpdate, setTaskToUpdate } =
  adminSlice.actions;

export default adminSlice.reducer;
