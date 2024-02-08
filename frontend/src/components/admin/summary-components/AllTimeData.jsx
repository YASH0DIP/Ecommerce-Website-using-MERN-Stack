import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import axios from "axios";
import { setHeaders, url } from "../../../slices/api";
import { ordersFetch } from "../../../slices/ordersSlice";

const AllTimeData = () => {
    const { items } = useSelector((state) => state.products);
    const { list } = useSelector((state) => state.orders);
    const dispatch = useDispatch();
    const [totalUsers, setTotalUser] = useState(0);
    const [totalEarning, setTotalEarning] = useState(0);

    console.log("orders: ",list);

    useEffect(()=>{
        dispatch(ordersFetch());
    },[dispatch]);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await axios.get(`${url}/users/stats`, setHeaders());
                let total_users = 0;
                for (let i = 0; i < res.data.length; i++) {
                    total_users = total_users + res.data[i].total;
                }
                let total_earnings=0;

                for(let i=0;i<list.length;i++){
                    total_earnings = total_earnings + list[i].subtotal;
                }

                setTotalEarning(total_earnings);
                setTotalUser(total_users);
            } catch (err) {
                console.log(err);
            }
        }
        fetchData();
    });


    return (
        <Main>
            <h3>All Time</h3>
            <Info>
                <Title>Users</Title>
                <Data>{totalUsers}</Data>
            </Info>
            <Info>
                <Title>Products</Title>
                <Data>{items.length}</Data>
            </Info>
            <Info>
                <Title>Orders</Title>
                <Data>{list.length}</Data>
            </Info>
            <Info>
                <Title>Earnings</Title>
                <Data>${totalEarning}</Data>
            </Info>
        </Main>
    );
};

export default AllTimeData;

const Main = styled.div`
    background: rgb(48, 53, 78);
    color: rgba(234, 234, 255, 0.87);
    margin-top: 1.5rem;
    border-radius: 5px;
    padding: 1rem;
    font-size: 14px;
`;

const Info = styled.div`
    display: flex;
    margin-top: 1rem;
    padding: 0.3rem;
    border-radius: 3px;
    background: rgba(38, 198, 249, 0.12);
    &:nth-child(even) {
        background: rgba(102, 108, 255, 0.12);
    }
`;

const Title = styled.div`
    flex: 1;
`;

const Data = styled.div`
    flex: 1;
    font-weight: 700;
`;
