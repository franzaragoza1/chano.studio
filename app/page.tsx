import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Works from '@/components/Works'
import Pricing from '@/components/Pricing'
import About from '@/components/About'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import Watermark from '@/components/Watermark'
import ScrollRevealInit from '@/components/ScrollRevealInit'

import portfolioData from '@/data/portfolio.json'
import pricingData from '@/data/pricing.json'

export default function Home() {
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
