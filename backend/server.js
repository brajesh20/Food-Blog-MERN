const express = require('express')
const app = express()
const recipe = require('./routes/recipeRoute')
const users = require('./routes/userRoute')
const dbConnect = require('./config/database')
const cors = require('cors')
require('dotenv').config()

const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(cors())
app.use(express.static('public'))
app.use('/recipe', recipe)
app.use('/users', users)

app.listen(PORT, (req, res) => {
  dbConnect()
  console.log(`server is running on port ${PORT}`)
})
