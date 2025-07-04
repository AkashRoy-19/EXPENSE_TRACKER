// controllers/userController.js

import User from '../models/user.js';  // note the .js extension

import jwt from 'jsonwebtoken';

// Helper function to generate JWT token
const generateToken = (id) => {
  console.log("🔐 JWT_SECRET:", process.env.JWT_SECRET);  // ← Add this for debugging
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  console.log("📥 Incoming registration data:", { username, email });

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log("⚠️ User already exists:", email);
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ username, email, password });
    await user.save(); // ensure it's written to DB

    console.log("✅ New user created:", user.email);

    const token = generateToken(user._id);

    if (!token) {
      console.error("❌ Failed to generate token");
      return res.status(500).json({ message: "Token generation failed" });
    }

    return res.status(201).json({ token, user });
  } catch (err) {
    console.error("❌ Error during registration:", err.message);
    return res.status(500).json({ message: err.message || "Registration error" });
  }
};


export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    res.status(200).json({ token: generateToken(user._id), user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createUser = async (req, res) => {
  const user = new User(req.body);
  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
