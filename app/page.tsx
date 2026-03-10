import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Works from '@/components/Works'
import Pricing from '@/components/Pricing'
import About from '@/components/About'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import Watermark from '@/components/Watermark'
import ScrollRevealInit from '@/components/ScrollRevealInit'

import { headers } from 'next/headers'
import pricingData from '@/data/pricing.json'
import defaultPortfolio from '@/data/portfolio.json'

async function getPortfolioData() {
  try {
    const host = headers().get('host') || 'localhost:3000'
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'
    
    // Configured for dynamic fetching (no cache) to show admin edits immediately
    const res = await fetch(`${protocol}://${host}/api/works`, { cache: 'no-store' })
    if (!res.ok) return defaultPortfolio
    return res.json()
  } catch (error) {
    console.warn("Failed to fetch dynamic works, using local JSON", error)
    return defaultPortfolio
  }
}

export default async function Home() {
  const portfolioData = await getPortfolioData()

  return (
    <>
      <Watermark />
      <ScrollRevealInit />
      <Header />
      <main>
        <Hero />
        <Works items={portfolioData} />
        <Pricing plans={pricingData} />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
