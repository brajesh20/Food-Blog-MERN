const express = require('express')
const router = express.Router()

const {
  getRecipe,
  getAllRecipes,
  addRecipe,
  editRecipe,
  deleteRecipe,
  upload
} = require('../controller/recipeController')
const verifyToken = require('../middleware/auth')

router.get('/', getAllRecipes)
router.get('/:id', getRecipe)
router.post('/', upload.single('file'), verifyToken, addRecipe)
router.put('/:id', upload.single('file'), editRecipe)
router.delete('/:id', deleteRecipe)

module.exports = router
