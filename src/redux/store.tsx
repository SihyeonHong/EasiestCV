import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";

const initUserinfo: Userinfo = {
  userid: "initialID",
  username: "",
  intro: "",
  img: "",
  pdf: "",
};

const userinfo = createSlice({
  name: "userinfo",
  initialState: initUserinfo,
  reducers: {
    setUserInfo: (state, action: PayloadAction<Userinfo>) => {
      // Update state here
      return action.payload;
    },
    // ... other reducers can be defined here
  },
});

export const { setUserInfo } = userinfo.actions;

const initTabs: Tab[] = [
  {
    tid: 0,
    tname: "initTab",
    userid: "initialID",
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

const initContents: TabContent[] = [
  {
    userid: "initialID",
    tid: 0,
    cid: 0,
    type: "title",
    ccontent: "initTitle",
    corder: 0,
  },
];

const contents = createSlice({
  name: "contents",
  initialState: initContents,
  reducers: {
    setContents: (state, action: PayloadAction<TabContent[]>) => {
      return action.payload;
    },
  },
});

export const { setContents } = contents.actions;

export const store = configureStore({
  reducer: {
    userinfo: userinfo.reducer, // AdminLayout.tsx
    tabs: tabs.reducer,
  },
  devTools: process.env.NODE_ENV !== "production", // 이건 무슨 뜻이야 왜 있는 거야
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type Userinfo = {
  userid: string;
  username?: string;
  intro?: string;
  img?: string;
  pdf?: string;
};
export type Tab = { tid: number; tname: string; userid: string };
export type TabContent = {
  userid: string;
  tid: number;
  cid: number;
  type: string;
  ccontent: string;
  corder: number;
};
