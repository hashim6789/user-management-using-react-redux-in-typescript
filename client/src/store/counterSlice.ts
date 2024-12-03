import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CounterState {
  count: number;
}

const initialState: CounterState = {
  count: 0,
};

const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    incrementBy: (state, action: PayloadAction<number>) => {
      state.count += action.payload;
    },
    decrementBy: (state, action: PayloadAction<number>) => {
      state.count -= action.payload;
    },
    reset: (state) => {
      state.count = 0;
    },
  },
});

export const { incrementBy, decrementBy, reset } = counterSlice.actions;
const counterReducer = counterSlice.reducer;
export default counterReducer;
