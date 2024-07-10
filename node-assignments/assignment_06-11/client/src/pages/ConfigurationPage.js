import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { API_BASE_URL } from "../utils/config";
import { toast } from "react-toastify";
import Header from "../components/Header";

const ConfigurationPage = () => {
  const [categories, setCategories] = useState([]);

  const storedToken = localStorage.getItem("token");
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
  });
  const [newProduct, setNewProduct] = useState({
    name: "",
    availability: true,
    price: "",
    inventory: "",
    imageUrl: "",
    category: "",
  });

  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/categories`, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to fetch categories. Please try again later.");
    }
  }, [storedToken]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/api/categories`, newCategory, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });
      toast.success("Category created successfully!");
      setNewCategory({ name: "", description: "" });
      fetchCategories();
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error("Failed to add category. Please try again later.");
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", newProduct.name);
      formData.append("availability", newProduct.availability);
      formData.append("price", newProduct.price);
      formData.append("inventory", newProduct.inventory);
      formData.append("category", newProduct.category);
      formData.append("image", newProduct.imageUrl);

      await axios.post(`${API_BASE_URL}/api/products`, formData, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Product created successfully!");
      setNewProduct({
        name: "",
        availability: true,
        price: "",
        inventory: "",
        image: "",
        category: "",
      });
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Failed to add product. Please try again later.");
    }
  };

  return (
    <>
      <Header />

      <div className="container mx-auto">
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Category Management</h2>
          <form onSubmit={handleCategorySubmit} className="mb-4">
            <div className="flex mb-4">
              <input
                type="text"
                placeholder="Category Name"
                value={newCategory.name}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, name: e.target.value })
                }
                className="border px-2 py-1 rounded-md mr-2"
                required
              />
              <input
                type="text"
                placeholder="Category Description"
                value={newCategory.description}
                onChange={(e) =>
                  setNewCategory({
                    ...newCategory,
                    description: e.target.value,
                  })
                }
                className="border px-2 py-1 rounded-md mr-2"
                required
              />
              <button
                type="submit"
                className="bg-blue-500 text-white py-1 px-3 rounded-md"
              >
                Add Category
              </button>
            </div>
          </form>

          <h2 className="text-2xl font-semibold mb-4">Product Management</h2>
          <form onSubmit={handleProductSubmit} className="mb-4">
            <div className="flex mb-4">
              <input
                type="text"
                placeholder="Product Name"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, name: e.target.value })
                }
                className="border px-2 py-1 rounded-md mr-2"
                required
              />
              <input
                type="number"
                placeholder="Price"
                value={newProduct.price}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, price: e.target.value })
                }
                className="border px-2 py-1 rounded-md mr-2"
                required
              />
              <input
                type="number"
                placeholder="Inventory"
                value={newProduct.inventory}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, inventory: e.target.value })
                }
                className="border px-2 py-1 rounded-md mr-2"
                required
              />
              <select
                value={newProduct.category}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, category: e.target.value })
                }
                className="border px-2 py-1 rounded-md mr-2"
                required
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <input
                type="file"
                onChange={(e) =>
                  setNewProduct({ ...newProduct, imageUrl: e.target.files[0] })
                }
                className="border px-2 py-1 rounded-md mr-2"
                required
              />
              <button
                type="submit"
                className="bg-blue-500 text-white py-1 px-3 rounded-md"
              >
                Add Product
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ConfigurationPage;
