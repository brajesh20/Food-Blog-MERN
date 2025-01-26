const Users = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

//SIGNUP

const userSignUp = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password)
    return res
      .status(400)
      .json({ message: 'All fields should be filled', success: false })

  const emailExist = await Users.findOne({ email })

  if (emailExist)
    return res
      .status(400)
      .json({ error: 'Email already exists', success: false })

  const hashPass = await bcrypt.hash(password, 10)

  const newUser = new Users({ email, password: hashPass })

  try {
    await newUser.save()

    let token = jwt.sign({ email, id: newUser._id }, process.env.SECRET_KEY, {
      expiresIn: '1 hr'
    })

    return res.status(201).json({ token, user: newUser })
  } catch (error) {
    console.error('Error creating user:', error)
    return res.status(500).json({ error: 'Server error', success: false })
  }
}

//LOGIN

const userLogin = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password)
    return res
      .status(400)
      .json({ message: 'All fields should be filled', success: false })

  const user = await Users.findOne({ email })

  if (user && (await bcrypt.compare(password, user.password))) {
    let token = jwt.sign({ email, id: user._id }, process.env.SECRET_KEY, {
      expiresIn: '1 hr'
    })

    return res.status(201).json({ token, user })
  } else {
    return res.status(400).json({ error: 'Invalid credentials' })
  }
}

//GETUSER

const getUser = async (req, res) => {
  const user = await Users.findById((_id = req.params.id))

  if (!user)
    return res
      .status(400)
      .json({ error: "User with such mail doesn't exist", success: false })

  return res.json({ email: user.email, message: 'User fetched successfully' })
}

module.exports = { userSignUp, userLogin, getUser }
