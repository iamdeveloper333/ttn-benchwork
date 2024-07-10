import React from "react";
import { ToastContainer } from "react-toastify";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Home from "./pages/Home";
import ConfigurationPage from "./pages/ConfigurationPage";
import UpdateProfilePage from "./pages/UpdateProfilePage";
import UserAddressPage from "./pages/UserAddressPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import CartPage from "./pages/CartPage";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    { path: "/login", element: <LoginPage /> },
    { path: "/register", element: <RegisterPage /> },
    { path: "/configuration", element: <ConfigurationPage /> },
    { path: "/profile", element: <UpdateProfilePage /> },
    { path: "/user-address", element: <UserAddressPage /> },
    { path: "/my-orders", element: <MyOrdersPage /> },
    { path: "/cart", element: <CartPage /> },
  ]);

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  );
};

export default App;
