import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import foodRecipe from "../assets/foodRecipe.png";
import { BsStopwatchFill } from "react-icons/bs";
import { FaHeart, FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Modal from "../components/Modal";
import InputForm from "../components/inputForm";

const Home = () => {
  const [allRecipe, setRecipe] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isFavRecipe, setIsFavRecipe] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  let path = location.pathname === "/myRecipe" ? true : false;
  let favItems = JSON.parse(localStorage.getItem("fav")) ?? [];

  const favRecipe = (item) => {
    let favItems = JSON.parse(localStorage.getItem("fav")) ?? [];

    const isFav = favItems.some((rec) => rec._id === item._id);

    if (!isFav) favItems = [...favItems, item];
    else favItems = favItems.filter((rec) => rec._id !== item._id);

    localStorage.setItem("fav", JSON.stringify(favItems));
    setIsFavRecipe(!isFav);
  };

  const addRecipe = () => {
    let token = localStorage.getItem("token");
    if (token) navigate("/addRecipe");
    else setIsOpen(true);
  };

  const onDelete = async (id) => {
    await axios
      .delete(`http://localhost:5000/recipe/${id}`)
      .then((response) => console.log(response));
    setRecipe((prevRecipes) => prevRecipes.filter((rec) => rec._id !== id));
    let updatedFavItems = favItems.filter((fav) => fav._id !== id);
    localStorage.setItem("fav", JSON.stringify(updatedFavItems));
  };

  const fetchRecipes = async () => {
    try {
      const res = await axios.get("http://localhost:5000/recipe");
      return res.data;
    } catch (err) {
      console.error("Error fetching recipes:", err.message);
      return [];
    }
  };

  const getMyRecipe = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      console.log("No user found in localStorage.");
      return [];
    }
    const allRecipes = await fetchRecipes();
    const myRecipes = allRecipes.filter((item) => item.createdBy === user._id);
    return myRecipes;
  };

  const getFavRecipes = () => {
    return JSON.parse(localStorage.getItem("fav"));
  };

  useEffect(() => {
    const loadRecipes = async () => {
      let recipes = [];
      if (location.pathname === "/myRecipe") {
        recipes = await getMyRecipe();
      } else if (location.pathname === "/") {
        recipes = await fetchRecipes();
      } else if (location.pathname === "/favRecipe") {
        recipes = getFavRecipes();
      }

      setRecipe(recipes);
    };

    loadRecipes();
  }, [location.pathname]);

  return (
    <>
      <section className="home">
        <div className="left">
          <h1>Food Recipe</h1>
          <h5>
            It is a long established fact that a reader will be distracted by
            the readable content of a page when looking at its layout.
          </h5>
          <button onClick={addRecipe}>Share your recipe</button>
        </div>
        <div className="right">
          <img
            src={foodRecipe}
            alt="Food Recipe"
            width="320px"
            height="300px"
          />
        </div>
      </section>
      <div className="bg">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path
            fill="#d4f6e8"
            fillOpacity="1"
            d="M0,32L40,32C80,32,160,32,240,58.7C320,85,400,139,480,149.3C560,160,640,128,720,101.3C800,75,880,53,960,80C1040,107,1120,181,1200,213.3C1280,245,1360,235,1400,229.3L1440,224L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"
          ></path>
        </svg>
      </div>
      {isOpen && (
        <Modal onClose={() => setIsOpen(false)}>
          <InputForm setIsOpen={() => setIsOpen(false)} />
        </Modal>
      )}
      <div className="card-container">
        {allRecipe.map((item, index) => (
          <div key={index} className="card">
            <img
              src={`http://localhost:5000/images/${item.coverImage}`}
              alt="Recipe"
              width="190px"
              height="120px"
            />
            <div className="card-body">
              <div className="title">{item.title}</div>
              <div className="icons">
                <div className="timer">
                  <BsStopwatchFill />
                  {item.time}
                </div>
                {!path ? (
                  <FaHeart
                    onClick={() => favRecipe(item)}
                    style={{
                      color: favItems.some((res) => res._id === item._id)
                        ? "red"
                        : "",
                    }}
                  />
                ) : (
                  <div className="action">
                    <Link to={`/editRecipe/${item._id}`} className="editIcon">
                      <FaEdit />
                    </Link>
                    <MdDelete
                      onClick={() => onDelete(item._id)}
                      className="deleteIcon"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Home;
