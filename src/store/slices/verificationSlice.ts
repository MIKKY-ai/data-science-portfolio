// Verification Slice - Manages blockchain product verification state
// Handles QR code scanning results and Polygon blockchain verification calls

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { VerificationResult } from '../../types';
import { verifyProductOnChain } from '../../services/api/blockchainApi';

interface VerificationState {
  results: Record<string, VerificationResult>;
  isVerifying: boolean;
  error: string | null;
}

const initialState: VerificationState = {
  results: {},
  isVerifying: false,
  error: null,
};

// Async thunk to verify a product's authenticity on the Polygon blockchain
export const verifyProduct = createAsyncThunk(
  'verification/verifyProduct',
  async ({ productId, hash }: { productId: number; hash: string }, { rejectWithValue }) => {
    try {
      const result = await verifyProductOnChain(hash);
      return {
        productId,
        productHash: hash,
        isVerified: result,
        timestamp: new Date().toISOString(),
        blockchainNetwork: 'Polygon Amoy Testnet',
      } as VerificationResult;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Verification failed');
    }
  }
);

const verificationSlice = createSlice({
  name: 'verification',
  initialState,
  reducers: {
    clearVerification: (state) => {
      state.error = null;
      state.isVerifying = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(verifyProduct.pending, (state) => {
      state.isVerifying = true;
      state.error = null;
    });
    builder.addCase(verifyProduct.fulfilled, (state, action: PayloadAction<VerificationResult>) => {
      state.isVerifying = false;
      state.results[action.payload.productHash] = action.payload;
    });
    builder.addCase(verifyProduct.rejected, (state, action) => {
      state.isVerifying = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearVerification } = verificationSlice.actions;
export default verificationSlice.reducer;
