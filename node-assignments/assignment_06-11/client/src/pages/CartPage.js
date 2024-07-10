import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../utils/config";
import { toast } from "react-toastify";
import Header from "../components/Header";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const storedToken = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchAddresses = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/user/addresses`, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });
      setAddresses(response.data);
    } catch (error) {
      console.error("Error fetching addresses:", error);
      toast.error("Failed to fetch addresses. Please try again later.");
    }
  }, [storedToken]);

  useEffect(() => {
    if (!storedToken) {
      navigate("/login");
    } else {
      const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartItems(storedCart);
      fetchAddresses();
    }
  }, [storedToken, navigate, fetchAddresses]);

  const handlePlaceOrder = async () => {
    try {
      if (!selectedAddress) {
        toast.error("Please select an address.");
        return;
      }
      await axios.post(
        `${API_BASE_URL}/api/orders`,
        { cart: cartItems, addressId: selectedAddress },
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );
      toast.success("Order placed successfully!");
      localStorage.setItem("cart", "");
      setCartItems([]);
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order. Please try again later.");
    }
  };

  return (
    <div>
      <Header />
      <div className="container py-8">
        <h2 className="text-xl font-semibold mb-4">My Cart</h2>
        {cartItems.length === 0 ? (
          <p>No items in the cart.</p>
        ) : (
          <div className="space-y-4">
            {cartItems.map((item, index) => (
              <div key={index} className="border p-4 rounded-md">
                <h3 className="text-xl font-semibold">{item.product.name}</h3>
                <p>Price: ₹{item.product.price}</p>
                <p>Quantity: {item.quantity}</p>
              </div>
            ))}
            <div className="mt-4">
              <label
                htmlFor="address"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Select Address
              </label>
              <select
                id="address"
                name="address"
                value={selectedAddress}
                onChange={(e) => setSelectedAddress(e.target.value)}
                className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
              >
                <option value="">Select an address</option>
                {addresses.map((address) => (
                  <option key={address._id} value={address._id}>
                    {address.street}, {address.city}, {address.state},{" "}
                    {address.country} - {address.postalCode}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-4">
              <button
                onClick={handlePlaceOrder}
                className="w-full flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Place Order
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
