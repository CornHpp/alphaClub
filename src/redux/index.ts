// index.ts 文件
import { configureStore } from "@reduxjs/toolkit";
// 合并reducers 用的
import { combineReducers } from "redux";

import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";

// 创建的reducers
import userSlice from "./features/userSlice";
import cryptoSlice from "./features/cryptoSlice";

// combineReducers合并reducer
const reducers = combineReducers({
  user: userSlice,
  crypto: cryptoSlice,
});

const persistConfig = {
  key: "root",
  storage,
  // 黑名单 不缓存的
  blacklist: ["roomCache", "stateCache", "crypto"],
};

const persistedReducer = persistReducer(persistConfig, reducers);

//  configureStore创建一个Redux store
const store = configureStore({
  reducer: persistedReducer,
  devTools: true, //是否开启devTools
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

const persistor = persistStore(store);

export { store, persistor };
