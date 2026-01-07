
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

export const sendEmailNotification = async (to: string, subject: string, text: string) => {
  try {
    await transporter.sendMail({ from: '"Scholarship Portal" <no-reply@portal.com>', to, subject, text });
  } catch (error) {
    console.error("Email failed:", error);
  }
};