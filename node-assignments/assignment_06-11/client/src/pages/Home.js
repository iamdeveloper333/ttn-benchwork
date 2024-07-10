import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../utils/config";
import { toast } from "react-toastify";
import Header from "../components/Header";

const Home = () => {
  const storedToken = localStorage.getItem("token");
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/products`, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to fetch products. Please try again later.");
    }
  }, [storedToken]);

  useEffect(() => {
    if (!storedToken) {
      navigate("/login");
    } else {
      fetchProducts();
    }
  }, [fetchProducts, navigate, storedToken]);

  const addToCart = (product) => {
    const existingProduct = cart.find(
      (item) => item.product._id === product._id
    );

    if (existingProduct) {
      if (existingProduct.quantity < product.inventory) {
        setCart((prevCart) =>
          prevCart.map((item) =>
            item.product._id === product._id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        );
        toast.info(`Added one more ${product.name} to the cart.`);
      } else {
        toast.warn(`Maximum quantity reached for ${product.name}.`);
      }
    } else {
      if (product.inventory > 0) {
        setCart((prevCart) => [...prevCart, { product, quantity: 1 }]);
        toast.success(`${product.name} added to the cart.`);
      } else {
        toast.error(`Cannot add ${product.name} to the cart. Out of stock.`);
      }
    }

    localStorage.setItem("cart", JSON.stringify(cart));
  };

  const handleGoToCart = () => {
    navigate("/cart");
  };

  return (
    <div>
      <Header />
      <div className="container mx-auto">
        <h2 className="text-2xl font-semibold mb-4">All Items</h2>
        <div className="grid grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product._id} className="border p-4 rounded-md">
              <h3 className="font-semibold">{product.name}</h3>
              <p>Price: ₹{product.price}</p>
              <p>Inventory: {product.inventory}</p>
              <p>Category: {product.category.name}</p>
              <img
                src={product.imageUrl}
                alt={product.name}
                className="mt-2 h-24 object-cover"
              />
              <button
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                onClick={() => addToCart(product)}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
        {cart.length > 0 && (
          <div className="mt-6">
            <button
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
              onClick={handleGoToCart}
            >
              Go to Cart
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
