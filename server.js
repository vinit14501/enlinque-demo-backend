import dotenv from "dotenv"
import express from "express"
import cors from "cors"
import helmet from "helmet"
import mongoSanitize from "express-mongo-sanitize"
import compression from "compression"
import connectDB from "./config/db.js"
import formRoutes from "./routes/formRoutes.js"
import { errorHandler } from "./utils/emailConfigChecker.js"

// Configure dotenv at the start
dotenv.config()

const app = express()

// Connect to MongoDB
connectDB()

// Get frontend URL with fallback
const frontendUrl = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.replace(/\/$/, "")
  : "*"

// CORS Configuration
app.use(
  cors({
    origin: frontendUrl,
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
)

// Security Middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", frontendUrl],
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false,
  })
)

// Body parser
app.use(express.json({ limit: "10kb" }))
app.use(express.urlencoded({ extended: true, limit: "10kb" }))

// Data sanitization against NoSQL query injection
app.use(mongoSanitize())

// Compression
app.use(compression())

// Test route
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Welcome to Enlinque API",
  })
})

// API routes
app.use("/api/forms", formRoutes)

app.use(errorHandler)

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  })
})

// Global error handler
app.use((err, req, res, next) => {
  console.error("Error:", err)

  // Mongoose validation error
  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors: Object.values(err.errors).map((e) => e.message),
    })
  }

  // MongoDB duplicate key error
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: "Duplicate key error",
      field: Object.keys(err.keyPattern)[0],
    })
  }

  // Default error
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  })
})

// Start server
const PORT = process.env.PORT || 5000
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`)
})

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION! 💥 Shutting down...")
  console.error(err.name, err.message)
  server.close(() => {
    process.exit(1)
  })
})

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION! 💥 Shutting down...")
  console.error(err.name, err.message)
  process.exit(1)
})
