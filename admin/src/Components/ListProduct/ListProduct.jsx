import { useEffect, useState } from "react";
import "./ListProduct.css";
import cross_icon from "../../assets/cross_icon.png";
import { axiosInstance } from "../../lib/axios";

const ListProduct = () => {
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
        <p>Remove</p>
      </div>
      <div className="listproduct-allproducts">
        <hr />
        {allProducts.map((product, index) => {
          const totalStock = getTotalStock(product);
          const isExpanded = expandedProduct === product.id;

          return (
            <div key={index}>
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
                      product.sizeStock && toggleStockDetails(product.id)
                    }
                    style={{
                      cursor: product.sizeStock ? "pointer" : "default",
                    }}
                  >
                    {totalStock}
                    {product.sizeStock && (
                      <span className="expand-icon">
                        {isExpanded ? "▲" : "▼"}
                      </span>
                    )}
                  </span>
                </div>
                <img
                  onClick={() => {
                    remove_product(product.id);
                  }}
                  src={cross_icon}
                  alt=""
                  className="listproduct-remove-icon"
                />
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
