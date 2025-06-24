// Professional Email System for Learnnect - World-Class Templates
// Backend API for OTP Email Service using Resend

const express = require('express');
const cors = require('cors');
const { Resend } = require('resend');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Enhanced logging for debugging
console.log('🚀 Starting Learnnect Professional Email Backend...');
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

// Professional Email Base Template with consistent branding
function getEmailBaseTemplate(content, title = 'Learnnect') {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <title>${title}</title>
      <!--[if mso]>
      <noscript>
        <xml>
          <o:OfficeDocumentSettings>
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
      </noscript>
      <![endif]-->
      <style>
        /* Reset styles */
        body, table, td, p, a, li, blockquote { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
        
        /* Responsive styles */
        @media only screen and (max-width: 600px) {
          .container { width: 100% !important; padding: 20px 10px !important; }
          .main-content { padding: 30px 20px !important; }
          .hero-title { font-size: 24px !important; line-height: 1.2 !important; }
          .cta-button { display: block !important; width: 100% !important; margin: 20px 0 !important; }
          .social-links { text-align: center !important; }
          .social-links a { margin: 5px !important; }
          .stats-grid { display: block !important; }
          .stat-item { display: block !important; margin-bottom: 20px !important; }
        }
        
        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          .email-body { background: #0f0f23 !important; }
        }
      </style>
    </head>
    <body class="email-body" style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%); min-height: 100vh;">
      <div class="container" style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        ${content}
      </div>
    </body>
    </html>
  `;
}

// Professional Email Header with Logo
function getEmailHeader() {
  return `
    <!-- Email Header -->
    <div style="text-align: center; margin-bottom: 40px; padding: 20px 0;">
      <img src="https://learnnect.com/assets/learnnect-logo_gradient.png" alt="Learnnect" style="height: 50px; margin-bottom: 15px; max-width: 200px;" />
      <p style="color: #00ffff; margin: 0; font-size: 16px; font-weight: 500; letter-spacing: 1px;">Learn, Connect, Succeed</p>
    </div>
  `;
}

// Professional Email Footer with proper icons and branding
function getEmailFooter() {
  return `
    <!-- Professional Footer -->
    <div style="background: #0f0f23; padding: 40px 20px; margin-top: 40px; border-radius: 20px; border: 1px solid #1a1a2e;">
      <!-- Logo and Branding -->
      <div style="text-align: center; margin-bottom: 30px;">
        <img src="https://learnnect.com/assets/learnnect-logo_gradient.png" alt="Learnnect" style="height: 40px; margin-bottom: 10px; max-width: 150px;" />
        <p style="color: #00ffff; margin: 0; font-size: 14px; font-weight: 500;">Learn, Connect, Succeed</p>
      </div>

      <!-- Contact Info -->
      <div style="text-align: center; margin-bottom: 25px;">
        <p style="color: #ffffff; margin: 0 0 8px 0; font-size: 14px;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style="display: inline-block; vertical-align: middle; margin-right: 8px;">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="#00ffff" stroke-width="2" fill="none"/>
            <polyline points="22,6 12,13 2,6" stroke="#00ffff" stroke-width="2" fill="none"/>
          </svg>
          <a href="mailto:support@learnnect.com" style="color: #00ffff; text-decoration: none;">support@learnnect.com</a>
        </p>
        <p style="color: #ffffff; margin: 0 0 8px 0; font-size: 14px;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style="display: inline-block; vertical-align: middle; margin-right: 8px;">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="#00ffff" stroke-width="2" fill="none"/>
          </svg>
          +91 7007788926 | +91 9319369737 | +91 8709229353
        </p>
        <p style="color: #a0a0a0; margin: 0; font-size: 12px;">Available 7 days, 9AM-6PM IST</p>
      </div>

      <!-- Social Links with proper icons -->
      <div class="social-links" style="text-align: center; margin-bottom: 25px;">
        <a href="https://learnnect.com" style="display: inline-block; margin: 0 8px; padding: 12px; background: rgba(0, 255, 255, 0.1); border: 1px solid rgba(0, 255, 255, 0.3); border-radius: 50%; text-decoration: none; transition: all 0.3s ease;" title="Visit Website">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#00ffff" stroke-width="2"/>
            <line x1="2" y1="12" x2="22" y2="12" stroke="#00ffff" stroke-width="2"/>
            <path d="m12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke="#00ffff" stroke-width="2"/>
          </svg>
        </a>
        <a href="https://linkedin.com/company/learnnect" style="display: inline-block; margin: 0 8px; padding: 12px; background: rgba(0, 255, 255, 0.1); border: 1px solid rgba(0, 255, 255, 0.3); border-radius: 50%; text-decoration: none; transition: all 0.3s ease;" title="LinkedIn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" stroke="#00ffff" stroke-width="2"/>
            <rect x="2" y="9" width="4" height="12" stroke="#00ffff" stroke-width="2"/>
            <circle cx="4" cy="4" r="2" stroke="#00ffff" stroke-width="2"/>
          </svg>
        </a>
        <a href="https://instagram.com/learnnect" style="display: inline-block; margin: 0 8px; padding: 12px; background: rgba(0, 255, 255, 0.1); border: 1px solid rgba(0, 255, 255, 0.3); border-radius: 50%; text-decoration: none; transition: all 0.3s ease;" title="Instagram">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="#00ffff" stroke-width="2"/>
            <path d="m16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" stroke="#00ffff" stroke-width="2"/>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="#00ffff" stroke-width="2"/>
          </svg>
        </a>
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

// Marketing Stats Component
function getMarketingStats() {
  return `
    <!-- Marketing Stats -->
    <div style="background: linear-gradient(135deg, rgba(0, 255, 255, 0.05) 0%, rgba(255, 0, 128, 0.05) 100%); border: 1px solid rgba(0, 255, 255, 0.2); border-radius: 15px; padding: 30px; margin: 30px 0;">
      <h3 style="color: #00ffff; margin: 0 0 20px 0; font-size: 18px; text-align: center; font-weight: 600;">🚀 Why 10,000+ Students Choose Learnnect</h3>

      <div class="stats-grid" style="display: table; width: 100%; margin-bottom: 20px;">
        <div class="stat-item" style="display: table-cell; text-align: center; padding: 0 15px; border-right: 1px solid rgba(0, 255, 255, 0.2);">
          <div style="color: #ff0080; font-size: 24px; font-weight: bold; margin-bottom: 5px;">95%</div>
          <div style="color: #ffffff; font-size: 12px;">Placement Rate</div>
        </div>
        <div class="stat-item" style="display: table-cell; text-align: center; padding: 0 15px; border-right: 1px solid rgba(0, 255, 255, 0.2);">
          <div style="color: #ff0080; font-size: 24px; font-weight: bold; margin-bottom: 5px;">₹8.5L</div>
          <div style="color: #ffffff; font-size: 12px;">Avg. Package</div>
        </div>
        <div class="stat-item" style="display: table-cell; text-align: center; padding: 0 15px;">
          <div style="color: #ff0080; font-size: 24px; font-weight: bold; margin-bottom: 5px;">500+</div>
          <div style="color: #ffffff; font-size: 12px;">Hiring Partners</div>
        </div>
      </div>

      <div style="color: #ffffff; font-size: 14px; line-height: 1.6;">
        <p style="margin: 0 0 10px 0;">✨ <strong>Project-Based Learning:</strong> Build 15+ real-world projects for your portfolio</p>
        <p style="margin: 0 0 10px 0;">🎯 <strong>3-Phase Curriculum:</strong> Foundations → Core+Advanced → Interview Prep</p>
        <p style="margin: 0 0 10px 0;">💼 <strong>Career Support:</strong> Resume building, mock interviews, job referrals</p>
        <p style="margin: 0;">🎓 <strong>Dual Certifications:</strong> Learnnect + AICTE certified programs</p>
      </div>
    </div>
  `;
}

// OTP Email Template - World-class design with marketing focus
function getOTPEmailTemplate(otp, purpose = 'verification') {
  const purposeConfig = {
    'signup': {
      title: 'Welcome to the Future! 🚀',
      subtitle: 'You\'re one step away from joining 10,000+ successful learners',
      emoji: '🎉'
    },
    'login': {
      title: 'Quick Security Check ✨',
      subtitle: 'Just making sure it\'s really you accessing your account',
      emoji: '🔐'
    },
    'verification': {
      title: 'Let\'s Verify You\'re You! 🔐',
      subtitle: 'Quick verification to keep your learning journey secure',
      emoji: '✅'
    }
  };

  const config = purposeConfig[purpose] || purposeConfig['verification'];

  const content = `
    ${getEmailHeader()}

    <!-- Main Content -->
    <div class="main-content" style="background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(10px); border-radius: 20px; padding: 40px; border: 1px solid rgba(0, 255, 255, 0.2); box-shadow: 0 0 30px rgba(0, 255, 255, 0.1);">
      <div style="text-align: center; margin-bottom: 30px;">
        <div style="font-size: 48px; margin-bottom: 15px;">${config.emoji}</div>
        <h1 class="hero-title" style="color: #00ffff; margin: 0 0 15px 0; font-size: 28px; font-weight: 700; line-height: 1.3;">
          ${config.title}
        </h1>
        <p style="color: #ffffff; font-size: 16px; line-height: 1.6; margin: 0;">
          ${config.subtitle}
        </p>
      </div>

      <!-- OTP Code Section -->
      <div style="text-align: center; margin: 40px 0;">
        <p style="color: #a0a0a0; font-size: 14px; margin-bottom: 15px; font-weight: 500;">Your verification code:</p>
        <div style="background: linear-gradient(135deg, #ff0080 0%, #00ffff 100%); padding: 3px; border-radius: 15px; display: inline-block; margin-bottom: 20px;">
          <div style="background: #0f0f23; padding: 20px 40px; border-radius: 12px; font-size: 32px; font-weight: bold; color: #ffffff; letter-spacing: 8px; font-family: 'Courier New', monospace;">
            ${otp}
          </div>
        </div>
        <p style="color: #a0a0a0; font-size: 14px; margin: 0;">
          Expires in <strong style="color: #00ffff;">10 minutes</strong> • No rush, but don't grab a coffee! ☕
        </p>
      </div>

      ${purpose === 'signup' ? getMarketingStats() : ''}

      <!-- Security Notice -->
      <div style="background: rgba(255, 0, 128, 0.1); border: 1px solid rgba(255, 0, 128, 0.3); border-radius: 15px; padding: 25px; margin-top: 30px;">
        <div style="display: flex; align-items: center; margin-bottom: 15px;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style="margin-right: 10px;">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#ff0080" stroke-width="2" fill="none"/>
            <path d="m9 12 2 2 4-4" stroke="#ff0080" stroke-width="2" fill="none"/>
          </svg>
          <h3 style="color: #ff0080; margin: 0; font-size: 16px; font-weight: 600;">Security First!</h3>
        </div>
        <ul style="color: #ffffff; font-size: 14px; line-height: 1.6; margin: 0; padding-left: 20px;">
          <li>Never share this code with anyone (not even your bestie! 👯‍♀️)</li>
          <li>Learnnect will never ask for this code via phone or email</li>
          <li>Didn't request this? Just ignore this email and carry on! 😎</li>
        </ul>
      </div>
    </div>

    ${getEmailFooter()}
  `;

  return getEmailBaseTemplate(content, `Learnnect - ${config.title}`);
}

// Health check endpoints
app.get('/', (req, res) => {
  res.json({
    status: 'OK',
    service: 'Learnnect Professional Email Backend',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'Learnnect Professional Email Backend',
    version: '2.0.0',
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

// Load professional email templates
const {
  getWelcomeEmailTemplate,
  getContactEmailTemplate,
  getEnquiryEmailTemplate,
  getNewsletterEmailTemplate
} = require('./professional-email-templates');

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
        html = getWelcomeEmailTemplate(data?.name || 'Future Learner');
        break;

      case 'contact':
        fromName = 'Learnnect - Support Team';
        subject = 'Thanks for Reaching Out! We\'ve Got You Covered 💬';
        html = getContactEmailTemplate(data?.name || 'there', data?.message);
        break;

      case 'enquiry':
        fromName = 'Learnnect - Support Team';
        subject = 'Your Course Enquiry - Let\'s Make It Happen! 🎯';
        html = getEnquiryEmailTemplate(data?.name || 'Future Learner', data?.courseInterest);
        break;

      case 'newsletter':
        fromName = 'Learnnect Newsletter';
        subject = 'Welcome to the Inner Circle! 📰✨';
        html = getNewsletterEmailTemplate(data?.name || 'Learning Enthusiast');
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
  console.log(`🚀 Learnnect Professional Email Backend running on port ${port}`);
  console.log(`📧 Resend API configured: ${process.env.RESEND_API_KEY ? 'Yes' : 'No'}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`⏰ Server started at: ${new Date().toISOString()}`);
});

module.exports = app;
