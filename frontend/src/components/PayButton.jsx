import axios from "axios";
import { useSelector } from "react-redux";
import { url } from "../slices/api";

const PayButton = ({ cartItems }) => {
  const user = useSelector((state) => state.auth);

  const handleCheckout = async () => {
    try {
      const response = await axios.post(`${url}/stripe/create-checkout-session`, {
        cartItems,
        userId: user._id,
      });

      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error("Error during checkout:", error.message);
    }
  };

  return (
    <button onClick={handleCheckout}>Check out</button>
  );
};

export default PayButton;
