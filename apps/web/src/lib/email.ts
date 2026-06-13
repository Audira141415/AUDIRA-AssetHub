import nodemailer from 'nodemailer';

// Helper function to get or create a test account for local development
async function getTransporter() {
  // If you have real SMTP credentials in .env, it will use them:
  // SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // Fallback for local development: Create an Ethereal test account on the fly
  console.log("No SMTP credentials found in .env. Falling back to Ethereal Email for testing...");
  const testAccount = await nodemailer.createTestAccount();
  
  return nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
}

export async function sendEmail({ to, subject, html }: { to: string, subject: string, html: string }) {
  try {
    const transporter = await getTransporter();
    
    const info = await transporter.sendMail({
      from: '"Audira AssetHub" <no-reply@audira.local>',
      to,
      subject,
      html,
    });

    console.log("Message sent: %s", info.messageId);
    
    // Preview only available when sending through an Ethereal account
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log("Preview URL: %s", previewUrl);
    }
    
    return { success: true, messageId: info.messageId, previewUrl };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { success: false, error };
  }
}
