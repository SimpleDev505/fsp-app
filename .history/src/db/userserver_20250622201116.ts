import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import jwt from "jsonwebtoken";

// 👇 Use these from your Vite config or `.env` file
const MONGO_URI = import.meta.env.VITE_DB;
const JWT_SECRET = import.meta.env.VITE_JWT_SECRET;

const app = express();
app.use(cors());
app.use(express.json());

// 🧠 Connect to MongoDB
mongoose.connect(MONGO_URI);

// 👤 MongoDB Schema
const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  phone: String,
  password: String,
  photo: String,
  user_type: String, // "CUSTOMER" | "STAFF" | "ADMIN"
  login_time: String,
});
const User = mongoose.model("user", UserSchema);

// ✅ Login Route
app.post(
  "/login",
  async (
    req: Request<{}, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>, number>,
  ) => {
    const { identifier, password, user_type } = req.body;

    const query: any = {
      user_type,
      $or: [
        { email: identifier },
        { phone: identifier },
        { username: identifier },
        { _id: identifier },
      ],
    };

    const user = await User.findOne(query);
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id, type: user.user_type }, JWT_SECRET);
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
  },
);

// ✅ Forgot Password: Step 1 — Get Code (simulate)
app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email, user_type: "CUSTOMER" });

  if (!user) return res.status(404).json({ message: "User not found" });

  const code = Math.floor(100000 + Math.random() * 900000).toString(); // Simulate OTP
  // You should email this in production
  console.log(`🔐 Reset code for ${email}: ${code}`);

  return res.json({ message: "Code sent to email", code }); // NOTE: Remove code in production!
});

// ✅ Reset Password: Step 2 — Update
app.post("/reset-password", async (req, res) => {
  const { email, newPassword } = req.body;

  const user = await User.findOne({ email, user_type: "CUSTOMER" });
  if (!user) return res.status(404).json({ message: "User not found" });

  user.password = newPassword;
  await user.save();

  res.json({ message: "Password updated successfully" });
});

// 🟢 Start Server
app.listen(8000, () => {
  console.log("✅ Server running at http://localhost:8000");
});
