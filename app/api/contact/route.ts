import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(req: NextRequest) {
  const { name, email, message } = await req.json()

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })

  const recipient = process.env.EMAIL_TO || 'info@chano.studio'

  try {
    // Email to studio
    await transporter.sendMail({
      from: `"${name}" <${process.env.EMAIL_USER}>`,
      replyTo: email,
      to: recipient,
      subject: `NEW CONTACT FORM: ${name}`,
      text: `NAME: ${name}\nEMAIL: ${email}\nMESSAGE:\n${message}`,
    })

    // Confirmation to client
    await transporter.sendMail({
      from: `"CHANO STUDIO" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'CHANO STUDIO: FORM RECEIVED',
      text: `HELLO ${name.toUpperCase()},\n\nTHANKS FOR GETTING IN TOUCH. WE WILL GET BACK TO YOU SHORTLY.\n\nNAME: ${name}\nEMAIL: ${email}\nMESSAGE:\n${message}\n\nBEST REGARDS,\nCHANO STUDIO`,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Contact mail error:', err)
    return NextResponse.json({ error: 'Mail failed' }, { status: 500 })
  }
}
