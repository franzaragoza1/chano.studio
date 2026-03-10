import Link from 'next/link'

const socialLinks = [
  { label: 'INSTAGRAM', href: 'https://www.instagram.com/chano.studio/', external: true },
  { label: 'SOUNDCLOUD', href: 'https://www.soundcloud.com/chano.studio/', external: true },
  { label: 'THREADS',   href: 'https://www.threads.com/chano.studio/', external: true },
  { label: 'MAIL',      href: 'mailto:info@chano.studio', external: false },
  { label: 'BLOG',      href: '/blog', external: false },
]

export default function Footer() {
  return (
    <footer>
      <div className="container">
        <p className="footer-copy">© 2026 CHANO STUDIO. ALL RIGHTS RESERVED.</p>
        <ul className="footer-links">
          {socialLinks.map((link) => (
            <li key={link.label}>
              {link.external ? (
                <a href={link.href} target="_blank" rel="noopener noreferrer">
                  {link.label}
                </a>
              ) : (
                <Link href={link.href}>{link.label}</Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}
