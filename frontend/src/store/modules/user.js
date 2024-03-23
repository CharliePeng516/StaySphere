import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userInfo:{
        token: null,
        name: null,
        email: null
    },
    refresh: false
    
}

export const userSlices = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUserInfo: (state, {payload}) => {
            state.userInfo = {...state.userInfo, ...payload.userInfo};
            localStorage.setItem('token', payload.userInfo.token)
            localStorage.setItem('email', payload.userInfo.email)
        },
        setRefresh: (state, {payload}) => {
            state.refresh = payload.refresh;
        }
    }
});


// 导出 reducers 方法
export const { setUserInfo, setRefresh } = userSlices.actions;

// 默认导出
export default userSlices.reducer;