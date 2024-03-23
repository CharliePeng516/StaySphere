import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    searchParams:{}
}

export const searchSlices = createSlice({
    name: "search",
    initialState,
    reducers: {
      setSearchParams: (state, {payload}) => {
        console.log('payload', payload)
        state.searchParams = {...payload};
      }
    }
});

// 导出 reducers 方法
export const { setSearchParams } = searchSlices.actions;

// 默认导出
export default searchSlices.reducer;