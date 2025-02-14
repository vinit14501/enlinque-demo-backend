import express from "express"
import * as formController from "../controllers/formController.js"
import { formSubmissionLimiter } from "../middleware/rateLimiter.js"
import {
  validateContactForm,
  validatePlanForm,
  validate,
} from "../middleware/validator.js"

const router = express.Router()

router.post(
  "/contact",
  formSubmissionLimiter,
  validateContactForm,
  validate,
  formController.submitContactForm
)

router.post(
  "/plan",
  formSubmissionLimiter,
  validatePlanForm,
  validate,
  formController.submitPlanForm
)

export default router
