import React, { useState, useEffect, useContext } from "react";
import { ShopContext } from "../Context/ShopContext";
import { axiosInstance } from "../lib/axios";
import "./CSS/Checkout.css";

const Checkout = () => {
  const { all_product, cartItems, getTotalcartAmount } =
    useContext(ShopContext);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newAddress, setNewAddress] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    isDefault: false,
  });

  // Get cart items for display
  const cartProducts = all_product.filter(
    (product) => cartItems[product.id] > 0
  );

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await axiosInstance.get("/api/user/addresses", {
        headers: {
          "auth-token": localStorage.getItem("auth-token"),
        },
      });

      if (response.data.success) {
        setAddresses(response.data.addresses);
        // Auto-select default address if available
        const defaultAddress = response.data.addresses.find(
          (addr) => addr.isDefault
        );
        if (defaultAddress) {
          setSelectedAddress(defaultAddress._id);
        }
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      alert("Error fetching addresses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post(
        "/api/user/add-address",
        newAddress,
        {
          headers: {
            "auth-token": localStorage.getItem("auth-token"),
          },
        }
      );

      if (response.data.success) {
        await fetchAddresses();
        setShowAddForm(false);
        setNewAddress({
          fullName: "",
          phone: "",
          street: "",
          city: "",
          state: "",
          postalCode: "",
          country: "India",
          isDefault: false,
        });
        alert("Address added successfully!");
      }
    } catch (error) {
      console.error("Error adding address:", error);
      alert("Error adding address. Please try again.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewAddress((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePlaceOrder = () => {
    if (!selectedAddress) {
      alert("Please select a delivery address");
      return;
    }

    // Here you would typically integrate with a payment gateway
    // For now, we'll just show a success message
    alert("Order placed successfully! Redirecting to payment...");
    // You can add order processing logic here
  };

  if (loading) {
    return <div className="checkout-loading">Loading...</div>;
  }

  return (
    <div className="checkout">
      <div className="checkout-container">
        <div className="checkout-left">
          <div className="delivery-address">
            <h2>Delivery Address</h2>

            {addresses.length === 0 ? (
              <div className="no-addresses">
                <p>No addresses found. Please add a delivery address.</p>
                <button
                  className="add-address-btn"
                  onClick={() => setShowAddForm(true)}
                >
                  Add New Address
                </button>
              </div>
            ) : (
              <>
                <div className="address-list">
                  {addresses.map((address) => (
                    <div
                      key={address._id}
                      className={`address-card ${
                        selectedAddress === address._id ? "selected" : ""
                      }`}
                      onClick={() => setSelectedAddress(address._id)}
                    >
                      <input
                        type="radio"
                        name="address"
                        value={address._id}
                        checked={selectedAddress === address._id}
                        onChange={() => setSelectedAddress(address._id)}
                      />
                      <div className="address-details">
                        <h4>{address.fullName}</h4>
                        <p>{address.street}</p>
                        <p>
                          {address.city}, {address.state} - {address.postalCode}
                        </p>
                        <p>{address.country}</p>
                        <p>Phone: {address.phone}</p>
                        {address.isDefault && (
                          <span className="default-badge">Default</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  className="add-new-address-btn"
                  onClick={() => setShowAddForm(true)}
                >
                  + Add New Address
                </button>
              </>
            )}

            {showAddForm && (
              <div className="add-address-form">
                <h3>Add New Address</h3>
                <form onSubmit={handleAddAddress}>
                  <div className="form-group">
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Full Name *"
                      value={newAddress.fullName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number *"
                      value={newAddress.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <input
                      type="text"
                      name="street"
                      placeholder="Street Address *"
                      value={newAddress.street}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-row">
                    <input
                      type="text"
                      name="city"
                      placeholder="City *"
                      value={newAddress.city}
                      onChange={handleInputChange}
                      required
                    />
                    <input
                      type="text"
                      name="state"
                      placeholder="State *"
                      value={newAddress.state}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-row">
                    <input
                      type="text"
                      name="postalCode"
                      placeholder="Postal Code *"
                      value={newAddress.postalCode}
                      onChange={handleInputChange}
                      required
                    />
                    <input
                      type="text"
                      name="country"
                      placeholder="Country"
                      value={newAddress.country}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        name="isDefault"
                        checked={newAddress.isDefault}
                        onChange={handleInputChange}
                      />
                      Set as default address
                    </label>
                  </div>

                  <div className="form-buttons">
                    <button type="submit" className="save-address-btn">
                      Save Address
                    </button>
                    <button
                      type="button"
                      className="cancel-btn"
                      onClick={() => setShowAddForm(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>

        <div className="checkout-right">
          <div className="order-summary">
            <h2>Order Summary</h2>

            <div className="cart-items">
              {cartProducts.map((item) => (
                <div key={item.id} className="checkout-item">
                  <img src={item.image} alt={item.name} />
                  <div className="item-details">
                    <h4>{item.name}</h4>
                    <p>Quantity: {cartItems[item.id]}</p>
                    <p className="item-price">
                      ₹{item.new_price * cartItems[item.id]}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="price-details">
              <div className="price-row">
                <span>Subtotal:</span>
                <span>₹{getTotalcartAmount()}</span>
              </div>
              <div className="price-row">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <div className="price-row total">
                <span>Total:</span>
                <span>₹{getTotalcartAmount()}</span>
              </div>
            </div>

            <button
              className="place-order-btn"
              onClick={handlePlaceOrder}
              disabled={!selectedAddress || cartProducts.length === 0}
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
