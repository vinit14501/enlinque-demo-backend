import nodemailer from "nodemailer"
import { ContactForm } from "../models/ContactForm.js"
import { PlanForm } from "../models/PlanForm.js"
import { contactFormTemplate, planFormTemplate } from "./emailTemplates.js"

// Create transporter with more detailed configuration
const createTransporter = () => {
  return nodemailer.createTransport({
    host: "smtp.hostinger.com",
    port: 465,
    secure: true, // use SSL
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    debug: true,
    logger: true, // Enable logger
  })
}

export const submitContactForm = async (req, res) => {
  let savedForm = null

  try {
    const { name, company, email, phone, message } = req.body
    const submittedAt = new Date()

    // First, save to database independently of email status
    const contactForm = new ContactForm({
      name,
      company,
      email,
      phone,
      message,
      submittedAt,
    })

    savedForm = await contactForm.save()
    console.log("Form data saved to database successfully")

    // Then attempt to send emails
    const transporter = createTransporter()

    // Test connection first
    await transporter.verify()
    console.log("Transporter verified successfully")

    // Send admin notification
    const mailOptions = {
      from: `"Contact Form" <${process.env.EMAIL_USER}>`,
      to: process.env.RECIPIENT_EMAIL,
      subject: "🔔 New Contact Form Submission",
      html: contactFormTemplate({
        name,
        company,
        email,
        phone,
        message,
        submittedAt,
      }),
    }

    await transporter.sendMail(mailOptions)
    console.log("Admin notification sent successfully")

    // Send user confirmation
    const userConfirmation = {
      from: `"Enlinque" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "We received your message",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #000048;">Thank you for contacting us!</h2>
          <p>Dear ${name},</p>
          <p>We have received your message and will get back to you shortly.</p>
          <p>Best regards,<br>Enlinque Team</p>
        </div>
      `,
    }

    await transporter.sendMail(userConfirmation)
    console.log("User confirmation sent successfully")

    res.status(200).json({
      success: true,
      message: "Message sent and stored successfully",
      formId: savedForm._id,
    })
  } catch (error) {
    console.error("Detailed error:", error)

    // If we successfully saved to database but email failed
    if (savedForm) {
      res.status(200).json({
        success: true,
        message:
          "Your message was stored successfully, but email notification failed. We will contact you soon.",
        formId: savedForm._id,
        emailError: true,
      })
    } else {
      res.status(500).json({
        success: false,
        message: "Failed to process your request",
        error: error.message,
      })
    }
  }
}

export const submitPlanForm = async (req, res) => {
  let savedForm = null

  try {
    const { name, email, phone, selectedPlan } = req.body
    const submittedAt = new Date()

    // First save to database
    const planForm = new PlanForm({
      name,
      email,
      phone,
      selectedPlan,
      submittedAt,
    })

    savedForm = await planForm.save()
    console.log("Plan form saved to database successfully")

    // Then attempt to send emails
    const transporter = createTransporter()
    await transporter.verify()

    // Send admin notification
    const mailOptions = {
      from: `"Plan Form" <${process.env.EMAIL_USER}>`,
      to: process.env.RECIPIENT_EMAIL,
      subject: "🎯 New Plan Selection",
      html: planFormTemplate({
        name,
        email,
        phone,
        selectedPlan,
        submittedAt,
      }),
    }

    await transporter.sendMail(mailOptions)
    console.log("Plan form admin notification sent successfully")

    // Send user confirmation
    const userConfirmation = {
      from: `"Enlinque" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Thank you for your interest!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #000048;">Thank you for choosing our services!</h2>
          <p>Dear ${name},</p>
          <p>We have received your request for the ${selectedPlan.name} plan.</p>
          <p>Our team will contact you shortly to complete the setup process.</p>
          <p>Best regards,<br>Enlinque Team</p>
        </div>
      `,
    }

    await transporter.sendMail(userConfirmation)
    console.log("Plan form user confirmation sent successfully")

    res.status(200).json({
      success: true,
      message: "Plan selection submitted successfully",
      formId: savedForm._id,
    })
  } catch (error) {
    console.error("Detailed error:", error)

    // If we successfully saved to database but email failed
    if (savedForm) {
      res.status(200).json({
        success: true,
        message:
          "Your plan selection was stored successfully, but email notification failed. We will contact you soon.",
        formId: savedForm._id,
        emailError: true,
      })
    } else {
      res.status(500).json({
        success: false,
        message: "Failed to process your request",
        error: error.message,
      })
    }
  }
}
