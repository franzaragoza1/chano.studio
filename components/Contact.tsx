'use client'

import { useState, FormEvent } from 'react'

export default function Contact() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')

    const form = e.currentTarget
    const data = {
      name:    (form.elements.namedItem('name')    as HTMLInputElement).value,
      email:   (form.elements.namedItem('email')   as HTMLInputElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
    }

    const res = await fetch('/api/contact', {
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

  return (
    <section id="contact">
      <div className="container">
        <h2 className="reveal">CONTACT</h2>

        <form className="contact-form reveal reveal-delay-1" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">NAME:</label>
            <input type="text" id="name" name="name" required />
          </div>

          <div className="form-group">
            <label htmlFor="email">EMAIL:</label>
            <input type="email" id="email" name="email" required />
          </div>

          <div className="form-group">
            <label htmlFor="message">MESSAGE:</label>
            <textarea id="message" name="message" required />
          </div>

          {status === 'success' && (
            <p className="form-status success">
              THANKS! WE WILL GET BACK TO YOU SHORTLY.
            </p>
          )}
          {status === 'error' && (
            <p className="form-status error">
              SOMETHING WENT WRONG. PLEASE TRY AGAIN OR EMAIL US DIRECTLY AT
              INFO@CHANO.STUDIO.
            </p>
          )}

          <button
            type="submit"
            className="btn"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'SENDING...' : 'SEND MESSAGE'}
          </button>
        </form>
      </div>
    </section>
  )
}
