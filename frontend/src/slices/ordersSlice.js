import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { url, setHeaders } from "./api";

const initialState = {
    list: [],
    status: null,
};

export const ordersFetch = createAsyncThunk("orders/ordersFetch", async () => {
    try {
        const response = await axios.get(`${url}/orders`, setHeaders());
        return response.data;
    } catch (err) {
        console.error(err);
        throw err; // Rethrow the error to propagate it to the component
    }
});

export const ordersEdit = createAsyncThunk(
    "orders/ordersEdit",
    async (values, { getState }) => {
        const state = getState();

        let currentOrder = state.orders.list.filter(
            (order) => order.id === values.id
        );

        const newOrder = {
            ...currentOrder[0],
            delivery_status: values.delivery_status,
        };

        try {
            const response = await axios.put(
                `${url}/orders/${values.id}`,
                newOrder,
                setHeaders()
            );

            return response.data;
        } catch (err) {
            console.error(err);
            throw err; // Rethrow the error to propagate it to the component
        }
    }
);

const ordersSlice = createSlice({
    name: "orders",
    initialState,
    reducers: {},
    extraReducers: {
        [ordersFetch.pending]: (state) => {
            state.status = "pending";
        },
        [ordersFetch.fulfilled]: (state, action) => {
            state.list = action.payload;
            state.status = "success";
        },
        [ordersFetch.rejected]: (state) => {
            state.status = "rejected";
        },
        [ordersEdit.pending]: (state) => {
            state.status = "pending";
        },
        [ordersEdit.fulfilled]: (state, action) => {
            const updatedOrders = state.list.map((order) =>
                order._id === action.payload._id ? action.payload : order
            );
            state.list = updatedOrders;
            state.status = "success";
        },
        [ordersEdit.rejected]: (state) => {
            state.status = "rejected";
        },
    },
});


export default ordersSlice.reducer; // Corrected from `.reducers` to `.reducer`