import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { logoutUser } from "../slices/authSlice";
import { toast } from "react-toastify";

const NavBar = () => {
  const dispatch = useDispatch();
  const { cartTotalQuantity } = useSelector((state) => state.cart);
  const auth = useSelector((state) => state.auth);
  const navigate = useNavigate();

  console.log(auth);

  return (
    <nav className="nav-bar">
      <Link to="/">
        <h2>ACDYkart</h2>
      </Link>
      
      {auth._id ? (
        <Links>
          <div>
          
          {auth.isAdmin ? (
            <div className="admin_title">
              <Link to="/admin/summary">Admin</Link>
            </div>
          ) : (
            <div className="admin_title">
              <Link to="/cart">{auth.name}</Link>
            </div>
          )
          }
          </div>
          
          <div className="logout_title"
            onClick={() => {
              dispatch(logoutUser(null));
              toast.warning("Logged out!", { position: "bottom-left" });
              navigate("/");
            }}
          >
            Logout
          </div>
          
          {auth.isAdmin ? null : (
            <div className="orders-title">
            <Link to="/orderview">Orders</Link>
            </div>
          )}
          
          <Link to="/cart">
        <div className="nav-bag">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="35"
            height="35"
            fill="currentColor"
            className="bi bi-handbag-fill"
            viewBox="0 0 16 16"
          >
            <path d="M8 1a2 2 0 0 0-2 2v2H5V3a3 3 0 1 1 6 0v2h-1V3a2 2 0 0 0-2-2zM5 5H3.36a1.5 1.5 0 0 0-1.483 1.277L.85 13.13A2.5 2.5 0 0 0 3.322 16h9.355a2.5 2.5 0 0 0 2.473-2.87l-1.028-6.853A1.5 1.5 0 0 0 12.64 5H11v1.5a.5.5 0 0 1-1 0V5H6v1.5a.5.5 0 0 1-1 0V5z" />
          </svg>
          <span className="bag-quantity">
            <span>{cartTotalQuantity}</span>
          </span>
        </div>
      </Link>
        </Links>
        
      ) : (
        <AuthLinks>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </AuthLinks>
      )}
    </nav>
  );
};

export default NavBar;

const AuthLinks = styled.div`
  a {
    &:last-child {
      margin-left: 2rem;
    }
  }
`;

const Links = styled.div`
  color: white;
  display: flex;

  div {
    cursor: pointer;

    &:last-child {
      margin-left: 2rem;
    }
  }
`;
