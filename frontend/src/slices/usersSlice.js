import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { url, setHeaders } from "./api";
import { toast } from "react-toastify";

const initialState = {
    list: [],
    status: null,
    deleteStatus: null,
};

export const usersFetch = createAsyncThunk("users/usersFetch", async () => {
    try {
        const response = await axios.get(`${url}/users`, setHeaders());
        return response.data;
    } catch (err) {
        console.error(err);
    }
});

export const userDelete = createAsyncThunk("users/userDelete", async (id) => {
    try {
        const response = await axios.delete(`${url}/users/${id}`, setHeaders());
        return response.data;
    } catch (err) {
        console.error(err);
        const errorMessage = err.response?.data || "Error deleting user";
        toast.error(errorMessage, { position: "bottom-left" });
        throw err; // Rethrow the error to propagate it to the component
    }
});

const usersSlice = createSlice({
    name: "users",
    initialState,
    reducers: {},
    extraReducers: {
        [usersFetch.pending]: (state, action) => {
            state.status = "pending";
        },
        [usersFetch.fulfilled]: (state, action) => {
            state.list = action.payload;
            state.status = "success";
        },
        [usersFetch.rejected]: (state, action) => {
            state.status = "rejected";
        },
        [userDelete.pending]: (state, action) => {
            state.deleteStatus = "pending";
        },
        [userDelete.fulfilled]: (state, action) => {
            const deletedUserId = action.payload?._id;

            if (deletedUserId) {
                const newList = state.list.filter((user) => user._id !== deletedUserId);
                state.list = newList;
                state.deleteStatus = "success";
                toast.error("User Deleted", { position: "bottom-left" });
            } else {
                // Handle the case where the deleted user is not found
                console.warn("Deleted user not found in the list");
            }
        },
        [userDelete.rejected]: (state, action) => {
            state.deleteStatus = "rejected";
        },
    },
});

export default usersSlice.reducer;
