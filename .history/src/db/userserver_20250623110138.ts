import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import cors from "cors";
import process from "node:process";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.VITE_DB as string)
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

const UserModel = mongoose.model("User", UserSchema, "user");

// ----- LOGIN -----
app.post("/api/login", async (req, res) => {
  const { identifier, password, user_type } = req.body;
  console.log(req.body);
  const user = await UserModel.findOne({
    user_type,
    $or: [{ email: identifier }, { phone: identifier }],
  });

  if (!user || user.password !== password) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_KEY as string, {
    expiresIn: "2h",
  });

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
async function sendResetCodeEmail(to: string, code: string) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // App password if Gmail
    },
  });

  const info = await transporter.sendMail({
    from: `"Flight System" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your Password Reset Code",
    html: `<p>Your verification code is: <strong>${code}</strong></p>`,
  });

  console.log("Message sent: %s", info.messageId);
}
app.post("/api/forgot-password", async (req, res) => {
  const { email } = req.body;
  const user = await UserModel.findOne({ email });

  if (!user) return res.status(404).json({ message: "Email not found" });

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 15 * 60 * 1000;

  resetCodeMap.set(email, { code, expiresAt });

  // Log for dev mode
  console.log(`Reset code for ${email}: ${code}`);
  try {
    await sendResetCodeEmail(email, code); // << YOU PLACE IT HERE
  } catch (err) {
    console.error("Failed to send email:", err);
    return res.status(500).json({ message: "Failed to send reset email" });
  }
  // Use NODE_ENV to conditionally return code
  const isDev = process.env.NODE_ENV !== "production";

  res.json({
    message: "Verification code sent",
    ...(isDev && { code }),
  });
});

// ----- RESET PASSWORD -----
const resetCodeMap = new Map<string, { code: string; expiresAt: number }>();
app.post("/api/verify-code", (req, res) => {
  const { email, code } = req.body;
  const stored = resetCodeMap.get(email);

  if (!stored || stored.code !== code || stored.expiresAt < Date.now()) {
    return res.status(400).json({ message: "Invalid or expired code" });
  }

  // Optionally clear the code after verification
  resetCodeMap.delete(email);

  res.json({ message: "Code verified successfully" });
});
app.post("/api/reset-password", async (req, res) => {
  const { email, newPassword } = req.body;

  const user = await UserModel.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  user.password = newPassword;
  await user.save();

  res.json({ message: "Password updated successfully" });
});

// ----- START SERVER -----
app.listen(8080, () => {
  console.log("Server running on http://localhost:8000");
});
