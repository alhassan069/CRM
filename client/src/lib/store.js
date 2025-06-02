import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import contactsReducer from './slices/contactsSlice';
import dealsReducer from './slices/dealsSlice';
import organizationsReducer from './slices/organizationsSlice';
import activitiesReducer from './slices/activitiesSlice';
import tasksReducer from './slices/tasksSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    contacts: contactsReducer,
    deals: dealsReducer,
    organizations: organizationsReducer,
    activities: activitiesReducer,
    tasks: tasksReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});