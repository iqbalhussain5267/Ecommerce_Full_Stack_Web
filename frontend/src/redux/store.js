import { configureStore, combineReducers } from "@reduxjs/toolkit"; 
import { 
  persistStore, 
  persistReducer, 
  FLUSH, 
  REHYDRATE, 
  PAUSE, 
  PERSIST, 
  PURGE, 
  REGISTER, 
} from 'redux-persist'; 
import storage from 'redux-persist/es/storage'; 

// CRITICAL FIX: Ensure you are importing and using the .reducer 
import userReducer from "./userSlice"; 
import productReducer from './productSlice'; // Changed name to clarify it is the reducer

// 1. Combine your reducers 
const rootReducer = combineReducers({ 
  user: userReducer, 
  product: productReducer, // FIXED: Now passing the product reducer function correctly
}); 

// 2. Configure persistence settings 
const persistConfig = { 
  key: 'root', 
  version: 1, 
  storage: storage || (typeof window !== 'undefined' ? window.localStorage : null), 
  whitelist: ['user'], // Saves only the user state to localStorage (products will reset on page refresh)
}; 

// 3. Create the persisted reducer wrapper 
const persistedReducer = persistReducer(persistConfig, rootReducer); 

// 4. Configure the main Redux store 
export const store = configureStore({ 
  reducer: persistedReducer, 
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({ 
      serializableCheck: { 
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER], 
      }, 
    }), 
}); 

// 5. Create and export the persistor object 
export const persistor = persistStore(store); 

export default store;
