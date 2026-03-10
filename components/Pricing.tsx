import PricingCard from './PricingCard'

interface PricingPlan {
  id: number
  title: string
  mainPrice: string
  priceModifier: string
  priceTaxInfo: string
  features: string[]
  cta: string
  ctaHref: string
}

export default function Pricing({ plans }: { plans: PricingPlan[] }) {
  return (
    <section id="pricing">
      <div className="container">
        <h2 className="reveal">PRICING</h2>
        <div className="pricing-grid">
          {plans.map((plan) => (
            <PricingCard key={plan.id} plan={plan} />
          ))}
        </div>
      </div>
    </section>
  )
}
