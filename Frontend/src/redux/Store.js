// src/redux/Store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./AuthSlice";
// import storage from 'redux-persist/lib/storage'; // Comment out storage
// import { persistReducer, persistStore } from 'redux-persist'; // Comment out persist imports

// const persistConfig = { // Comment out persistConfig
//   key: "root",
//   storage,
//   whitelist: ['auth']
// };

// const persistedReducer = persistReducer(persistConfig, authReducer); // Comment out persistedReducer

export const store = configureStore({
  reducer: {
    auth: authReducer, // Use the original authReducer directly
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Remove persist-specific ignoredActions if they cause issues without persist
        // ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

// export const persistor = persistStore(store); // Comment out persistor export
