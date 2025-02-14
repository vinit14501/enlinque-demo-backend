import mongoose from "mongoose"
import validator from "validator"

const contactFormSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    minlength: [2, "Name must be at least 2 characters long"],
    maxlength: [50, "Name cannot exceed 50 characters"],
  },
  company: {
    type: String,
    required: [true, "Company name is required"],
    trim: true,
    maxlength: [100, "Company name cannot exceed 100 characters"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
    trim: true,
    validate: {
      validator: function (v) {
        return /^\+?[\d\s-]+$/.test(v)
      },
      message: "Please provide a valid phone number",
    },
  },
  message: {
    type: String,
    required: [true, "Message is required"],
    trim: true,
    minlength: [10, "Message must be at least 10 characters long"],
    maxlength: [1000, "Message cannot exceed 1000 characters"],
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
})

const ContactForm = mongoose.model("ContactForm", contactFormSchema)

export { ContactForm }
