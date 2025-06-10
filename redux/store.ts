import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authReducer } from "./slices/auth";
import { wardrobeReducer } from "./slices/wardrobeSlice"; 



const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["auth", "wardrobe"],
};

const rootReducer = combineReducers({
  auth: authReducer,
  wardrobe: wardrobeReducer

});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;