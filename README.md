# Learnnect OTP Backend API

Backend service for handling OTP verification and email sending for Learnnect platform.

## Environment Variables

```env
RESEND_API_KEY=your_resend_api_key_here
PORT=3001
NODE_ENV=production
```

## Deployment

1. Deploy to Render.com
2. Set environment variables
3. Update frontend VITE_BACKEND_API_URL

## API Endpoints

- POST /api/send-otp - Send OTP email
- POST /api/verify-otp - Verify OTP code  
- POST /api/send-confirmation - Send confirmation emails
- GET /health - Health check

## CORS

Configured for:
- https://learnnect.com
- http://localhost:5173
- https://learnnect-platform.netlify.app
