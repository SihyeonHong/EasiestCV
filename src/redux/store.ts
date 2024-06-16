import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Tab } from "../models/tab.model";
import { HomeData } from "../models/home.model";

const initHome: HomeData = {
  userid: "",
  intro: "",
  img: "",
  pdf: "",
};

const homeData = createSlice({
  name: "homeData",
  initialState: initHome,
  reducers: {
    setHomeData: (state, action: PayloadAction<HomeData>) => {
      return action.payload;
    },
  },
});

export const { setHomeData } = homeData.actions;

const initTabs: Tab[] = [
  {
    tid: 1,
    tname: "initTab",
    userid: "initialID",
    torder: 0,
  },
];

const tabs = createSlice({
  name: "tabs",
  initialState: initTabs,
  reducers: {
    setTabs: (state, action: PayloadAction<Tab[]>) => {
      return action.payload;
    },
  },
});

export const { setTabs } = tabs.actions;

export const store = configureStore({
  reducer: {
    homeData: homeData.reducer,
    tabs: tabs.reducer,
  },
  devTools: process.env.NODE_ENV !== "production", // 이건 무슨 뜻이야 왜 있는 거야
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
