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
      subject: 'CHANO STUDIO: ORDER RECEIVED',
      text: `HELLO ${name.toUpperCase()},\n\nYOUR ORDER HAS BEEN RECEIVED. WE WILL REVIEW IT AND GET BACK TO YOU SHORTLY.\n\n${body}\n\nBEST REGARDS,\nCHANO STUDIO`,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Order mail error:', err)
    return NextResponse.json({ error: 'Mail failed' }, { status: 500 })
  }
}
