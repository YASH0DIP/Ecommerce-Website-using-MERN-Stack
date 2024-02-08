import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled, { keyframes } from "styled-components";
import { clearCart, getTotals } from "../slices/cartSlice";

const checkmarkAnimation = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.5);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
`;

const CheckoutSuccess = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(clearCart());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getTotals());
  }, [cart, dispatch]);

  return (
    <Container className="main-checkout-container">
      
      <div className="checkout-img-container">
        <img src="https://img.freepik.com/premium-vector/delivery-man-courier-shipping-order-with-bag-riding-scooter-concept-illustration_270158-298.jpg" alt="order is on the way!" />
      </div>
      
      <div className="order-successful-animation">
        
        <CheckmarkIcon role="img" aria-label="Checkmark">
          ✔️
        </CheckmarkIcon>
      </div>
      <h2>Checkout Successful</h2>
      <p>Your order might take some time to process.</p>
      <p>Check your order status at your profile after about 10 mins.</p>
      <p>
        In case of any inquiries, contact the support at{" "}
        <strong>support@acdykart.com</strong>
      </p>
      
    </Container>
  );
};

export default CheckoutSuccess;

const Container = styled.div`
  min-height: 80vh;
  max-width: 800px;
  width: 100%;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  h2 {
    margin-bottom: 0.5rem;
    color: #029e02;
  }
`;

const CheckmarkIcon = styled.span`
  display: inline-block;
  font-size: 3.5rem;
  color: green;
  animation: ${checkmarkAnimation} 0.5s ease-in-out;
`;
