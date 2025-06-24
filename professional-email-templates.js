// Professional Email Templates for Learnnect - Sales-Driving, Marketing-Focused

// Welcome Email Template - Sales-focused with strong marketing
function getWelcomeEmailTemplate(name) {
  const content = `
    ${getEmailHeader()}
    
    <!-- Hero Section -->
    <div class="main-content" style="background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(10px); border-radius: 20px; padding: 40px; border: 1px solid rgba(0, 255, 255, 0.2); box-shadow: 0 0 30px rgba(0, 255, 255, 0.1);">
      <div style="text-align: center; margin-bottom: 30px;">
        <div style="font-size: 48px; margin-bottom: 15px;">🎉</div>
        <h1 class="hero-title" style="color: #00ffff; margin: 0 0 15px 0; font-size: 28px; font-weight: 700; line-height: 1.3;">
          Welcome to Your Future, ${name}! 🚀
        </h1>
        <p style="color: #ffffff; font-size: 18px; line-height: 1.6; margin: 0;">
          You just joined <strong style="color: #ff0080;">10,000+ ambitious learners</strong> who are transforming their careers with cutting-edge skills!
        </p>
      </div>

      <!-- Success Stories -->
      <div style="background: linear-gradient(135deg, rgba(255, 0, 128, 0.1) 0%, rgba(0, 255, 255, 0.1) 100%); border: 1px solid rgba(0, 255, 255, 0.3); border-radius: 15px; padding: 30px; margin: 30px 0;">
        <h2 style="color: #ff0080; margin: 0 0 20px 0; font-size: 20px; text-align: center; font-weight: 600;">🌟 Real Success Stories</h2>
        
        <div style="display: table; width: 100%; margin-bottom: 20px;">
          <div style="display: table-cell; text-align: center; padding: 0 15px; border-right: 1px solid rgba(0, 255, 255, 0.2);">
            <div style="color: #00ffff; font-size: 16px; font-weight: bold; margin-bottom: 5px;">Priya S.</div>
            <div style="color: #ffffff; font-size: 12px; margin-bottom: 5px;">Data Scientist at Google</div>
            <div style="color: #ff0080; font-size: 14px; font-weight: bold;">₹28L Package</div>
          </div>
          <div style="display: table-cell; text-align: center; padding: 0 15px; border-right: 1px solid rgba(0, 255, 255, 0.2);">
            <div style="color: #00ffff; font-size: 16px; font-weight: bold; margin-bottom: 5px;">Rahul M.</div>
            <div style="color: #ffffff; font-size: 12px; margin-bottom: 5px;">SDE at Microsoft</div>
            <div style="color: #ff0080; font-size: 14px; font-weight: bold;">₹32L Package</div>
          </div>
          <div style="display: table-cell; text-align: center; padding: 0 15px;">
            <div style="color: #00ffff; font-size: 16px; font-weight: bold; margin-bottom: 5px;">Anita K.</div>
            <div style="color: #ffffff; font-size: 12px; margin-bottom: 5px;">ML Engineer at Amazon</div>
            <div style="color: #ff0080; font-size: 14px; font-weight: bold;">₹25L Package</div>
          </div>
        </div>
      </div>

      ${getMarketingStats()}

      <!-- CTA Section -->
      <div style="text-align: center; margin: 40px 0;">
        <a href="https://learnnect.com/dashboard" class="cta-button" style="display: inline-block; background: linear-gradient(135deg, #ff0080 0%, #00ffff 100%); color: white; padding: 18px 40px; text-decoration: none; border-radius: 25px; font-weight: bold; font-size: 16px; box-shadow: 0 0 20px rgba(0, 255, 255, 0.3); transition: all 0.3s ease; text-transform: uppercase; letter-spacing: 1px;">
          🚀 Start Your Journey Now
        </a>
        <p style="color: #a0a0a0; font-size: 14px; margin-top: 15px;">
          Join live sessions, access premium content, and start building your portfolio today!
        </p>
      </div>

      <!-- Next Steps -->
      <div style="background: rgba(0, 255, 255, 0.05); border: 1px solid rgba(0, 255, 255, 0.2); border-radius: 15px; padding: 25px; margin: 30px 0;">
        <h3 style="color: #00ffff; margin: 0 0 15px 0; font-size: 18px; text-align: center;">🎯 Your Next Steps</h3>
        <div style="color: #ffffff; font-size: 14px; line-height: 1.6;">
          <p style="margin: 0 0 10px 0;">1️⃣ <strong>Complete your profile</strong> - Add your goals and preferences</p>
          <p style="margin: 0 0 10px 0;">2️⃣ <strong>Choose your learning path</strong> - Browse our industry-aligned courses</p>
          <p style="margin: 0 0 10px 0;">3️⃣ <strong>Join the community</strong> - Connect with peers and mentors</p>
          <p style="margin: 0;">4️⃣ <strong>Start building</strong> - Begin your first project today!</p>
        </div>
      </div>
    </div>

    ${getEmailFooter()}
  `;

  return getEmailBaseTemplate(content, 'Welcome to Learnnect - Your Future Starts Now!');
}

