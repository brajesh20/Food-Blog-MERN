import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AddRecipe from "./pages/AddRecipe";
import EditRecipe from "./pages/EditRecipe";

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/myRecipe" element={<Home />} />
        <Route path="/favRecipe" element={<Home />} />
        <Route path="/addRecipe" element={<AddRecipe />} />
        <Route path="/editRecipe/:id" element={<EditRecipe />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
