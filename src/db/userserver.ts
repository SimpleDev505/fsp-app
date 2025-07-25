import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import cors from "cors";
import process from "node:process";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import axios, { AxiosError } from "axios";
dotenv.config();

const app = express();
app.use(express.json({ limit: "5mb" }));
app.use(cors());

mongoose
  .connect(process.env.VITE_DB as string)
  .then((e) => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

// ----- MONGOOSE SCHEMA -----
const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  phone: String,
  password: String,
  photo: String,
  pancardno: String,
  passportno: String,
  user_type: String,
  login_time: String,
  banned: Boolean,
  ban_time: Date,
  ticket_booked: Number,
  recent_place: String,
  amount_saved: Number,
});
const AnnouncementSchema = new mongoose.Schema({
  message_author: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, required: true },
  timestamp: { type: Date, required: true },
});
const FlightSchema = new mongoose.Schema({
  flightId: String,
  airlineCode: String,
  flightNumber: String,
  aircraftCode: String,
  from: {
    iataCode: String,
    terminal: String,
    dateTime: String,
  },
  to: {
    iataCode: String,
    terminal: String,
    dateTime: String,
  },
  duration: String,
  isNonStop: Boolean,
  stops: Number,
  price: {
    base: String,
    total: String,
    currency: String,
  },
});
// Ticket
// const FlightOfferSchema = new mongoose.Schema({
//   id: String,
//   source: String,
//   oneWay: Boolean,
//   instantTicketingRequired: Boolean,
//   nonHomogeneous: Boolean,
//   isUpsellOffer: Boolean,
//   lastTicketingDate: String,
//   lastTicketingDateTime: String,
//   numberOfBookableSeats: Number,
//   price: {
//     currency: String,
//     total: String,
//     base: String,
//     grandTotal: String,
//     fees: [
//       {
//         amount: String,
//         type: String,
//       },
//     ],
//   },
//   pricingOptions: {
//     fareType: [String],
//     includedCheckedBagsOnly: Boolean,
//   },
//   validatingAirlineCodes: [String],
//   itineraries: [
//     {
//       duration: String,
//       segments: [
//         {
//           id: String,
//           duration: String,
//           numberOfStops: Number,
//           carrierCode: String,
//           number: String,
//           blacklistedInEU: Boolean,
//           aircraft: { code: String },
//           operating: { carrierCode: String },
//           departure: {
//             iataCode: String,
//             at: String,
//             terminal: String,
//           },
//           arrival: {
//             iataCode: String,
//             at: String,
//             terminal: String,
//           },
//         },
//       ],
//     },
//   ],
//   travelerPricings: [
//     {
//       travelerId: String,
//       fareOption: String,
//       travelerType: String,
//       price: {
//         currency: String,
//         total: String,
//         base: String,
//       },
//       fareDetailsBySegment: [
//         {
//           segmentId: String,
//           cabin: String,
//           brandedFare: String,
//           brandedFareLabel: String,
//           fareBasis: String,
//           class: String,
//           includedCheckedBags: {
//             weight: Number,
//             weightUnit: String,
//           },
//           includedCabinBags: {
//             weight: Number,
//             weightUnit: String,
//           },
//           amenities: [
//             {
//               description: String,
//               isChargeable: Boolean,
//               amenityType: String,
//               amenityProvider: {
//                 name: String,
//               },
//             },
//           ],
//         },
//       ],
//     },
//   ],
// });
const FlightOfferSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    source: { type: String, required: true },
    oneWay: { type: Boolean, required: true },
    instantTicketingRequired: { type: Boolean, required: true },
    nonHomogeneous: { type: Boolean, required: true },
    isUpsellOffer: { type: Boolean, required: true },
    lastTicketingDate: { type: String, required: true },
    lastTicketingDateTime: { type: String, required: true },
    numberOfBookableSeats: { type: Number, required: true },

    price: {
      currency: String,
      total: String,
      base: String,
      grandTotal: String,
      fees: [
        new mongoose.Schema(
          {
            amount: String,
            type: String,
          },
          { _id: false }
        ),
      ],
    },

    pricingOptions: {
      fareType: [String],
      includedCheckedBagsOnly: Boolean,
    },

    validatingAirlineCodes: [String],

    itineraries: [
      {
        duration: String,
        segments: [
          {
            id: String,
            duration: String,
            numberOfStops: Number,
            carrierCode: String,
            number: String,
            blacklistedInEU: Boolean,
            aircraft: {
              code: String,
            },
            operating: {
              carrierCode: String,
            },
            departure: {
              iataCode: String,
              at: String,
              terminal: String,
            },
            arrival: {
              iataCode: String,
              at: String,
              terminal: String,
            },
          },
        ],
      },
    ],

    travelerPricings: [
      {
        travelerId: String,
        fareOption: String,
        travelerType: String,
        price: {
          currency: String,
          total: String,
          base: String,
        },
        fareDetailsBySegment: [
          {
            segmentId: String,
            cabin: String,
            brandedFare: String,
            brandedFareLabel: String,
            fareBasis: String,
            class: String,
            includedCheckedBags: {
              weight: Number,
              weightUnit: String,
            },
            includedCabinBags: {
              weight: Number,
              weightUnit: String,
            },
            amenities: [
              {
                description: String,
                isChargeable: Boolean,
                amenityType: String,
                amenityProvider: {
                  name: String,
                },
              },
            ],
          },
        ],
      },
    ],
  },
  { _id: false }
);
const TicketSchema = new mongoose.Schema({
  ticketNumber: {
    type: String,
    required: true,
    unique: true,
  },
  user: {
    id: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
  },
  flight: FlightSchema,
  flightOffer: {
    type: FlightOfferSchema,
    required: true,
  },
  passengers: [
    {
      fullName: String,
      age: Number,
      gender: String,
      passportNumber: String,
      travelerType: String,
      seatNumber: String,
    },
  ],
  bookingDate: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});