// Contact Confirmation Email Template - Professional and reassuring
function getContactEmailTemplate(name, message) {
  const content = `
    ${getEmailHeader()}
    
    <div class="main-content" style="background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(10px); border-radius: 20px; padding: 40px; border: 1px solid rgba(0, 255, 255, 0.2);">
      <div style="text-align: center; margin-bottom: 30px;">
        <div style="font-size: 48px; margin-bottom: 15px;">💬</div>
        <h1 class="hero-title" style="color: #00ffff; margin: 0 0 15px 0; font-size: 26px; font-weight: 700;">
          Thanks for Reaching Out, ${name}! 
        </h1>
        <p style="color: #ffffff; font-size: 16px; line-height: 1.6; margin: 0;">
          We've received your message and our expert team will get back to you within <strong style="color: #ff0080;">2-4 hours</strong> (probably sooner - we're pretty quick! ⚡)
        </p>
      </div>

      ${message ? `
      <div style="background: rgba(0, 255, 255, 0.05); border: 1px solid rgba(0, 255, 255, 0.2); border-radius: 10px; padding: 20px; margin: 25px 0;">
        <h3 style="color: #00ffff; margin: 0 0 10px 0; font-size: 16px;">📝 Your Message:</h3>
        <p style="color: #ffffff; margin: 0; font-style: italic; line-height: 1.6;">"${message}"</p>
      </div>
      ` : ''}

      <!-- While You Wait -->
      <div style="background: linear-gradient(135deg, rgba(255, 0, 128, 0.1) 0%, rgba(0, 255, 255, 0.1) 100%); border: 1px solid rgba(0, 255, 255, 0.3); border-radius: 15px; padding: 25px; margin: 25px 0;">
        <h3 style="color: #ff0080; margin: 0 0 15px 0; font-size: 18px; text-align: center;">⏰ While You Wait...</h3>
        <div style="color: #ffffff; font-size: 14px; line-height: 1.6;">
          <p style="margin: 0 0 10px 0;">🎯 <strong>Explore our courses</strong> - Check out our industry-aligned programs</p>
          <p style="margin: 0 0 10px 0;">📚 <strong>Read success stories</strong> - See how our students landed dream jobs</p>
          <p style="margin: 0 0 10px 0;">💡 <strong>Join our community</strong> - Connect with 10,000+ learners</p>
          <p style="margin: 0;">📞 <strong>Need immediate help?</strong> Call us at +91 7007788926</p>
        </div>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="https://learnnect.com/courses" style="display: inline-block; background: linear-gradient(135deg, #ff0080 0%, #00ffff 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; font-size: 14px; margin: 0 10px;">
          🎓 Explore Courses
        </a>
        <a href="https://learnnect.com/success-stories" style="display: inline-block; background: rgba(0, 255, 255, 0.1); border: 2px solid #00ffff; color: #00ffff; padding: 13px 28px; text-decoration: none; border-radius: 25px; font-weight: bold; font-size: 14px; margin: 0 10px;">
          🌟 Success Stories
        </a>
      </div>
    </div>

    ${getEmailFooter()}
  `;

  return getEmailBaseTemplate(content, 'Thanks for Contacting Learnnect - We\'ve Got You Covered!');
}

