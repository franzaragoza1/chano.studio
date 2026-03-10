'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'

export default function OrderForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')

    const form = e.currentTarget
    const getValue = (name: string) =>
      (form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement)?.value ?? ''

    const data = {
      name:         getValue('name'),
      email:        getValue('email'),
      trackName:    getValue('track-name'),
      artistName:   getValue('artist-name'),
      stemsLink:    getValue('stems-link'),
      instructions: getValue('instructions'),
    }

    const res = await fetch('/api/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (res.ok) {
      setStatus('success')
      form.reset()
    } else {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="contact-form">
        <p className="form-status success" style={{ fontSize: '0.9em', lineHeight: 1.8 }}>
          ORDER RECEIVED. WE WILL REVIEW YOUR FILES AND GET BACK TO YOU SHORTLY.
          <br /><br />
          <Link href="/" className="btn small-btn">← BACK TO HOME</Link>
        </p>
      </div>
    )
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">YOUR NAME:</label>
        <input type="text" id="name" name="name" required />
      </div>

      <div className="form-group">
        <label htmlFor="email">YOUR EMAIL:</label>
        <input type="email" id="email" name="email" required />
      </div>

      <div className="form-group">
        <label htmlFor="track-name">TRACK NAME:</label>
        <input type="text" id="track-name" name="track-name" required />
      </div>

      <div className="form-group">
        <label htmlFor="artist-name">ARTIST NAME:</label>
        <input type="text" id="artist-name" name="artist-name" required />
      </div>

      <div className="form-group">
        <label htmlFor="stems-link">SHARE YOUR TRACK/STEMS IN A UNIQUE LINK:</label>
        <input
          type="text"
          id="stems-link"
          name="stems-link"
          placeholder="E.G., DROPBOX, GOOGLE DRIVE, MEGA LINK"
          required
        />
        <p className="form-help-text">
          <strong>IMPORTANT NOTES ABOUT THE FILES:</strong>
        </p>
        <ul className="form-help-list">
          <li>PLEASE PROVIDE A LINK WITH YOUR FILES (DROPBOX, GOOGLE DRIVE, MEGA, ETC.).</li>
          <li>ENSURE THE LINK IS PUBLICLY ACCESSIBLE OR GRANTS NECESSARY PERMISSIONS.</li>
          <li>
            <strong>BOUNCING TRACKS OR STEMS:</strong>
            <ul className="sub-list">
              <li>IDEAL FORMAT → WAV/AIFF | SAMPLERATE: 44.1KHz | BITRATE: 24BITS</li>
              <li>PLEASE NAME THE FILES: ARTIST_TRACK_SAMPLERATE_BITRATE<br />[Ex: FRANKYDRAMA_DENIAL_44100_24]</li>
            </ul>
          </li>
        </ul>
      </div>

      <div className="form-group">
        <label htmlFor="instructions">SPECIAL INSTRUCTIONS:</label>
        <textarea id="instructions" name="instructions" />
        <p className="form-help-text">
          ANY GUIDE FOR THE WORK. YOU CAN ALSO REFERENCE ARTISTS/TRACKS AS EXAMPLE OF THE
          SOUND YOU WANT FOR YOUR TRACKS.
        </p>
      </div>

      <p className="privacy-text">
        BY PRESSING &ldquo;SUBMIT ORDER&rdquo; YOU AGREE TO THE{' '}
        <Link href="/privacy-policy" className="privacy-link">
          PRIVACY POLICY
        </Link>{' '}
        OF THIS SITE.
      </p>

      {status === 'error' && (
        <p className="form-status error" style={{ marginBottom: '16px' }}>
          SOMETHING WENT WRONG. PLEASE TRY AGAIN OR EMAIL US AT INFO@CHANO.STUDIO.
        </p>
      )}

      <button type="submit" className="btn" disabled={status === 'loading'}>
        {status === 'loading' ? 'SENDING...' : 'SUBMIT ORDER'}
      </button>
    </form>
  )
}