//Scheduling
const ScheduledFlightSchema = new mongoose.Schema(
  {
    scheduledType: {
      type: String,
      enum: ["DELAY", "RESCHEDULED", "CANCELED"],
      required: true,
    },
    scheduledBy: String,
    rescheduledTime: String,
    delayTime: String,
    flight: { type: FlightOfferSchema, required: true },
  },
  { timestamps: true }
);
const ScheduledFlight = mongoose.model(
  "ScheduledFlight",
  ScheduledFlightSchema,
  "schflights"
);
const UserModel = mongoose.model("User", UserSchema, "user");
const AnnouncementModel = mongoose.model(
  "Announcement",
  AnnouncementSchema,
  "announcements"
);
const Ticket = mongoose.model("Ticket", TicketSchema, "tickets");
async function generateTicketNumber(): Promise<string> {
  let ticketNumber = `HRTCKT-${Math.floor(100000 + Math.random() * 900000)}`; // Generates HRTCKT-XXXXXX
  const existingTicket = await Ticket.findOne({ ticketNumber });

  // If the ticket number exists, regenerate it
  if (existingTicket) {
    return generateTicketNumber(); // If Exists call to get a unique ticket number
  }

  return ticketNumber;
}

// ----- USER ------
app.post("/api/users/updatedata", async (req, res) => {
  const { userId, fieldName, newValue } = req.body;

  if (!userId || !fieldName) {
    return res.status(400).json({ error: "Missing userId or fieldName" });
  }

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { [fieldName]: newValue },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
});
app.get("/api/user/field", async (req, res) => {
  const { userId, fieldName } = req.query;

  if (!userId || !fieldName) {
    return res.status(400).json({ error: "Missing userId or fieldName" });
  }

  try {
    const user = await UserModel.findById(userId).select(fieldName.toString());

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const value = user.get(fieldName.toString());
    res.json({ field: fieldName, value });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});
app.get("/get-by-username/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const user = await UserModel.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    const userObj = {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      phone: user.phone,
      photo: user.photo,
      user_type: user.user_type,
      login_time: user.login_time,
      passportno: user.passportno,
      pancardno: user.pancardno,
      banned: user.banned,
      ban_time: user.ban_time,
      ticket_booked: user.ticket_booked,
      recent_place: user.recent_place,
      amount_saved: user.amount_saved,
    };
    return res.json(userObj);
  } catch (err) {
    console.error("Error fetching user by name:", err);
    res.status(500).json({ message: "Internal Server Error." });
  }
});

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
      pancardno: user.pancardno,
      passportno: user.passportno,
      user_type: user.user_type,
      login_time: new Date().toISOString(),
      ticket_booked: user.ticket_booked,
      recent_place: user.recent_place,
      amount_saved: user.amount_saved,
    },
  });
});

