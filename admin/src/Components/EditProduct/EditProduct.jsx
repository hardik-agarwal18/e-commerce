import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./EditProduct.css";
import upload_area from "../../assets/upload_area.svg";
import { axiosInstance } from "../../lib/axios";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [image, setImage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [productDetails, setProductDetails] = useState({
    id: "",
    name: "",
    image: "",
    category: "women",
    new_price: "",
    old_price: "",
  });
  const [sizeStock, setSizeStock] = useState({
    S: 0,
    M: 0,
    L: 0,
    XL: 0,
    XXL: 0,
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axiosInstance.get(`/products/product/${id}`);
        if (response.data.success) {
          const product = response.data.product;
          setProductDetails({
            id: product._id,
            name: product.name,
            image: product.image,
            category: product.category,
            new_price: product.new_price,
            old_price: product.old_price,
          });
          setSizeStock(
            product.sizeStock || {
              S: 0,
              M: 0,
              L: 0,
              XL: 0,
              XXL: 0,
            },
          );
        } else {
          alert("Product not found");
          navigate("/listproduct");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        alert("Failed to fetch product details");
        navigate("/listproduct");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const imageHandler = (e) => {
    setImage(e.target.files[0]);
  };

  const changeHandler = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
  };

  const sizeStockHandler = (e) => {
    const { name, value } = e.target;
    setSizeStock({ ...sizeStock, [name]: parseInt(value) || 0 });
  };

  const updateProduct = async () => {
    try {
      let product = { ...productDetails };

      // If new image is uploaded, upload it first
      if (image) {
        let formData = new FormData();
        formData.append("product", image);

        const uploadRes = await axiosInstance.post("/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (uploadRes.data.success) {
          product.image = uploadRes.data.image_url;
        } else {
          alert("Failed to upload image");
          return;
        }
      }

      product.sizeStock = sizeStock;

      // Calculate total stock from size stock
      const totalStock = Object.values(sizeStock).reduce(
        (sum, qty) => sum + qty,
        0,
      );
      product.stock = totalStock;

      // Update product
      const updateRes = await axiosInstance.put(
        "/products/updateproduct",
        product,
      );

      if (updateRes.data.success) {
        alert("Product updated successfully");
        navigate("/listproduct");
      } else {
        alert("Failed to update product");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to update product");
    }
  };

  if (loading) {
    return (
      <div className="edit-product loading-container">
        <div className="spinner-large"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  return (
    <div className="edit-product">
      <h1>Edit Product</h1>
      <div className="editproduct-itemfield">
        <p>Product Title</p>
        <input
          value={productDetails.name}
          onChange={changeHandler}
          type="text"
          placeholder="Type Here"
          name="name"
        />
      </div>
      <div className="editproduct-price">
        <div className="editproduct-itemfield">
          <p>Price</p>
          <input
            value={productDetails.old_price}
            onChange={changeHandler}
            type="text"
            name="old_price"
            placeholder="Type Here"
          />
        </div>
        <div className="editproduct-itemfield">
          <p>Offer Price</p>
          <input
            value={productDetails.new_price}
            onChange={changeHandler}
            type="text"
            name="new_price"
            placeholder="Type Here"
          />
        </div>
      </div>
      <div className="editproduct-itemfield">
        <p>Product Category</p>
        <select
          value={productDetails.category}
          onChange={changeHandler}
          name="category"
          className="edit-product-selector"
        >
          <option value="women">Women</option>
          <option value="men">Men</option>
          <option value="kid">Kids</option>
        </select>
      </div>

      <div className="editproduct-itemfield">
        <p>Stock by Size</p>
        <div className="size-stock-container">
          {Object.keys(sizeStock).map((size) => (
            <div key={size} className="size-stock-item">
              <label>{size}</label>
              <input
                type="number"
                name={size}
                value={sizeStock[size]}
                onChange={sizeStockHandler}
                min="0"
                placeholder="0"
              />
            </div>
          ))}
        </div>
        <p className="total-stock-info">
          Total Stock:{" "}
          {Object.values(sizeStock).reduce((sum, qty) => sum + qty, 0)} items
        </p>
      </div>
      <div className="editproduct-itemfield">
        <p>Product Image</p>
        <label htmlFor="file-input">
          <img
            src={
              image
                ? URL.createObjectURL(image)
                : productDetails.image || upload_area
            }
            alt=""
            className="editproduct-thumbnail-img"
          />
        </label>
        <input
          onChange={imageHandler}
          type="file"
          name="image"
          id="file-input"
          hidden
        />
        <p className="image-note">
          {image ? "New image selected" : "Click to change image"}
        </p>
      </div>
      <div className="editproduct-actions">
        <button onClick={updateProduct} className="editproduct-button update">
          UPDATE PRODUCT
        </button>
        <button
          onClick={() => navigate("/listproduct")}
          className="editproduct-button cancel"
        >
          CANCEL
        </button>
      </div>
    </div>
  );
};

export default EditProduct;
