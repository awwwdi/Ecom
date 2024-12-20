import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import productReducer from './slices/productSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    product: productReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['auth/login', 'auth/logout'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.token'],
        // Ignore these paths in the state
        ignoredPaths: ['auth.token']
      }
    }),
  devTools: process.env.NODE_ENV !== 'production'
});

export default store; 