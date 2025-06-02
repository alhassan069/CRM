import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Async thunks
export const fetchDeals = createAsyncThunk(
  'deals/fetchDeals',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/deals`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchDeal = createAsyncThunk(
  'deals/fetchDeal',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/deals/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createDeal = createAsyncThunk(
  'deals/createDeal',
  async (dealData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/deals`, dealData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateDeal = createAsyncThunk(
  'deals/updateDeal',
  async ({ id, dealData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/deals/${id}`, dealData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteDeal = createAsyncThunk(
  'deals/deleteDeal',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/deals/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateDealStage = createAsyncThunk(
  'deals/updateDealStage',
  async ({ id, stage }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(`${API_URL}/deals/${id}/stage`, { stage }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  deals: [],
  currentDeal: null,
  loading: false,
  error: null,
};

const dealsSlice = createSlice({
  name: 'deals',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentDeal: (state) => {
      state.currentDeal = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Deals
      .addCase(fetchDeals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDeals.fulfilled, (state, action) => {
        state.loading = false;
        state.deals = action.payload;
      })
      .addCase(fetchDeals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch deals';
      })
      // Fetch Single Deal
      .addCase(fetchDeal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDeal.fulfilled, (state, action) => {
        state.loading = false;
        state.currentDeal = action.payload;
      })
      .addCase(fetchDeal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch deal';
      })
      // Create Deal
      .addCase(createDeal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDeal.fulfilled, (state, action) => {
        state.loading = false;
        state.deals.push(action.payload);
      })
      .addCase(createDeal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create deal';
      })
      // Update Deal
      .addCase(updateDeal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDeal.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.deals.findIndex(d => d.id === action.payload.id);
        if (index !== -1) {
          state.deals[index] = action.payload;
        }
        if (state.currentDeal?.id === action.payload.id) {
          state.currentDeal = action.payload;
        }
      })
      .addCase(updateDeal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update deal';
      })
      // Delete Deal
      .addCase(deleteDeal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDeal.fulfilled, (state, action) => {
        state.loading = false;
        state.deals = state.deals.filter(d => d.id !== action.payload);
        if (state.currentDeal?.id === action.payload) {
          state.currentDeal = null;
        }
      })
      .addCase(deleteDeal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to delete deal';
      })
      // Update Deal Stage
      .addCase(updateDealStage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDealStage.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.deals.findIndex(d => d.id === action.payload.id);
        if (index !== -1) {
          state.deals[index] = action.payload;
        }
        if (state.currentDeal?.id === action.payload.id) {
          state.currentDeal = action.payload;
        }
      })
      .addCase(updateDealStage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update deal stage';
      });
  },
});

export const { clearError, clearCurrentDeal } = dealsSlice.actions;
export default dealsSlice.reducer; 