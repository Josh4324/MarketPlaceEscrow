import React from "react";
import { Route, Routes, BrowserRouter, useLocation } from "react-router-dom";
import Detail from "./pages/Detail";
import Home from "./pages/Home";
import MyProduct from "./pages/MyProduct";
import Product from "./pages/Product";
import Products from "./pages/Products";
import Profile from "./pages/Profile";

export default function AnimatedRoutes(prop) {
  const location = useLocation();
  return (
    <div>
      <Routes location={location} key={location.pathname}>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/profile" element={<Profile />} />
        <Route exact path="/product" element={<Product />} />
        <Route exact path="/products" element={<Products />} />
        <Route exact path="/myproducts" element={<MyProduct />} />
        <Route exact path="/product/:id" element={<Detail />} />
      </Routes>
    </div>
  );
}
