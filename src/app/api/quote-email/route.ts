import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(req: NextRequest) {
  const { email, pdfData } = await req.json();

  if (!email || !pdfData) {
    return NextResponse.json({ error: 'Email and PDF data are required' }, { status: 400 });
  }

  const pdfBuffer = Buffer.from(pdfData.split('base64,')[1], 'base64');

  const mailOptions = {
    from: `"Infinitech Advertising Corporation" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your Quotation PDF',
    text: 'Good Day, Please find your customized quotation attached.',
    attachments: [
      {
        filename: 'quotation.pdf',
        content: pdfBuffer,
        encoding: 'base64',
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
