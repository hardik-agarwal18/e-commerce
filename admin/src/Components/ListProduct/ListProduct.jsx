import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ListProduct.css";
import cross_icon from "../../assets/cross_icon.png";
import { axiosInstance } from "../../lib/axios";

const ListProduct = () => {
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState([]);
  const [expandedProduct, setExpandedProduct] = useState(null);

  const fetchInfo = async () => {
    try {
      const response = await axiosInstance.get("/products/getallproducts");
      setAllProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  const remove_product = async (id) => {
    try {
      await axiosInstance.post("/products/removeproduct", { id: id });
      await fetchInfo();
    } catch (error) {
      console.error("Error removing product:", error);
    }
  };

  const getTotalStock = (product) => {
    if (product.sizeStock) {
      return Object.values(product.sizeStock).reduce(
        (sum, qty) => sum + qty,
        0,
      );
    }
    return product.stock || 0;
  };

  const toggleStockDetails = (productId) => {
    setExpandedProduct(expandedProduct === productId ? null : productId);
  };

  const editProduct = (productId) => {
    navigate(`/editproduct/${productId}`);
  };

  return (
    <div className="list-product">
      <h1>All Products List</h1>
      <div className="listproduct-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Old Price</p>
        <p>New Price</p>
        <p>Category</p>
        <p>Stock</p>
        <p>Actions</p>
      </div>
      <div className="listproduct-allproducts">
        <hr />
        {allProducts.map((product, index) => {
          const totalStock = getTotalStock(product);
          const isExpanded = expandedProduct === product._id;

          return (
            <div key={product._id}>
              <div className="listproduct-format-main listproduct-format">
                <img
                  src={product.image}
                  alt=""
                  className="listproduct-product-icon"
                />
                <p>{product.name}</p>
                <p>${product.old_price}</p>
                <p>${product.new_price}</p>
                <p>{product.category}</p>
                <div className="stock-cell">
                  <span
                    className={`stock-badge ${totalStock <= 5 ? "low-stock" : ""} ${totalStock === 0 ? "out-of-stock" : ""}`}
                    onClick={() =>
                      product.sizeStock && toggleStockDetails(product._id)
                    }
                    style={{
                      cursor: product.sizeStock ? "pointer" : "default",
                    }}
                  >
                    {totalStock}
                    {product.sizeStock && (
                      <span className="expand-icon">
                        {isExpanded ? "▼" : "▶"}
                      </span>
                    )}
                  </span>
                </div>
                <div className="listproduct-actions">
                  <button
                    className="listproduct-edit-btn"
                    onClick={() => editProduct(product._id)}
                    title="Edit Product"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z"
                        fill="currentColor"
                      />
                    </svg>
                  </button>
                  <button
                    className="listproduct-delete-btn"
                    onClick={() => remove_product(product._id)}
                    title="Delete Product"
                  >
                    <img src={cross_icon} alt="Delete" />
                  </button>
                </div>
              </div>
              {isExpanded && product.sizeStock && (
                <div className="size-stock-details">
                  <h4>Stock by Size:</h4>
                  <div className="size-stock-grid">
                    {Object.entries(product.sizeStock).map(([size, qty]) => (
                      <div key={size} className="size-stock-badge">
                        <span className="size-label">{size}</span>
                        <span
                          className={`size-qty ${qty <= 3 ? "low" : ""} ${qty === 0 ? "empty" : ""}`}
                        >
                          {qty}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <hr />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ListProduct;
