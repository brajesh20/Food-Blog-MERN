import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AddFoodRecipe() {
  const [recipeData, setRecipeData] = useState({});
  const navigate = useNavigate();

  const onHandleChange = (e) => {
    let val =
      e.target.name === "ingredients"
        ? e.target.value.split(",")
        : e.target.name === "file"
        ? e.target.files[0]
        : e.target.value;
    setRecipeData((prev) => ({ ...prev, [e.target.name]: val }));
  };

  const onHandleSubmit = async (e) => {
    e.preventDefault();
    console.log(recipeData);

    await axios
      .post("http://localhost:5000/recipe", recipeData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "authorization": "bearer " + localStorage.getItem("token"),
        },
      })
      .then(() => navigate("/"))
      .catch((err) => console.error(err));
  };

  return (
    <div className="container">
      <form className="form" onSubmit={onHandleSubmit}>
        <div className="form-control">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            className="input"
            name="title"
            onChange={onHandleChange}
          />
        </div>

        <div className="form-control">
          <label htmlFor="time">Time</label>
          <input
            type="text"
            className="input"
            name="time"
            onChange={onHandleChange}
          />
        </div>

        <div className="form-control">
          <label htmlFor="ingredients">Ingredients</label>
          <textarea
            className="input-textarea"
            name="ingredients"
            rows="5"
            onChange={onHandleChange}
          ></textarea>
        </div>

        <div className="form-control">
          <label htmlFor="instructions">Instructions</label>
          <textarea
            className="input-textarea"
            name="instructions"
            rows="5"
            onChange={onHandleChange}
          ></textarea>
        </div>

        <div className="form-control">
          <label htmlFor="file">Recipe Image</label>
          <input
            type="file"
            className="input"
            name="file"
            onChange={onHandleChange}
          />
        </div>

        <button type="submit">Add Recipe</button>
      </form>
    </div>
  );
}
