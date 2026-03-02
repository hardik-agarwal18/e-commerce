import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CartItems from "../Components/CartItems/CartItems";

const Cart = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    if (!token) {
      // Redirect to login page if user is not authenticated
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  // Only render cart if user is authenticated
  if (!localStorage.getItem("auth-token")) {
    return null;
  }

  return (
    <div>
      <CartItems />
    </div>
  );
};

export default Cart;
