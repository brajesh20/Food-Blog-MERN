const Recipe = require('../models/recipeModel')
const multer = require('multer')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images')
  },
  filename: function (req, file, cb) {
    const filename = Date.now() + '-' + file.fieldname
    cb(null, filename)
  }
})

const upload = multer({ storage: storage })

const getRecipe = async (req, res) => {
  const { id } = req.params

  try {
    const recipe = await Recipe.findById(id)

    if (!recipe) {
      return res
        .status(404)
        .json({ message: "Recipe with such ID doesn't exist" })
    }

    return res.json(recipe)
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Error fetching recipe', error: err })
  }
}

const getAllRecipes = async (req, res) => {
  try {
    const allRecipes = await Recipe.find()
    return res.json(allRecipes)
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Error fetching recipes', error: err })
  }
}

const addRecipe = async (req, res) => {
  console.log(req.user)

  const { title, ingredients, instructions, time } = req.body

  if (!title || !ingredients || !instructions) {
    return res.status(400).json({ message: "Fields can't be empty" })
  }

  try {
    const newRecipe = new Recipe({
      title,
      ingredients,
      instructions,
      time,
      coverImage: req.file.filename,
      createdBy: req.user.id
    })

    await newRecipe.save()
    return res.status(201).json(newRecipe)
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Error creating recipe', error: err })
  }
}

const editRecipe = async (req, res) => {
  const { title, ingredients, instructions, time } = req.body

  if (!title || !ingredients || !instructions || !time) {
    return res.status(400).json({ message: "Fields can't be empty" })
  }

  try {
    let coverImage = req.file?.filename ? req.file?.filename : Recipe.coverImage
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      { ...req.body, coverImage },
      { new: true }
    )

    if (!updatedRecipe) {
      return res
        .status(404)
        .json({ message: "Recipe with such ID doesn't exist" })
    }

    return res.json(updatedRecipe)
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Error updating recipe', error: err })
  }
}

const deleteRecipe = async (req, res) => {
  const { id } = req.params

  try {
    const deletedRecipe = await Recipe.findByIdAndDelete(id)

    if (!deletedRecipe) {
      return res
        .status(404)
        .json({ message: "Recipe with such ID doesn't exist" })
    }

    return res.json({ message: 'Recipe deleted successfully' })
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Error deleting recipe', error: err })
  }
}

module.exports = {
  getRecipe,
  getAllRecipes,
  addRecipe,
  editRecipe,
  deleteRecipe,
  upload
}
