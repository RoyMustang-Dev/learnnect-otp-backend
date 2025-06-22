// Backend API for OTP Email Service using Resend
// Deploy this to Render, Vercel, or any Node.js hosting service

const express = require('express');
const cors = require('cors');
const { Resend } = require('resend');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Middleware
app.use(cors({
  origin: ['https://learnnect.com', 'http://localhost:5173', 'https://learnnect-platform.netlify.app'],
  credentials: true
}));
app.use(express.json());

// In-memory OTP storage (use Redis or database in production)
const otpStorage = new Map();

// Generate 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// OTP Email Template
function getOTPEmailTemplate(otp, purpose = 'verification') {
  const purposeText = {
    'signup': 'Account Registration',
    'login': 'Login Verification',
    'verification': 'Email Verification'
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Learnnect - Email Verification</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%); min-height: 100vh;">
      <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 40px;">
          <div style="background: linear-gradient(45deg, #ff0080, #00ffff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-size: 32px; font-weight: bold; margin-bottom: 10px;">
            Learnnect
          </div>
          <p style="color: #a0a0a0; margin: 0; font-size: 16px;">EdTech Platform</p>
        </div>

        <!-- Main Content -->
        <div style="background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(10px); border-radius: 20px; padding: 40px; border: 1px solid rgba(0, 255, 255, 0.2); box-shadow: 0 0 30px rgba(0, 255, 255, 0.1);">
          <h1 style="color: #00ffff; text-align: center; margin-bottom: 30px; font-size: 24px; font-weight: 600;">
            ${purposeText[purpose] || 'Email Verification'}
          </h1>
          
          <p style="color: #ffffff; font-size: 16px; line-height: 1.6; margin-bottom: 30px; text-align: center;">
            Please use the following verification code to complete your ${purpose}:
          </p>

          <!-- OTP Code -->
          <div style="text-align: center; margin: 40px 0;">
            <div style="display: inline-block; background: linear-gradient(45deg, #ff0080, #00ffff); padding: 20px 40px; border-radius: 15px; font-size: 32px; font-weight: bold; color: #ffffff; letter-spacing: 8px; box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);">
              ${otp}
            </div>
          </div>

          <p style="color: #a0a0a0; font-size: 14px; line-height: 1.6; text-align: center; margin-bottom: 30px;">
            This code will expire in <strong style="color: #00ffff;">10 minutes</strong> for security reasons.
          </p>

          <!-- Security Notice -->
          <div style="background: rgba(255, 0, 128, 0.1); border: 1px solid rgba(255, 0, 128, 0.3); border-radius: 10px; padding: 20px; margin-top: 30px;">
            <h3 style="color: #ff0080; margin: 0 0 15px 0; font-size: 16px;">🔒 Security Notice</h3>
            <ul style="color: #ffffff; font-size: 14px; line-height: 1.6; margin: 0; padding-left: 20px;">
              <li>Never share this code with anyone</li>
              <li>Learnnect will never ask for this code via phone or email</li>
              <li>If you didn't request this code, please ignore this email</li>
            </ul>
          </div>
        </div>

        <!-- Footer -->
        <div style="text-align: center; margin-top: 40px; color: #666; font-size: 14px;">
          <p style="margin: 0 0 10px 0;">© 2024 Learnnect EdTech Platform</p>
          <p style="margin: 0; color: #888;">
            This is an automated email. Please do not reply to this message.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// API Routes

// Send OTP Email
app.post('/api/send-otp', async (req, res) => {
  try {
    const { email, purpose = 'verification' } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const expiryTime = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Store OTP
    otpStorage.set(email, {
      otp,
      expiryTime,
      attempts: 0,
      purpose
    });

    // Send email via Resend
    const emailResult = await resend.emails.send({
      from: 'Learnnect <support@learnnect.com>',
      to: [email],
      subject: `Learnnect - Your Verification Code: ${otp}`,
      html: getOTPEmailTemplate(otp, purpose)
    });

    console.log('✅ OTP email sent successfully:', emailResult);

    res.json({
      success: true,
      message: 'OTP sent successfully',
      emailId: emailResult.data?.id
    });

  } catch (error) {
    console.error('❌ Error sending OTP email:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP email',
      error: error.message
    });
  }
});

