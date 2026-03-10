import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(req: NextRequest) {
  const { name, email, trackName, artistName, stemsLink, instructions } =
    await req.json()

  if (!name || !email || !trackName || !artistName || !stemsLink) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
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

  const body = [
    `NAME: ${name}`,
    `EMAIL: ${email}`,
    `TRACK NAME: ${trackName}`,
    `ARTIST NAME: ${artistName}`,
    `STEMS LINK: ${stemsLink}`,
    `SPECIAL INSTRUCTIONS:\n${instructions || 'NONE'}`,
  ].join('\n')

  try {
    await transporter.sendMail({
      from: `"${name}" <${process.env.EMAIL_USER}>`,
      replyTo: email,
      to: recipient,
      subject: `NEW ORDER: ${artistName} — ${trackName}`,
      text: body,
    })

    await transporter.sendMail({
      from: `"CHANO STUDIO" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Chano Studio: Order received',
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px; color: #333333;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="margin: 0; font-size: 24px; letter-spacing: 2px; color: #000;">CHANO STUDIO</h1>
            <p style="margin: 5px 0 0 0; font-size: 14px; color: #666; letter-spacing: 1px;">CREATIVE VISUALS</p>
          </div>
          
          <h2 style="font-size: 18px; color: #000; font-weight: 500;">Hello ${name},</h2>
          
          <p style="font-size: 15px; line-height: 1.6; color: #444;">
            Thank you for trusting Chano Studio. We have successfully received your order details. Our team will review the stems and get back to you shortly with the next steps.
          </p>
          
          <div style="background-color: #f9f9f9; padding: 20px; border-left: 3px solid #000; margin: 25px 0;">
            <p style="margin: 0 0 10px 0; font-size: 13px; color: #666; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">Order Summary</p>
            <p style="margin: 0 0 5px 0; font-size: 14px;"><strong>Artist:</strong> ${artistName}</p>
            <p style="margin: 0 0 5px 0; font-size: 14px;"><strong>Track:</strong> ${trackName}</p>
            <p style="margin: 0 0 5px 0; font-size: 14px;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 0 0 15px 0; font-size: 14px;"><strong>Stems Link:</strong> <a href="${stemsLink}" style="color: #000; text-decoration: underline;">View Files</a></p>
            <p style="margin: 0; font-size: 14px; font-style: italic; color: #555;"><strong>Special Instructions:</strong><br>${instructions || 'None provided'}</p>
          </div>
          
          <p style="font-size: 15px; line-height: 1.6; color: #444;">
            Best regards,<br>
            <strong>The Chano Studio Team</strong>
          </p>
          
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eaeaea; text-align: center; font-size: 12px; color: #888;">
            <p style="margin: 0;">&copy; ${new Date().getFullYear()} Chano Studio. All rights reserved.</p>
            <p style="margin: 5px 0 0 0;">This is an automated confirmation email. Please do not reply directly to this message.</p>
          </div>
        </div>
      `,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Order mail error:', err)
    return NextResponse.json({ error: 'Mail failed' }, { status: 500 })
  }
}
