import "./css/Admin.css";
import Sidebar from "../../Components/Sidebar/Sidebar";
import { Routes, Route } from "react-router-dom";
import AddProduct from "../../Components/AddProduct/AddProduct";
import ListProduct from "../../Components/ListProduct/ListProduct";
import EditProduct from "../../Components/EditProduct/EditProduct";
import OrderManagement from "../../Components/OrderManagement/OrderManagement";
import Dashboard from "./Dashboard";

const Admin = () => {
  return (
    <div className="admin">
      <Sidebar />
      <Routes>
        <Route path="/addproduct" element={<AddProduct />} />
        <Route path="/listproduct" element={<ListProduct />} />
        <Route path="/editproduct/:id" element={<EditProduct />} />
        <Route path="/orders" element={<OrderManagement />} />
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </div>
  );
};

export default Admin;
