const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { successResponse, errorResponse } = require('../utils/responses');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });
};

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(res, 'User already exists with this email', 409);
    }
    
    const user = await User.create({ name, email, password });
    
    successResponse(res, {
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    }, 'User registered successfully', 201);
  } catch (error) {
    errorResponse(res, error.message, 500);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return errorResponse(res, 'Invalid credentials', 401);
    }
    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return errorResponse(res, 'Invalid credentials', 401);
    }
    
    successResponse(res, {
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    }, 'Login successful');
  } catch (error) {
    errorResponse(res, error.message, 500);
  }
};

const getProfile = async (req, res) => {
  try {
    successResponse(res, {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email
    });
  } catch (error) {
    errorResponse(res, error.message, 500);
  }
};

module.exports = { signup, login, getProfile };