import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(import.meta.env.VITE_DB as string)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

// ----- MONGOOSE SCHEMA -----
const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  phone: String,
  password: String,
  photo: String,
  user_type: String,
  login_time: String,
});

const UserModel = mongoose.model("user", UserSchema);

// ----- LOGIN -----
app.post("/api/login", async (req, res) => {
  const { identifier, password, user_type } = req.body;
  const user = await UserModel.findOne({
    user_type,
    $or: [{ email: identifier }, { phone: identifier }],
  });

  if (!user || user.password !== password) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user._id },
    import.meta.env.VITE_JWT_SECRET as string,
    {
      expiresIn: "2h",
    },
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

// ----- FORGOT PASSWORD -----
app.post("/api/forgot-password", async (req, res) => {
  const { email } = req.body;
  const user = await UserModel.findOne({ email });

  if (!user) return res.status(404).json({ message: "Email not found" });

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  // Normally you'd email this code; here we return it directly for demo/testing
  res.json({ message: "Verification code sent", code });
});

// ----- RESET PASSWORD -----
app.post("/api/reset-password", async (req, res) => {
  const { email, newPassword } = req.body;

  const user = await UserModel.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  user.password = newPassword;
  await user.save();

  res.json({ message: "Password updated successfully" });
});

// ----- START SERVER -----
app.listen(8000, () => {
  console.log("Server running on http://localhost:8000");
});
