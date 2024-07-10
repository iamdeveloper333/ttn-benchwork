import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { API_BASE_URL } from "../utils/config";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState({});
  const navigate = useNavigate();
  const storedToken = localStorage.getItem("token");

  const fetchOrders = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/orders`, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders. Please try again later.");
    }
  }, [storedToken]);

  const fetchAddresses = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/user/addresses`, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });
      const addressMap = {};

      response.data.forEach((address) => {
        addressMap[address._id] = address;
      });
      setAddresses(addressMap);
    } catch (error) {
      console.error("Error fetching addresses:", error);
      toast.error("Failed to fetch addresses. Please try again later.");
    }
  }, [storedToken]);

  useEffect(() => {
    if (!storedToken) {
      navigate("/login");
    } else {
      fetchOrders();
      fetchAddresses();
    }
  }, [fetchOrders, fetchAddresses, navigate, storedToken]);

  return (
    <div>
      <Header />
      <div className="container mx-auto py-8">
        <h2 className="text-2xl font-semibold mb-4">My Orders</h2>
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="border p-4 rounded-md">
                <h3 className="text-xl font-semibold">Order ID: {order._id}</h3>
                <p>Total Price: ₹{order.totalPrice}</p>
                <p>
                  Order Date: {new Date(order.createdAt).toLocaleDateString()}
                </p>
                <p>
                  Address:{" "}
                  {addresses[order.address]
                    ? `${addresses[order.address].street}, ${
                        addresses[order.address].city
                      }, ${addresses[order.address].state}, ${
                        addresses[order.address].country
                      } - ${addresses[order.address].postalCode}`
                    : "Address details unavailable"}
                </p>
                <div className="mt-2">
                  <h4 className="text-lg font-semibold">Items:</h4>
                  <ul className="list-disc list-inside">
                    {order.items.map((item) => (
                      <li key={item._id}>
                        {item.product.name} - {item.quantity} x ₹{item.price}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage;
