import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import jwt from "jsonwebtoken";

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(import.meta.env.VITE_DB!)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("DB connection error", err));

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

// 🔐 Login Route
app.post("/api/login", async (res, req) => {
  const { identifier, password, user_type } = req.body;

  try {
    const query = user_type === "CUSTOMER"
      ? { $or: [{ email: identifier }, { phone: identifier }] }
      : { _id: identifier }; // STAFF / ADMIN by ID

    const user = await UserModel.findOne({ ...query, user_type });

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.password !== password) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const token = jwt.sign(
      { id: user._id, user_type: user.user_type },
      import.meta.env.VITE_JWT_KEY!,
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
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
});

// 🔑 Forgot Password
app.post("/api/forgot-password", async (res, req) => {
  const { identifier, password, user_type } = req.body;

  const user = await UserModel.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  // NOTE: In production, send email. Here, return it.
  res.json({ message: "Reset code sent to email", code });
});

// 🔄 Reset Password
app.post("/api/reset-password", async (res, res) => {
  const { email, newPassword } = req.body;

  const user = await UserModel.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  await UserModel.updateOne({ email }, { $set: { password: newPassword } });

  res.json({ message: "Password updated successfully" });
});

// ✅ Start
const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
