const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

// Equivalent of: import { fileURLToPath } from 'url';
const { fileURLToPath } = require("url");

exports.sendVerificationEmail = async (user,req) => {
  // Generate verification token
  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_EMAIL_SECRET,
    { expiresIn: "1h" }
  );

  // Create verification link with frontend URL
 const verificationLink= `${req.protocol}://${req.get(
   "host"
 )}/verify-email?token=${token}`;


  // __dirname is available by default in CommonJS
  const templatePath = path.join(__dirname, "../templates/verify_email.html");
  let emailTemplate = fs.readFileSync(templatePath, "utf-8");

  // Replace placeholders with actual data
  emailTemplate = emailTemplate
    .replace(/{{username}}/g, user.email)
    .replace(/{{verificationLink}}/g, verificationLink);

  // Create transporter for sending email
  const transporter = nodemailer.createTransport({
    service: "Gmail", // Or your email service
    auth: {
      user: process.env.MY_EMAIL,
      pass: process.env.MY_EMAIL_PASSWORD,
    },
  });

  try {
    await transporter.sendMail({
      from: `"NeoGPT" <${process.env.MY_EMAIL}>`,
      to: user.email,
      subject: "Verify Your Email Address",
      html: emailTemplate,
    });
  } catch (error) {
    // Optional: delete user if email is invalid (only if user creation was just for verification)
    throw new Error(
      "Could not send verification email. Please check the email address."
    );
  }
};
