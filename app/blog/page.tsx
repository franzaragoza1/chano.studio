import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Watermark from '@/components/Watermark'
import Link from 'next/link'
import blogData from '@/data/blog.json'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog & News | Chano Studio',
  description: 'Latest news, articles and insights from Chano Studio.',
}

export default function BlogPage() {
  return (
    <>
      <Watermark />
      <Header />
      <main>
        <section id="blog-posts">
          <div className="container">
            <h2>LATEST NEWS & ARTICLES</h2>

            {blogData.map((post) => (
              <article className="blog-post-summary" key={post.slug}>
                <h3>{post.title}</h3>
                <span className="post-date">{post.date}</span>
                <p>{post.summary}</p>
                <Link href={`/blog/${post.slug}`} className="btn small-btn">
                  READ MORE
                </Link>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
