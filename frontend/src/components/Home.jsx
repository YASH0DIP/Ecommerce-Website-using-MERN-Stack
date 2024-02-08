import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { addToCart } from "../slices/cartSlice";
import { FaFacebookSquare, FaGithubSquare,FaInstagramSquare,FaLinkedin,FaMugHot, FaTwitterSquare } from "react-icons/fa";
import { MdCopyright } from "react-icons/md";
import { FaHeart } from "react-icons/fa6";

const Home = () => {
  const { items: data, status } = useSelector((state) => state.products);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    navigate("/cart");
  };

  const filteredData = data.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="home-container">
      <div className="header">
        <div>
          <h2>New Arrivals</h2>
        </div>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="image-slider">
        
      </div>

      <div className="products">
        {status === "success" ? (
          <>
            {filteredData.length > 0 ? (
              filteredData.map((product) => (
                <div key={product._id} className="product">
                  <Link to={`/product/${product._id}`}>
                    <h3>{product.name}</h3>
                    <img src={product.image?.url} alt={product.name} />
                  </Link>
                  <div className="details">
                    <span>{product.desc}</span>
                    <span className="price">${product.price}</span>
                  </div>
                  <button onClick={() => handleAddToCart(product)}>
                    Add To Cart
                  </button>
                </div>
              ))
            ) : (
              <p>No matching products found.</p>
            )}
          </>
        ) : status === "pending" ? (
          <p>Loading...</p>
        ) : (
          <p>Unexpected error occurred...</p>
        )}
      </div>
      <br/>
      <div className="footer">
        <hr />
        <div className="footer-items">
          <ul type="none"><b>About</b>
            <a href="#"><li>Contact US</li></a>
            <a href="#"><li><Link to="/about">About US</Link></li></a>
            <a href="#"><li>Hishtory US</li></a>
            <a href="#"><li>Press</li></a>
          </ul>

          <ul type="none"><b>Help</b>
            <a href="#"><li>Payments</li></a>
            <a href="#"><li>Shipping</li></a>
            <a href="#"><li>Cancellation and returns</li></a>
            <a href="#"><li>FAQ</li></a>
            
          </ul>

          <ul type="none"><b>Consumer Policy</b>
            <a href="#"><li>Cancellation and returns</li></a>
            <a href="#"><li>Terms of use</li></a>
            <a href="#"><li>Security</li></a>
            <a href="#"><li>Privacy</li></a>
          </ul>

          <ul type="none"><b>Social</b>
            <a href="#"><li>Facebook</li></a>
            <a href="#"><li>Instagram</li></a>
            <a href="#"><li>Twitter</li></a>
          </ul>

          <ul type="none"><b>Registered Office Address</b>
            <li>ACDYkart Private Limited,</li>
            <li>Near KKWIEER, Nashik,</li>
            <li>Maharashtra, India</li>
            <li>Mobile : 99999 99999</li>
          </ul>
          </div>
      </div>
      <div className="footer-container">
      <footer id="footer">

<section class="footicons">

  <a href="https://www.facebook.com/yashodip.jain.75/">
    <FaFacebookSquare className="footericons"/>
  </a>

  <a href="https://www.instagram.com/y.a.s.h.o.d.i.p/">
    <FaInstagramSquare className="footericons"/>
  </a>

  <a href="https://twitter.com/JainYashodip/">
    <FaTwitterSquare className="footericons"/>
  </a> 

  <a href="https://www.linkedin.com/in/yashodip-jain-212735192/">
    <FaLinkedin className="footericons"/>
  </a>

  <a href="https://github.com/Dev-Chirag07/">
    <FaGithubSquare className="footericons"/>
  </a>

</section>

<MdCopyright />
<b id="copyrights">2023 ACDYkart, All Rights Reserved</b>

<br/>

<span class="watermark">
  Made with <FaHeart/> and <FaMugHot/> in Nashik Maharashtra India.
</span>

</footer>
      </div>
    </div>
  );
};

export default Home;