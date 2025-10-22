import { createSlice } from "@reduxjs/toolkit";

const filterSlice = createSlice({
    name: "filter",
    initialState: {
        budget: [4000, 9000],
        headCount: 1,
    },
    reducers: {
        setBudget: (state, action) => {
            state.budget = action.payload;
        },


        setHeadCount: (state, action) => {
            state.headCount = action.payload;
        },
    },
});

export const { setBudget, setHeadCount } = filterSlice.actions;

export default filterSlice.reducer;
