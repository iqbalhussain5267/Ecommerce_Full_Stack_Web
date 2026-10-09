import nodemailer from 'nodemailer';
import 'dotenv/config'; 


export const sendOtpMail = async ({email, otp}) => {
  
  // Extra safeguard to verify what this file sees
  console.log("🔍 send otp to :", email);

  const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  
  const recipientAddress = String(email).trim();

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: recipientAddress,              
    subject: 'verify your otp for password',
    html: `<h3>Verification Link</h3><p>
    http://localhost:5173/verify-otp/${email}</p><p>otp:
    ${otp}</p>`, 
  });

  console.log('otp sent :', recipientAddress);
};
