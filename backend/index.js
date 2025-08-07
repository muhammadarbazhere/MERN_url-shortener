const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const urlRoutes = require("./routes/urlRoutes");

const app = express();
const port = process.env.PORT || 3000 ;

// const corsOptions = {
//    origin: [
//     process.env.FRONTEND_BASE_URL,    // ✅ Production frontend from .env
//     "http://localhost:5173"           // ✅ Local frontend
//   ],
//   credentials: true,
//   methods: ["GET", "POST", "DELETE"],
//   allowedHeaders: ["Content-Type", "Authorization"],
// };


const allowedOrigins = [
  process.env.FRONTEND_BASE_URL,
  "http://localhost:5173"
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like curl or Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};


app.use(cors(corsOptions)); 

app.use(express.json());

app.use("/url", urlRoutes);

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connection successful");
  } catch (error) {
    console.log("Connection error", error);
  }
}
connectDB();

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

app.listen(port, () => {
  console.log(`App listening on http://localhost:${port}`);
});
