// Backend API for OTP Email Service using Resend
// Deploy this to Render, Vercel, or any Node.js hosting service

const express = require('express');
const cors = require('cors');
const { Resend } = require('resend');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Enhanced logging for debugging
console.log('🚀 Starting Learnnect OTP Backend...');
console.log(`📍 Port: ${port}`);
console.log(`📧 Resend API Key configured: ${process.env.RESEND_API_KEY ? 'Yes' : 'No'}`);
console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);

// Initialize Resend with error handling
let resend;
try {
  if (!process.env.RESEND_API_KEY) {
    console.warn('⚠️  RESEND_API_KEY not found in environment variables');
    console.warn('⚠️  Email functionality will be limited');
  }
  resend = new Resend(process.env.RESEND_API_KEY);
  console.log('✅ Resend initialized successfully');
} catch (error) {
  console.error('❌ Failed to initialize Resend:', error.message);
  process.exit(1);
}

// Enhanced CORS configuration
const corsOptions = {
  origin: [
    'https://learnnect.com',
    'https://www.learnnect.com',
    'http://localhost:5173',
    'http://localhost:3000',
    'https://learnnect-platform.netlify.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`📝 ${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// In-memory OTP storage (use Redis or database in production)
const otpStorage = new Map();

// Cleanup expired OTPs every 5 minutes
setInterval(() => {
  const now = Date.now();
  let cleanedCount = 0;
  for (const [key, data] of otpStorage.entries()) {
    if (now > data.expiryTime) {
      otpStorage.delete(key);
      cleanedCount++;
    }
  }
  if (cleanedCount > 0) {
    console.log(`🧹 Cleaned up ${cleanedCount} expired OTPs`);
  }
}, 5 * 60 * 1000);

// Generate 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Professional Email Footer Template
function getEmailFooter() {
  return `
    <!-- Professional Footer -->
    <div style="background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%); padding: 40px 20px; margin-top: 40px; border-radius: 20px; border: 1px solid rgba(0, 255, 255, 0.1);">
      <!-- Logo and Branding -->
      <div style="text-align: center; margin-bottom: 30px;">
        <div style="background: linear-gradient(45deg, #ff0080, #00ffff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-size: 28px; font-weight: bold; margin-bottom: 8px;">
          Learnnect
        </div>
        <p style="color: #00ffff; margin: 0; font-size: 14px; font-weight: 500;">Learn, Connect, Succeed</p>
      </div>

      <!-- Contact Info -->
      <div style="text-align: center; margin-bottom: 25px;">
        <p style="color: #ffffff; margin: 0 0 8px 0; font-size: 14px;">
          📧 <a href="mailto:support@learnnect.com" style="color: #00ffff; text-decoration: none;">support@learnnect.com</a>
        </p>
        <p style="color: #ffffff; margin: 0 0 8px 0; font-size: 14px;">
          📞 +91 7007788926 | +91 9319369737 | +91 8709229353
        </p>
        <p style="color: #a0a0a0; margin: 0; font-size: 12px;">Available 7 days, 9AM-6PM IST</p>
      </div>

      <!-- Social Links -->
      <div style="text-align: center; margin-bottom: 25px;">
        <a href="https://learnnect.com" style="display: inline-block; margin: 0 10px; padding: 8px 16px; background: rgba(0, 255, 255, 0.1); border: 1px solid rgba(0, 255, 255, 0.3); border-radius: 8px; color: #00ffff; text-decoration: none; font-size: 12px;">🌐 Website</a>
        <a href="https://linkedin.com/company/learnnect" style="display: inline-block; margin: 0 10px; padding: 8px 16px; background: rgba(0, 255, 255, 0.1); border: 1px solid rgba(0, 255, 255, 0.3); border-radius: 8px; color: #00ffff; text-decoration: none; font-size: 12px;">💼 LinkedIn</a>
        <a href="https://instagram.com/learnnect" style="display: inline-block; margin: 0 10px; padding: 8px 16px; background: rgba(0, 255, 255, 0.1); border: 1px solid rgba(0, 255, 255, 0.3); border-radius: 8px; color: #00ffff; text-decoration: none; font-size: 12px;">📸 Instagram</a>
      </div>

      <!-- Legal -->
      <div style="text-align: center; padding-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.1);">
        <p style="color: #666; margin: 0 0 8px 0; font-size: 12px;">© 2024 Learnnect EdTech Platform. All rights reserved.</p>
        <p style="color: #888; margin: 0; font-size: 11px;">
          Wave City Sector 2, Ghaziabad, Pin 201002 | 
          <a href="https://learnnect.com/privacy" style="color: #00ffff; text-decoration: none;">Privacy Policy</a> | 
          <a href="https://learnnect.com/terms" style="color: #00ffff; text-decoration: none;">Terms of Service</a>
        </p>
      </div>
    </div>
  `;
}

// OTP Email Template - Professional, Witty, Gen Z-friendly
function getOTPEmailTemplate(otp, purpose = 'verification') {
  const purposeText = {
    'signup': 'Welcome Aboard! 🚀',
    'login': 'Quick Security Check ✨',
    'verification': 'Let\'s Verify You\'re You! 🔐'
  };

  const purposeSubtext = {
    'signup': 'You\'re one step away from joining the future of learning!',
    'login': 'Just making sure it\'s really you trying to access your account.',
    'verification': 'Quick verification to keep your account secure and sound.'
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Learnnect - ${purposeText[purpose] || 'Email Verification'}</title>
      <style>
        @media only screen and (max-width: 600px) {
          .container { padding: 20px 10px !important; }
          .main-content { padding: 30px 20px !important; }
          .otp-code { font-size: 28px !important; padding: 15px 30px !important; }
          .social-links a { margin: 5px !important; display: block !important; }
        }
      </style>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%); min-height: 100vh;">
      <div class="container" style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 40px;">
          <div style="background: linear-gradient(45deg, #ff0080, #00ffff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-size: 36px; font-weight: bold; margin-bottom: 10px;">
            Learnnect
          </div>
          <p style="color: #00ffff; margin: 0; font-size: 16px; font-weight: 500;">Learn, Connect, Succeed</p>
        </div>

        <!-- Main Content -->
        <div class="main-content" style="background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(10px); border-radius: 20px; padding: 40px; border: 1px solid rgba(0, 255, 255, 0.2); box-shadow: 0 0 30px rgba(0, 255, 255, 0.1);">
          <h1 style="color: #00ffff; text-align: center; margin-bottom: 15px; font-size: 26px; font-weight: 600;">
            ${purposeText[purpose] || 'Email Verification'}
          </h1>
          
          <p style="color: #ffffff; font-size: 16px; line-height: 1.6; margin-bottom: 30px; text-align: center;">
            ${purposeSubtext[purpose] || 'Please verify your email to continue.'}
          </p>

          <!-- OTP Code -->
          <div style="text-align: center; margin: 40px 0;">
            <p style="color: #a0a0a0; font-size: 14px; margin-bottom: 15px;">Your verification code:</p>
            <div class="otp-code" style="display: inline-block; background: linear-gradient(45deg, #ff0080, #00ffff); padding: 20px 40px; border-radius: 15px; font-size: 32px; font-weight: bold; color: #ffffff; letter-spacing: 8px; box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);">
              ${otp}
            </div>
          </div>

          <p style="color: #a0a0a0; font-size: 14px; line-height: 1.6; text-align: center; margin-bottom: 30px;">
            This code expires in <strong style="color: #00ffff;">10 minutes</strong>. No rush, but don't take a coffee break! ☕
          </p>

          <!-- Why Learnnect Section -->
          <div style="background: rgba(0, 255, 255, 0.05); border: 1px solid rgba(0, 255, 255, 0.2); border-radius: 15px; padding: 25px; margin: 30px 0;">
            <h3 style="color: #00ffff; margin: 0 0 15px 0; font-size: 18px; text-align: center;">🎯 Why Choose Learnnect?</h3>
            <div style="color: #ffffff; font-size: 14px; line-height: 1.6;">
              <p style="margin: 0 0 10px 0;">✨ <strong>Project-Based Learning:</strong> Real-world projects, not just theory</p>
              <p style="margin: 0 0 10px 0;">🚀 <strong>3-Phase Curriculum:</strong> Foundations → Core+Advanced → Interview Prep</p>
              <p style="margin: 0 0 10px 0;">💼 <strong>Career Support:</strong> Resume building, mock interviews, job updates</p>
              <p style="margin: 0;">🎓 <strong>Dual Certifications:</strong> Learnnect + AICTE certified courses</p>
            </div>
          </div>

          <!-- Security Notice -->
          <div style="background: rgba(255, 0, 128, 0.1); border: 1px solid rgba(255, 0, 128, 0.3); border-radius: 10px; padding: 20px; margin-top: 30px;">
            <h3 style="color: #ff0080; margin: 0 0 15px 0; font-size: 16px;">🔒 Security First!</h3>
            <ul style="color: #ffffff; font-size: 14px; line-height: 1.6; margin: 0; padding-left: 20px;">
              <li>Never share this code with anyone (not even your bestie! 👯‍♀️)</li>
              <li>Learnnect will never ask for this code via phone or email</li>
              <li>Didn't request this? Just ignore this email and carry on! 😎</li>
            </ul>
          </div>
        </div>

        ${getEmailFooter()}
      </div>
    </body>
    </html>
  `;
}

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'OK',
    service: 'Learnnect OTP Backend',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'Learnnect OTP Backend',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    env: {
      nodeVersion: process.version,
      platform: process.platform,
      resendConfigured: !!process.env.RESEND_API_KEY
    }
  });
});

// API Routes

// Send OTP Email
app.post('/api/send-otp', async (req, res) => {
  try {
    const { email, purpose = 'verification' } = req.body;

    console.log(`📧 OTP request for: ${email}, purpose: ${purpose}`);

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Check if Resend is configured
    if (!process.env.RESEND_API_KEY) {
      console.log(`🔧 Development mode: OTP for ${email} would be sent`);
      return res.json({
        success: true,
        message: 'OTP sent successfully (development mode)',
        development: true
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
      from: 'Learnnect - Support Team <support@learnnect.com>',
      to: [email],
      subject: `Learnnect - Your Verification Code: ${otp}`,
      html: getOTPEmailTemplate(otp, purpose)
    });

    console.log('✅ OTP email sent successfully:', emailResult.data?.id);

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

    console.log(`🔍 OTP verification for: ${email}`);

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
    console.log('✅ OTP verified successfully for:', email);

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

    console.log(`📧 Confirmation email request: ${type} to ${to}`);

    if (!type || !to) {
      return res.status(400).json({
        success: false,
        message: 'Type and recipient email are required'
      });
    }

    // Check if Resend is configured
    if (!process.env.RESEND_API_KEY) {
      console.log(`🔧 Development mode: ${type} confirmation email for ${to} would be sent`);
      return res.json({
        success: true,
        message: 'Confirmation email sent successfully (development mode)',
        development: true
      });
    }

    let subject, html, fromName;

    switch (type) {
      case 'welcome':
        fromName = 'Learnnect - Support Team';
        subject = 'Welcome to the Future of Learning! 🚀';
        html = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to Learnnect!</title>
            <style>
              @media only screen and (max-width: 600px) {
                .container { padding: 20px 10px !important; }
                .main-content { padding: 30px 20px !important; }
                .cta-button { display: block !important; margin: 20px auto !important; }
              }
            </style>
          </head>
          <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%); min-height: 100vh;">
            <div class="container" style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
              <!-- Header -->
              <div style="text-align: center; margin-bottom: 40px;">
                <div style="background: linear-gradient(45deg, #ff0080, #00ffff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-size: 36px; font-weight: bold; margin-bottom: 10px;">
                  Learnnect
                </div>
                <p style="color: #00ffff; margin: 0; font-size: 16px; font-weight: 500;">Learn, Connect, Succeed</p>
              </div>

              <!-- Main Content -->
              <div class="main-content" style="background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(10px); border-radius: 20px; padding: 40px; border: 1px solid rgba(0, 255, 255, 0.2); box-shadow: 0 0 30px rgba(0, 255, 255, 0.1);">
                <h1 style="color: #00ffff; text-align: center; margin-bottom: 20px; font-size: 28px; font-weight: 600;">
                  Welcome to the Squad, ${data?.name || 'Future Learner'}! 🎉
                </h1>

                <p style="color: #ffffff; font-size: 18px; line-height: 1.6; margin-bottom: 30px; text-align: center;">
                  You just joined thousands of ambitious learners who are transforming their careers with cutting-edge skills!
                </p>

                <div style="background: linear-gradient(45deg, rgba(255, 0, 128, 0.1), rgba(0, 255, 255, 0.1)); border: 1px solid rgba(0, 255, 255, 0.3); border-radius: 15px; padding: 30px; margin: 30px 0;">
                  <h2 style="color: #ff0080; margin: 0 0 20px 0; font-size: 20px; text-align: center;">🚀 Your Learning Journey Starts Now!</h2>

                  <div style="color: #ffffff; font-size: 15px; line-height: 1.7;">
                    <p style="margin: 0 0 15px 0;">🎯 <strong>Project-Based Learning:</strong> Build real-world projects that employers actually want to see</p>
                    <p style="margin: 0 0 15px 0;">📚 <strong>3-Phase Curriculum:</strong> Foundations → Core+Advanced → Interview Prep (we've got your back!)</p>
                    <p style="margin: 0 0 15px 0;">💼 <strong>Career Support:</strong> Resume building, mock interviews, and job updates (because landing that dream job is the goal!)</p>
                    <p style="margin: 0 0 15px 0;">🎓 <strong>Dual Certifications:</strong> Learnnect + AICTE certified (double the credibility!)</p>
                    <p style="margin: 0;">🤝 <strong>Lifetime Support:</strong> Get placed? We'll support you for life (that's our promise!)</p>
                  </div>
                </div>

                <div style="text-align: center; margin: 40px 0;">
                  <a href="https://learnnect.com/dashboard" class="cta-button" style="display: inline-block; background: linear-gradient(45deg, #ff0080, #00ffff); color: white; padding: 15px 40px; text-decoration: none; border-radius: 25px; font-weight: bold; font-size: 16px; box-shadow: 0 0 20px rgba(0, 255, 255, 0.3); transition: all 0.3s ease;">
                    🚀 Start Learning Now
                  </a>
                </div>

                <div style="background: rgba(0, 255, 255, 0.05); border: 1px solid rgba(0, 255, 255, 0.2); border-radius: 15px; padding: 25px; margin: 30px 0;">
                  <h3 style="color: #00ffff; margin: 0 0 15px 0; font-size: 18px; text-align: center;">💡 Pro Tips for Success</h3>
                  <div style="color: #ffffff; font-size: 14px; line-height: 1.6;">
                    <p style="margin: 0 0 10px 0;">✨ Set aside dedicated learning time daily (consistency > intensity)</p>
                    <p style="margin: 0 0 10px 0;">🔥 Join our community discussions (networking = opportunities)</p>
                    <p style="margin: 0 0 10px 0;">💪 Don't skip the projects (they're your portfolio goldmine)</p>
                    <p style="margin: 0;">🎯 Track your progress and celebrate small wins!</p>
                  </div>
                </div>
              </div>

              ${getEmailFooter()}
            </div>
          </body>
          </html>
        `;
        break;

      case 'contact':
        fromName = 'Learnnect - Support Team';
        subject = 'Thanks for Reaching Out! We\'ve Got You Covered 💬';
        html = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Thanks for Contacting Learnnect!</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%); min-height: 100vh;">
            <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
              <div style="text-align: center; margin-bottom: 40px;">
                <div style="background: linear-gradient(45deg, #ff0080, #00ffff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-size: 36px; font-weight: bold; margin-bottom: 10px;">Learnnect</div>
                <p style="color: #00ffff; margin: 0; font-size: 16px; font-weight: 500;">Learn, Connect, Succeed</p>
              </div>

              <div style="background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(10px); border-radius: 20px; padding: 40px; border: 1px solid rgba(0, 255, 255, 0.2);">
                <h1 style="color: #00ffff; text-align: center; margin-bottom: 20px; font-size: 26px;">Hey ${data?.name || 'there'}! 👋</h1>
                <p style="color: #ffffff; font-size: 16px; line-height: 1.6; text-align: center; margin-bottom: 25px;">
                  Thanks for dropping us a message! We've received it and our team will get back to you within 24 hours (probably sooner, we're pretty quick! ⚡).
                </p>
                ${data?.message ? `
                <div style="background: rgba(0, 255, 255, 0.05); border: 1px solid rgba(0, 255, 255, 0.2); border-radius: 10px; padding: 20px; margin: 25px 0;">
                  <h3 style="color: #00ffff; margin: 0 0 10px 0; font-size: 16px;">📝 Your Message:</h3>
                  <p style="color: #ffffff; margin: 0; font-style: italic;">"${data.message}"</p>
                </div>
                ` : ''}
                <p style="color: #a0a0a0; font-size: 14px; text-align: center; margin-top: 30px;">
                  In the meantime, feel free to explore our courses and get a head start on your learning journey! 🚀
                </p>
              </div>
              ${getEmailFooter()}
            </div>
          </body>
          </html>
        `;
        break;

      case 'enquiry':
        fromName = 'Learnnect - Support Team';
        subject = 'Your Course Enquiry - Let\'s Make It Happen! 🎯';
        html = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Course Enquiry Received!</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%); min-height: 100vh;">
            <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
              <div style="text-align: center; margin-bottom: 40px;">
                <div style="background: linear-gradient(45deg, #ff0080, #00ffff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-size: 36px; font-weight: bold; margin-bottom: 10px;">Learnnect</div>
                <p style="color: #00ffff; margin: 0; font-size: 16px; font-weight: 500;">Learn, Connect, Succeed</p>
              </div>

              <div style="background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(10px); border-radius: 20px; padding: 40px; border: 1px solid rgba(0, 255, 255, 0.2);">
                <h1 style="color: #00ffff; text-align: center; margin-bottom: 20px; font-size: 26px;">Awesome Choice, ${data?.name || 'Future Learner'}! 🎉</h1>
                <p style="color: #ffffff; font-size: 16px; line-height: 1.6; text-align: center; margin-bottom: 25px;">
                  Thanks for your interest in ${data?.courseInterest ? `<strong style="color: #ff0080;">${data.courseInterest}</strong>` : 'our courses'}! You're about to embark on an incredible learning journey.
                </p>

                <div style="background: linear-gradient(45deg, rgba(255, 0, 128, 0.1), rgba(0, 255, 255, 0.1)); border: 1px solid rgba(0, 255, 255, 0.3); border-radius: 15px; padding: 25px; margin: 25px 0;">
                  <h3 style="color: #ff0080; margin: 0 0 15px 0; font-size: 18px; text-align: center;">🚀 What Happens Next?</h3>
                  <div style="color: #ffffff; font-size: 14px; line-height: 1.6;">
                    <p style="margin: 0 0 10px 0;">📞 Our course advisor will call you within 2-4 hours</p>
                    <p style="margin: 0 0 10px 0;">💡 We'll discuss your career goals and learning preferences</p>
                    <p style="margin: 0 0 10px 0;">🎯 Get a personalized learning roadmap</p>
                    <p style="margin: 0;">💰 Learn about our current offers and payment options</p>
                  </div>
                </div>

                <p style="color: #a0a0a0; font-size: 14px; text-align: center; margin-top: 30px;">
                  Can't wait? Call us directly at <strong style="color: #00ffff;">+91 7007788926</strong> 📞
                </p>
              </div>
              ${getEmailFooter()}
            </div>
          </body>
          </html>
        `;
        break;

      case 'newsletter':
        fromName = 'Learnnect Newsletter';
        subject = 'Welcome to the Learnnect Newsletter! 📰✨';
        html = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Newsletter Subscription Confirmed!</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%); min-height: 100vh;">
            <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
              <div style="text-align: center; margin-bottom: 40px;">
                <div style="background: linear-gradient(45deg, #ff0080, #00ffff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-size: 36px; font-weight: bold; margin-bottom: 10px;">Learnnect</div>
                <p style="color: #00ffff; margin: 0; font-size: 16px; font-weight: 500;">Learn, Connect, Succeed</p>
              </div>

              <div style="background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(10px); border-radius: 20px; padding: 40px; border: 1px solid rgba(0, 255, 255, 0.2);">
                <h1 style="color: #00ffff; text-align: center; margin-bottom: 20px; font-size: 26px;">You're In! Welcome to the Inner Circle 🎉</h1>
                <p style="color: #ffffff; font-size: 16px; line-height: 1.6; text-align: center; margin-bottom: 30px;">
                  Hey ${data?.name || 'Learning Enthusiast'}! You just joined our exclusive newsletter community. Get ready for some seriously good content! 🔥
                </p>

                <div style="background: linear-gradient(45deg, rgba(255, 0, 128, 0.1), rgba(0, 255, 255, 0.1)); border: 1px solid rgba(0, 255, 255, 0.3); border-radius: 15px; padding: 25px; margin: 25px 0;">
                  <h3 style="color: #ff0080; margin: 0 0 15px 0; font-size: 18px; text-align: center;">📬 What's Coming Your Way?</h3>
                  <div style="color: #ffffff; font-size: 14px; line-height: 1.6;">
                    <p style="margin: 0 0 12px 0;">🚀 <strong>Latest Course Updates:</strong> Be the first to know about new courses and features</p>
                    <p style="margin: 0 0 12px 0;">💡 <strong>Industry Insights:</strong> Trends, tips, and career advice from the tech world</p>
                    <p style="margin: 0 0 12px 0;">🎁 <strong>Exclusive Offers:</strong> Special discounts and early-bird pricing (subscribers only!)</p>
                    <p style="margin: 0 0 12px 0;">📚 <strong>Learning Resources:</strong> Free guides, cheat sheets, and project ideas</p>
                    <p style="margin: 0;">🎯 <strong>Success Stories:</strong> Real stories from learners who landed their dream jobs</p>
                  </div>
                </div>

                <div style="background: rgba(0, 255, 255, 0.05); border: 1px solid rgba(0, 255, 255, 0.2); border-radius: 15px; padding: 20px; margin: 25px 0;">
                  <h3 style="color: #00ffff; margin: 0 0 10px 0; font-size: 16px; text-align: center;">💌 Newsletter Schedule</h3>
                  <p style="color: #ffffff; margin: 0; font-size: 14px; text-align: center;">
                    We send out newsletters <strong>twice a week</strong> - just enough to keep you informed without overwhelming your inbox. Quality over quantity, always! ✨
                  </p>
                </div>

                <p style="color: #a0a0a0; font-size: 13px; text-align: center; margin-top: 30px;">
                  Don't want these emails anymore? No hard feelings - you can unsubscribe anytime. But we think you'll love what we have in store! 😉
                </p>
              </div>
              ${getEmailFooter()}
            </div>
          </body>
          </html>
        `;
        break;

      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid email type'
        });
    }

    const emailResult = await resend.emails.send({
      from: `${fromName} <support@learnnect.com>`,
      to: [to],
      subject,
      html
    });

    console.log('✅ Confirmation email sent successfully:', emailResult.data?.id);

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

// Global error handlers
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Learnnect OTP Backend running on port ${port}`);
  console.log(`📧 Resend API configured: ${process.env.RESEND_API_KEY ? 'Yes' : 'No'}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`⏰ Server started at: ${new Date().toISOString()}`);
});

module.exports = app;
