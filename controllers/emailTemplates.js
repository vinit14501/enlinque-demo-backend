// backend/controllers/emailTemplates.js
export const contactFormTemplate = (data) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    .container { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; }
    .header { background: #000048; color: white; padding: 20px; }
    .content { padding: 20px; }
    .footer { background: #f5f5f5; padding: 20px; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>New Contact Form Submission</h2>
    </div>
    <div class="content">
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Company:</strong> ${data.company}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.phone}</p>
      <p><strong>Message:</strong></p>
      <p>${data.message}</p>
      <p><strong>Submitted at:</strong> ${new Date(
        data.submittedAt
      ).toLocaleString()}</p>
    </div>
    <div class="footer">
      <p>This is an automated message from your website contact form.</p>
    </div>
  </div>
</body>
</html>
`

export const planFormTemplate = (data) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    .container { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; }
    .header { background: #000048; color: white; padding: 20px; }
    .content { padding: 20px; }
    .plan-details { background: #f0f7ff; padding: 15px; margin: 10px 0; }
    .footer { background: #f5f5f5; padding: 20px; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>New Plan Subscription Request</h2>
    </div>
    <div class="content">
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.phone}</p>
      <div class="plan-details">
        <h3>Selected Plan Details</h3>
        <p><strong>Plan Name:</strong> ${data.selectedPlan.name}</p>
        <p><strong>Price:</strong> $${data.selectedPlan.price}/month</p>
      </div>
      <p><strong>Submitted at:</strong> ${new Date(
        data.submittedAt
      ).toLocaleString()}</p>
    </div>
    <div class="footer">
      <p>This is an automated message from your website subscription form.</p>
    </div>
  </div>
</body>
</html>
`
