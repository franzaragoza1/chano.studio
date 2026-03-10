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

export default function PortfolioCard({ item }: { item: PortfolioItem }) {
  const iframeHeight = item.embedType === 'bandcamp' ? '120' : '152'
  const iframeStyle =
    item.embedType === 'bandcamp'
      ? { border: 0, width: '100%', height: '120px' }
      : { borderRadius: '4px', width: '100%', height: '152px' }

  return (
    <div className="portfolio-card reveal">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={item.image} alt={item.alt} loading="lazy" />
      <div className="portfolio-info">
        <h3>{item.title}</h3>
        <p className="p-label">{item.label}</p>
        <p className="p-service">{item.service}</p>
      </div>
      <iframe
        src={item.embedSrc}
        style={iframeStyle}
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        title={item.title}
        height={iframeHeight}
        seamless={item.embedType === 'bandcamp'}
      />
    </div>
  )
}
