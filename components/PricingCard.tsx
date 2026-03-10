import Link from 'next/link'

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

export default function PricingCard({ plan }: { plan: PricingPlan }) {
  return (
    <div className="pricing-plan reveal">
      <h3>{plan.title}</h3>

      <div className="price-block">
        <span className="main-price">
          {plan.mainPrice}
          <span className="price-modifier">{plan.priceModifier}</span>
        </span>
        {plan.priceTaxInfo && (
          <span className="price-tax-info">{plan.priceTaxInfo}</span>
        )}
      </div>

      <ul>
        {plan.features.map((f, i) => (
          <li key={i}>{f}</li>
        ))}
      </ul>

      <Link href={plan.ctaHref} className="btn">
        {plan.cta}
      </Link>
    </div>
  )
}
