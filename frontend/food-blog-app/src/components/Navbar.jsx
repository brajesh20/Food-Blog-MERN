import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import InputForm from "./inputForm";
import { NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const [isLogin, setIsLogin] = useState(token ? false : true);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLogin(token ? false : true);
  }, [token]);

  const checkLogin = () => {
    if (token) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("fav")
      setIsLogin(true);
      navigate("/");
    } else {
      setIsOpen(true);
    }
  };

  return (
    <>
      <header>
        <h2>Food Blog</h2>
        <ul>
          <li>
            <NavLink to="/">Home</NavLink>
          </li>
          <li onClick={() => isLogin && setIsOpen(true)}>
            <NavLink to={!isLogin ? "/myRecipe" : "/"}>My Recipe</NavLink>
          </li>
          <li onClick={() => isLogin && setIsOpen(true)}>
            <NavLink to={!isLogin ? "/favRecipe" : "/"}>Favourites</NavLink>
          </li>
          <li onClick={checkLogin}>
            <p className="login">
              {isLogin
                ? "Login"
                : `Logout (${user?.email.split("@")[0] || "Guest"})`}
            </p>
          </li>
        </ul>
      </header>
      {isOpen && (
        <Modal onClose={() => setIsOpen(false)}>
          <InputForm setIsOpen={() => setIsOpen(false)} />
        </Modal>
      )}
    </>
  );
};

export default Navbar;
