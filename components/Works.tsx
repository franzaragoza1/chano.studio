import PortfolioCard from './PortfolioCard'

interface PortfolioItem {
  id: number
  title: string
  label: string
  service: string
  image: string
  alt: string
  embedType: string
  embedSrc: string
}

export default function Works({ items }: { items: PortfolioItem[] }) {
  return (
    <section id="works">
      <div className="container">
        <h2 className="reveal">WORKS</h2>
        <div className="portfolio-grid">
          {items.map((item) => (
            <PortfolioCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  )
}
