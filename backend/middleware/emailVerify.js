import nodemailer from 'nodemailer';
import 'dotenv/config'; 

// Make sure the parameters are wrapped in curly braces { email, token }
export const verifyEmail = async ({ email, token }) => {
  
  // Extra safeguard to verify what this file sees
  console.log("🔍 Inside verifyEmail function. Sending to:", email);

  const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  // Explicitly force the string conversion to prevent internal Nodemailer undefined issues
  const recipientAddress = String(email).trim();

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: recipientAddress,               // Fixed to ensure it is a clean string
    subject: 'Email Verification',
    html: `<h3>Verification Link</h3><p>
    http://localhost:5173/verify/${token}</p><p>Token:
    ${token}</p>`,  // Added token display for clarity
  });

  console.log('✅ Verification email sent successfully to:', recipientAddress);
};