// Verify OTP
app.post('/api/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required'
      });
    }

    const storedData = otpStorage.get(email);

    if (!storedData) {
      return res.status(400).json({
        success: false,
        message: 'No OTP found for this email'
      });
    }

    // Check expiry
    if (Date.now() > storedData.expiryTime) {
      otpStorage.delete(email);
      return res.status(400).json({
        success: false,
        message: 'OTP has expired'
      });
    }

    // Check attempts
    if (storedData.attempts >= 3) {
      otpStorage.delete(email);
      return res.status(400).json({
        success: false,
        message: 'Too many failed attempts'
      });
    }

    // Verify OTP
    if (storedData.otp !== otp) {
      storedData.attempts++;
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP',
        attemptsLeft: 3 - storedData.attempts
      });
    }

    // OTP verified successfully
    otpStorage.delete(email);

    res.json({
      success: true,
      message: 'OTP verified successfully'
    });

  } catch (error) {
    console.error('❌ Error verifying OTP:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify OTP',
      error: error.message
    });
  }
});

// Send Confirmation Emails
app.post('/api/send-confirmation', async (req, res) => {
  try {
    const { type, to, data } = req.body;

    let subject, html;

    switch (type) {
      case 'welcome':
        subject = 'Welcome to Learnnect! 🎉';
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%); color: white; padding: 40px; border-radius: 20px;">
            <h1 style="color: #00ffff; text-align: center;">Welcome to Learnnect! 🎉</h1>
            <p>Hi ${data.name},</p>
            <p>Welcome to the Learnnect community! Your account has been successfully created.</p>
            <p>Start your learning journey today and unlock your potential!</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://learnnect.com/dashboard" style="background: linear-gradient(45deg, #ff0080, #00ffff); color: white; padding: 15px 30px; text-decoration: none; border-radius: 10px; font-weight: bold;">
                Go to Dashboard
              </a>
            </div>
          </div>
        `;
        break;

      case 'contact':
        subject = 'Thank you for contacting Learnnect';
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%); color: white; padding: 40px; border-radius: 20px;">
            <h1 style="color: #00ffff; text-align: center;">Thank You for Reaching Out! 📧</h1>
            <p>Hi ${data.name},</p>
            <p>We've received your message and will get back to you within 24 hours.</p>
            <p><strong>Your Message:</strong> ${data.message}</p>
          </div>
        `;
        break;

      case 'enquiry':
        subject = 'Thank you for your course enquiry';
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%); color: white; padding: 40px; border-radius: 20px;">
            <h1 style="color: #00ffff; text-align: center;">Course Enquiry Received! 📚</h1>
            <p>Hi ${data.name},</p>
            <p>Thank you for your interest in <strong>${data.courseInterest}</strong>!</p>
            <p>Our team will contact you soon with detailed information.</p>
          </div>
        `;
        break;

      case 'newsletter':
        subject = 'Welcome to Learnnect Newsletter! 📰';
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%); color: white; padding: 40px; border-radius: 20px;">
            <h1 style="color: #00ffff; text-align: center;">Newsletter Subscription Confirmed! 📰</h1>
            <p>Hi ${data.name},</p>
            <p>You're now subscribed to our newsletter! Get ready for:</p>
            <ul>
              <li>Latest course updates</li>
              <li>Industry insights</li>
              <li>Exclusive offers</li>
              <li>Learning tips and tricks</li>
            </ul>
          </div>
        `;
        break;

      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid email type'
        });
    }

    const emailResult = await resend.emails.send({
      from: 'Learnnect <support@learnnect.com>',
      to: [to],
      subject,
      html
    });

    console.log('✅ Confirmation email sent successfully:', emailResult);

    res.json({
      success: true,
      message: 'Confirmation email sent successfully',
      emailId: emailResult.data?.id
    });

  } catch (error) {
    console.error('❌ Error sending confirmation email:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send confirmation email',
      error: error.message
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 OTP API Server running on port ${port}`);
  console.log(`📧 Resend API configured: ${process.env.RESEND_API_KEY ? 'Yes' : 'No'}`);
});

module.exports = app;
