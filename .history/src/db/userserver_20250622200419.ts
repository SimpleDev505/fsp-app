import express, { Request, Response } from "express";
import mongoose, { model, Schema } from "mongoose";
import jwt from "jsonwebtoken";
import cors from "cors";

// Vite-style env vars
const MONGO_URL = import.meta.env.VITE_DB;
const JWT_SECRET = import.meta.env.VITE_JWT_SECRET;

// Connect to MongoDB
mongoose.connect(MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("DB connection error:", err));

// Define User Schema
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

// Express App Init
const app = express();
app.use(cors());
app.use(express.json());

// Temporary in-memory code storage
const resetCodes = new Map<string, string>();

// Register
app.post("/register", async (res, req) => {
  const request = req as unknown as Request;
  const response = res as unknown as Response;
  const { username, email, phone, password, user_type, photo } = request.body;

  const exists = await UserModel.findOne({ $or: [{ email }, { phone }] });
  if (exists) {
    return response.status(409).json({ message: "User already exists" });
  }

  const user = new UserModel({
    username,
    email,
    phone,
    password,
    user_type,
    photo,
    login_time: new Date().toISOString(),
  });

  await user.save();
  res.json({ message: "Registration successful" });
});

// Login
app.post("/login", async (res: Response, req: Request) => {
  const { identifier, password, user_type } = req.body;

  const user = await UserModel.findOne({
    $or: [{ email: identifier }, { phone: identifier }],
    user_type,
  });

  if (!user || user.password !== password) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user._id, user_type: user.user_type },
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

// Forgot Password
app.post("/forgot-password", async (res: Response, req: Request) => {
  const { email } = req.body;
  const user = await UserModel.findOne({ email });

  if (!user) return res.status(404).json({ message: "Email not found" });

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  resetCodes.set(email, code);

  res.json({ message: "Reset code sent", code }); // send code here just for dev
});

// Reset Password
app.post("/reset-password", async (res: Response, req: Request) => {
  const { email, code, new_password } = req.body;
  const storedCode = resetCodes.get(email);

  if (storedCode !== code) {
    return res.status(400).json({ message: "Invalid or expired code" });
  }

  await UserModel.updateOne({ email }, { password: new_password });
  resetCodes.delete(email);

  res.json({ message: "Password updated" });
});

// Start Server
app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