// ----- FORGOT PASSWORD -----
async function sendResetCodeEmail(to: string, code: string) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // const info = await transporter.sendMail({
  //   from: `"Flight System" <${process.env.EMAIL_USER}>`,
  //   to,
  //   subject: "Your Password Reset Code",
  //   html: `<p>Your verification code is: <strong>${code}</strong></p>`,
  // });
  const info = await transporter.sendMail({
    from: `"Flight System" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your Password Reset Code",
    html: `
      <div style="font-family: sans-serif; background: #f2f2f2; padding: 40px;">
        <div style="background-color: #222; color: white; padding: 20px 0; text-align: center; font-size: 24px; font-weight: bold;">
          HR AIRLINE COMPANY
        </div>
        <div style="max-width: 500px; margin: 40px auto; background-color: #04b0d3; padding: 30px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
  
          <!-- White card inside -->
          <div style="background: white; border-radius: 6px; padding: 30px; text-align: center;">
            <h2 style="margin-top: 0; color: #333;">Your Verification Code</h2>
            <p style="font-size: 24px; letter-spacing: 2px; font-weight: bold; color: #04b0d3;">${code}</p>
            <p style="font-size: 14px; color: #666;">Use this code to reset your password. It will expire in 15 minutes.</p>
          </div>
  
        </div>
  
        <div style="text-align: center; font-size: 12px; color: #999; margin-top: 40px;">
          © ${new Date().getFullYear()} HR Airline Company. All rights reserved.
        </div>
      </div>
    `,
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

  console.log(`Reset code for ${email}: ${code}`);
  try {
    await sendResetCodeEmail(email, code);
  } catch (err) {
    console.error("Failed to send email:", err);
    return res.status(500).json({ message: "Failed to send reset email" });
  }
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
// ----- REGISTER -----
app.post("/api/register", async (req, res) => {
  const { username, email, phone, password, photo, user_type } = req.body;

  // Check if user exists
  const existing = await UserModel.findOne({ $or: [{ email }, { phone }] });
  if (existing) return res.status(400).json({ message: "User already exists" });

  const newUser = new UserModel({
    username,
    email,
    phone,
    password,
    photo,
    user_type,
    login_time: new Date().toISOString(),
  });

  await newUser.save();
  res.json({ message: "Registration successful" });
});

// ANNOUNCE MESSAGE
app.post("/api/announce", async (req, res) => {
  try {
    const { message_author, message, type, timestamp } = req.body;
    console.log("Result from /api/announce :", req.body);
    const count = await AnnouncementModel.countDocuments();
    if (count >= 10) {
      const oldest = await AnnouncementModel.findOne().sort({ timestamp: 1 });
      if (oldest) await AnnouncementModel.deleteOne({ _id: oldest._id });
    }

    await AnnouncementModel.create({
      message_author,
      message,
      type,
      timestamp: new Date(timestamp),
    });

    res.status(200).json({ status: "ok" });
  } catch (err) {
    console.error("Error posting announcement:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.get("/get-by-author/:author", async (req, res) => {
  try {
    const { author } = req.params;
    const announcements = await AnnouncementModel.find({
      message_author: author,
    });

    if (!announcements || announcements.length === 0) {
      return res
        .status(404)
        .json({ message: "No announcements found for this author." });
    }

    res.json(announcements);
  } catch (err) {
    console.error("Error fetching announcements:", err);
    res.status(500).json({ message: "Internal server error." });
  }
});

app.get("/api/announce/latest", async (req, res) => {
  try {
    const latest = await AnnouncementModel.find()
      .sort({ timestamp: -1 })
      .limit(10);
    res.json(latest);
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
//Ticket
app.post("/api/book-ticket", async (req, res) => {
  try {
    const {
      userId,
      username,
      email,
      phone,
      flightDetails,
      sflightoffer,
      passengers,
      bookingDate,
    } = req.body;
    // Generate unique ticket number
    const ticketNumber = await generateTicketNumber();
    const _flightOffer =
      typeof req.body.sflightoffer === "string"
        ? JSON.parse(req.body.sflightoffer)
        : req.body.sflightoffer;

    console.log("Received flightoffer:", JSON.stringify(_flightOffer, null, 2));
    const ticketData = {
      ticketNumber,
      user: { id: userId, username, email, phone },
      flight: flightDetails,
      flightOffer: _flightOffer,
      passengers, // an array of Passengers List
      bookingDate,
    };
    console.log("✅ Ticket Data:", JSON.stringify(ticketData, null, 2));
    const newTicket = new Ticket(ticketData);
    await newTicket.save();

    res
      .status(201)
      .json({ message: "Ticket booked successfully!", ticket: newTicket });
  } catch (error) {
    console.error("Error booking ticket:", error);
    res.status(500).json({ message: "Failed to book ticket" });
  }
});
app.post("/assign-seats", async (req, res) => {
  try {
    const { ticketNumber, assignments } = req.body;

    const ticket = await Ticket.findOne({ ticketNumber });
    if (!ticket) return res.status(404).json({ error: "Ticket not found" });

    for (const assign of assignments) {
      const traveler = ticket.passengers.find(
        (p) => p.fullName === assign.fullName
      );
      if (traveler) traveler.seatNumber = assign.seatNumber;
    }

    await ticket.save();
    res.json({ message: "Seats assigned successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/tickets/search", async (req, res) => {
  const { ticketNumber, bookingDate } = req.body;

  try {
    //Fetch current ticket
    let currentTicket = null;

    if (ticketNumber) {
      currentTicket = await Ticket.findOne({ ticketNumber });
    } else if (bookingDate) {
      currentTicket = await Ticket.findOne({ bookingDate });
    }

    if (!currentTicket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    //Extract flight identity
    const { airlineCode, flightNumber, from } = currentTicket.flight ?? {};
    if (!airlineCode || !flightNumber || !from?.dateTime) {
      return res
        .status(400)
        .json({ message: "Flight information incomplete." });
    }
    const flightDate = from.dateTime;

    //Fetch other tickets on same flight
    const otherTickets = await Ticket.find({
      "flight.airlineCode": airlineCode,
      "flight.flightNumber": flightNumber,
      "flight.from.dateTime": flightDate,
      ticketNumber: { $ne: currentTicket.ticketNumber },
    });

    //Other passengers from same airlineno
    const otherPassengersOnSameFlight = otherTickets.flatMap((ticket) =>
      ticket.passengers.map((p) => ({
        ticketNumber: ticket.ticketNumber,
        fullName: p.fullName,
        age: p.age,
        gender: p.gender,
        travelerType: p.travelerType,
        seatNumber: p.seatNumber ?? null,
      }))
    );

    return res.status(200).json({
      currentTicket,
      otherPassengersOnSameFlight,
    });
  } catch (err) {
    console.error("Error searching ticket:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

//SeatMap
app.post("/seatmap", async (req, res) => {
  try {
    const { flightOffer } = req.body;
    console.log(process.env.VITE_CLIENTID);
    const tokenRes = await axios.post(
      "https://test.api.amadeus.com/v1/security/oauth2/token",
      new URLSearchParams({
        grant_type: "client_credentials",
        client_id: process.env.VITE_CLIENTID || "",
        client_secret: process.env.VITE_CLIENTSEC || "",
      }),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    const token = tokenRes.data.access_token;
    const seatMapRes = await axios.post(
      "https://test.api.amadeus.com/v1/shopping/seatmaps",
      { data: [flightOffer] },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json(seatMapRes.data);
  } catch (err) {
    const error = err as AxiosError;
    console.error(
      "Amadeus seat map error:",
      error?.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to fetch seat map" });
  }
});
//Past Flights..
app.get("/api/tickets/past", async (req, res) => {
  const userId = req.query.userId as string;

  const tickets = await Ticket.find({ "user.id": userId });

  const simplified = tickets.map((ticket) => ({
    ticketNumber: ticket.ticketNumber,
    bookingDate: ticket.bookingDate,
    from: ticket?.flight?.from,
    to: ticket.flight?.to,
    flightNumber: ticket.flight?.flightNumber,
    airlineCode: ticket.flight?.airlineCode,
    duration: ticket.flight?.duration,
    aircraftCode: ticket.flight?.aircraftCode,
    price: {
      total: ticket.flight?.price?.total,
      currency: ticket.flight?.price?.currency,
    },
    passengers: ticket.passengers.map((p) => ({
      fullName: p.fullName,
      seatNumber: p.seatNumber,
      travelerType: p.travelerType,
    })),
  }));

  res.json(simplified);
});
//Schedule
app.post("/api/schedule", async (req, res) => {
  try {
    const { scheduledBy, scheduledType, rescheduledTime, delayTime, flight } =
      req.body;

    const count = await ScheduledFlight.countDocuments();
    if (count >= 5) {
      const oldest = await ScheduledFlight.find()
        .sort({ createdAt: 1 })
        .limit(count - 4);
      const idsToDelete = oldest.map((entry) => entry._id);
      await ScheduledFlight.deleteMany({ _id: { $in: idsToDelete } });
    }

    const newEntry = new ScheduledFlight({
      scheduledType,
      rescheduledTime,
      delayTime,
      flight,
      scheduledBy,
    });

    await newEntry.save();
    res.status(201).json({ message: "Scheduled flight saved" });
  } catch (err) {
    res.status(500).json({ error: "Failed to save scheduled flight." });
  }
});
app.get("/api/schedule/latest", async (req, res) => {
  try {
    const entries = await ScheduledFlight.find()
      .sort({ createdAt: -1 })
      .limit(5);
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch scheduled flights." });
  }
});
app.get("/api/scheduled-flights/by-user", async (req, res) => {
  const { username } = req.query;

  if (!username || typeof username !== "string") {
    return res.status(400).json({ error: "Username is required" });
  }

  try {
    const flights = await ScheduledFlight.find({ scheduledBy: username });
    if (flights.length === 0) {
      return res.status(200).json(null);
    }
    return res.status(200).json(flights);
  } catch (err) {
    console.error("Error fetching scheduled flights:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});
// ----- START SERVER -----
app.listen(8080, () => {
  console.log("Server running on http://localhost:8080");
});