// Enquiry Confirmation Email Template - Sales-focused
function getEnquiryEmailTemplate(name, courseInterest) {
  const content = `
    ${getEmailHeader()}
    
    <div class="main-content" style="background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(10px); border-radius: 20px; padding: 40px; border: 1px solid rgba(0, 255, 255, 0.2);">
      <div style="text-align: center; margin-bottom: 30px;">
        <div style="font-size: 48px; margin-bottom: 15px;">🎯</div>
        <h1 class="hero-title" style="color: #00ffff; margin: 0 0 15px 0; font-size: 26px; font-weight: 700;">
          Excellent Choice, ${name}! 🎉
        </h1>
        <p style="color: #ffffff; font-size: 16px; line-height: 1.6; margin: 0;">
          Thanks for your interest in <strong style="color: #ff0080;">${courseInterest || 'our courses'}</strong>! You're about to embark on a career-transforming journey.
        </p>
      </div>

      <!-- What Happens Next -->
      <div style="background: linear-gradient(135deg, rgba(255, 0, 128, 0.1) 0%, rgba(0, 255, 255, 0.1) 100%); border: 1px solid rgba(0, 255, 255, 0.3); border-radius: 15px; padding: 25px; margin: 25px 0;">
        <h3 style="color: #ff0080; margin: 0 0 15px 0; font-size: 18px; text-align: center;">🚀 What Happens Next?</h3>
        <div style="color: #ffffff; font-size: 14px; line-height: 1.6;">
          <p style="margin: 0 0 10px 0;">📞 <strong>Expert Consultation:</strong> Our course advisor will call you within 2-4 hours</p>
          <p style="margin: 0 0 10px 0;">💡 <strong>Personalized Roadmap:</strong> We'll discuss your career goals and create a custom learning path</p>
          <p style="margin: 0 0 10px 0;">🎯 <strong>Live Demo:</strong> See our platform in action and meet your potential mentors</p>
          <p style="margin: 0;">💰 <strong>Special Offers:</strong> Learn about current discounts and flexible payment options</p>
        </div>
      </div>

      ${getMarketingStats()}

      <div style="text-align: center; margin: 30px 0;">
        <p style="color: #a0a0a0; font-size: 14px; margin-bottom: 15px;">
          Can't wait? Call us directly and start your journey today!
        </p>
        <a href="tel:+917007788926" style="display: inline-block; background: linear-gradient(135deg, #ff0080 0%, #00ffff 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; font-size: 16px;">
          📞 Call Now: +91 7007788926
        </a>
      </div>
    </div>

    ${getEmailFooter()}
  `;

  return getEmailBaseTemplate(content, 'Your Course Enquiry - Let\'s Make It Happen!');
}

// Newsletter Confirmation Email Template
function getNewsletterEmailTemplate(name) {
  const content = `
    ${getEmailHeader()}
    
    <div class="main-content" style="background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(10px); border-radius: 20px; padding: 40px; border: 1px solid rgba(0, 255, 255, 0.2);">
      <div style="text-align: center; margin-bottom: 30px;">
        <div style="font-size: 48px; margin-bottom: 15px;">📰</div>
        <h1 class="hero-title" style="color: #00ffff; margin: 0 0 15px 0; font-size: 26px; font-weight: 700;">
          Welcome to the Inner Circle, ${name}! 🎉
        </h1>
        <p style="color: #ffffff; font-size: 16px; line-height: 1.6; margin: 0;">
          You just joined our exclusive newsletter community of <strong style="color: #ff0080;">10,000+ learning enthusiasts</strong>. Get ready for some seriously good content! 🔥
        </p>
      </div>

      <!-- What's Coming -->
      <div style="background: linear-gradient(135deg, rgba(255, 0, 128, 0.1) 0%, rgba(0, 255, 255, 0.1) 100%); border: 1px solid rgba(0, 255, 255, 0.3); border-radius: 15px; padding: 25px; margin: 25px 0;">
        <h3 style="color: #ff0080; margin: 0 0 15px 0; font-size: 18px; text-align: center;">📬 What's Coming Your Way?</h3>
        <div style="color: #ffffff; font-size: 14px; line-height: 1.6;">
          <p style="margin: 0 0 12px 0;">🚀 <strong>Latest Course Updates:</strong> Be the first to know about new courses and features</p>
          <p style="margin: 0 0 12px 0;">💡 <strong>Industry Insights:</strong> Trends, tips, and career advice from tech leaders</p>
          <p style="margin: 0 0 12px 0;">🎁 <strong>Exclusive Offers:</strong> Special discounts and early-bird pricing (subscribers only!)</p>
          <p style="margin: 0 0 12px 0;">📚 <strong>Free Resources:</strong> Guides, cheat sheets, and project templates</p>
          <p style="margin: 0;">🎯 <strong>Success Stories:</strong> Real stories from learners who landed their dream jobs</p>
        </div>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="https://learnnect.com/courses" style="display: inline-block; background: linear-gradient(135deg, #ff0080 0%, #00ffff 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; font-size: 14px;">
          🎓 Explore Our Courses
        </a>
      </div>

      <div style="background: rgba(0, 255, 255, 0.05); border: 1px solid rgba(0, 255, 255, 0.2); border-radius: 15px; padding: 20px; margin: 25px 0;">
        <h3 style="color: #00ffff; margin: 0 0 10px 0; font-size: 16px; text-align: center;">💌 Newsletter Schedule</h3>
        <p style="color: #ffffff; margin: 0; font-size: 14px; text-align: center; line-height: 1.6;">
          We send out newsletters <strong>twice a week</strong> - just enough to keep you informed without overwhelming your inbox. Quality over quantity, always! ✨
        </p>
      </div>
    </div>

    ${getEmailFooter()}
  `;

  return getEmailBaseTemplate(content, 'Welcome to Learnnect Newsletter - You\'re In!');
}

module.exports = {
  getWelcomeEmailTemplate,
  getContactEmailTemplate,
  getEnquiryEmailTemplate,
  getNewsletterEmailTemplate
};
