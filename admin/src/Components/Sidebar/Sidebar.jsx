import "./Sidebar.css";
import { Link } from "react-router-dom";
import add_product_icon from "../../assets/Product_Cart.svg";
import list_product_icon from "../../assets/Product_list_icon.svg";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <Link to={"/addproduct"} style={{ textDecoration: "none" }}>
        <div className="sidebar-item">
          <img src={add_product_icon} alt="" />
          <p>Add Product</p>
        </div>
      </Link>
      <Link to={"/listproduct"} style={{ textDecoration: "none" }}>
        <div className="sidebar-item">
          <img src={list_product_icon} alt="" />
          <p>Product List</p>
        </div>
      </Link>
      <Link to={"/orders"} style={{ textDecoration: "none" }}>
        <div className="sidebar-item">
          <svg
            width="35"
            height="35"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 11H15M9 15H12M13 3H8.2C7.08 3 6.52 3 6.092 3.218C5.716 3.41 5.41 3.716 5.218 4.092C5 4.52 5 5.08 5 6.2V17.8C5 18.92 5 19.48 5.218 19.908C5.41 20.284 5.716 20.59 6.092 20.782C6.52 21 7.08 21 8.2 21H15.8C16.92 21 17.48 21 17.908 20.782C18.284 20.59 18.59 20.284 18.782 19.908C19 19.48 19 18.92 19 17.8V9M13 3L19 9M13 3V7.4C13 7.96 13 8.24 13.109 8.454C13.204 8.642 13.358 8.796 13.546 8.891C13.76 9 14.04 9 14.6 9H19"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p>Order Management</p>
        </div>
      </Link>
    </div>
  );
};

export default Sidebar;
