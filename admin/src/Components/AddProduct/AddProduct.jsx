import { useState } from "react";
import "./AddProduct.css";
import upload_area from "../../assets/upload_area.svg";
import { axiosInstance } from "../../lib/axios";

const AddProduct = () => {
  const [image, setImage] = useState(false);
  const [productDetails, setProductDetails] = useState({
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

  const Add_Product = async () => {
    console.log(productDetails);
    let product = { ...productDetails };

    let formData = new FormData();
    formData.append("product", image);

    try {
      // Upload image first
      const uploadRes = await axiosInstance.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (uploadRes.data.success) {
        product.image = uploadRes.data.image_url;
        product.sizeStock = sizeStock;

        // Calculate total stock from size stock
        const totalStock = Object.values(sizeStock).reduce(
          (sum, qty) => sum + qty,
          0,
        );
        product.stock = totalStock;

        console.log(product);

        // Add product
        const addProductRes = await axiosInstance.post(
          "/products/addproduct",
          product,
        );

        if (addProductRes.data.success) {
          alert("Product added successfully");
          // Reset form
          setProductDetails({
            name: "",
            image: "",
            category: "women",
            new_price: "",
            old_price: "",
          });
          setSizeStock({ S: 0, M: 0, L: 0, XL: 0, XXL: 0 });
          setImage(false);
        } else {
          alert("Failed to add product");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to add product");
    }
  };

  return (
    <div className="add-product">
      <div className="addproduct-itemfield">
        <p>Product Title</p>
        <input
          value={productDetails.name}
          onChange={changeHandler}
          type="text"
          placeholder="Type Here"
          name="name"
        />
      </div>
      <div className="addprouct-price">
        <div className="addproduct-itemfield">
          <p>Price</p>
          <input
            value={productDetails.old_price}
            onChange={changeHandler}
            type="text "
            name="old_price"
            placeholder="Type Here"
          />
        </div>
        <div className="addproduct-itemfield">
          <p>Offer Price</p>
          <input
            value={productDetails.new_price}
            onChange={changeHandler}
            type="text "
            name="new_price"
            placeholder="Type Here"
          />
        </div>
      </div>
      <div className="addproduct-itemfield">
        <p>Product Category</p>
        <select
          value={productDetails.category}
          onChange={changeHandler}
          name="category"
          className="add-product-selector"
        >
          <option value="women">Women</option>
          <option value="men">Men</option>
          <option value="kid">Kids</option>
        </select>
      </div>

      <div className="addproduct-itemfield">
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
      <div className="addproduct-itemfield">
        <label htmlFor="file-input">
          <img
            src={image ? URL.createObjectURL(image) : upload_area}
            alt=""
            className="addproduct-thumbnail-img"
          />
        </label>
        <input
          onChange={imageHandler}
          type="file"
          name="image"
          id="file-input"
          hidden
        />
      </div>
      <button
        onClick={() => {
          Add_Product();
        }}
        className="addproduct-button"
      >
        ADD
      </button>
    </div>
  );
};

export default AddProduct;
