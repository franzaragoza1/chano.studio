'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import ThemeToggle from './ThemeToggle'

const navLinks = [
  { label: 'HOME',    href: '/#home'    },
  { label: 'WORKS',   href: '/#works'   },
  { label: 'PRICING', href: '/#pricing' },
  { label: 'ABOUT',   href: '/#about'   },
  { label: 'BLOG',    href: '/blog'     },
  { label: 'CONTACT', href: '/#contact' },
]

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header>
      <div className="container">
        <div className="logo">
          <Link href="/#home">
            <Image
              src="/img/logotipo_chano2.png"
              alt="Chano Studio Logo"
              width={120}
              height={36}
              priority
              style={{ height: '36px', width: 'auto' }}
            />
          </Link>
        </div>

        <nav>
          <ul className={open ? 'open' : ''}>
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link href={link.href} onClick={() => setOpen(false)}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <ThemeToggle />

        <button
          className="hamburger"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  )
}
