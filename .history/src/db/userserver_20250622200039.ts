// authBackend.ts

import express, { Request, Response } from "express";
import mongoose, { model, Schema } from "mongoose";
import jwt from "jsonwebtoken";
import cors from "cors";

// ENV VARS (Vite-style)
const MONGO_URL = import.meta.env.VITE_DB;
const JWT_SECRET = import.meta.env.VITE_JWT_SECRET;

// MongoDB Setup
mongoose.connect(MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("DB Error", err));

// User Schema
const UserSchema = new Schema({
  username: String,
  email: String,
  phone: String,
  password: String,
  photo: String,
  user_type: String,
  login_time: String,
});
const UserModel = model("user", UserSchema);

// Express App
const app = express();
app.use(cors());
app.use(express.json());

// Fake In-memory OTP store
const resetCodes = new Map<string, string>();

// REGISTER
app.post("/register", async (req: Request, res: Response) => {
  const { username, email, phone, password, user_type, photo } = req.body;

  const existing = await UserModel.findOne({ $or: [{ email }, { phone }] });
  if (existing) return res.status(409).json({ message: "User already exists" });

  const newUser = new UserModel({
    username,
    email,
    phone,
    password,
    user_type,
    photo,
    login_time: new Date().toISOString(),
  });

  await newUser.save();
  res.json({ message: "Registered successfully" });
});

// LOGIN
app.post("/login", async (req: Request, res: Response) => {
  const { identifier, password, user_type } = req.body;

  const user = await UserModel.findOne({
    $or: [{ email: identifier }, { phone: identifier }],
    user_type,
  });

  if (!user || user.password !== password) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user._id, user_type: user.user_type, email: user.email },
    JWT_SECRET,
    { expiresIn: "2h" },
  );

  res.json({
    message: "Login successful",
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      photo: user.photo,
      user_type: user.user_type,
      login_time: new Date().toISOString(),
    },
  });
});

// FORGOT PASSWORD
app.post("/forgot-password", async (req: Request, res: Response) => {
  const { email } = req.body;
  const user = await UserModel.findOne({ email });
  if (!user) return res.status(404).json({ message: "Email not registered" });

  const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
  resetCodes.set(email, code);

  // Normally, you'd email it — here we return directly for testing
  res.json({ message: "Reset code sent", code });
});

// RESET PASSWORD
app.post("/reset-password", async (req: Request, res: Response) => {
  const { email, code, new_password } = req.body;
  const storedCode = resetCodes.get(email);

  if (!storedCode || storedCode !== code) {
    return res.status(400).json({ message: "Invalid or expired code" });
  }

  await UserModel.updateOne({ email }, { password: new_password });
  resetCodes.delete(email);

  res.json({ message: "Password updated successfully" });
});

// Server start
app.listen(3000, () => {
  console.log("Auth backend running at http://localhost:3000");
});
