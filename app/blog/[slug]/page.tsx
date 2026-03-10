import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Watermark from '@/components/Watermark'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import blogData from '@/data/blog.json'
import type { Metadata } from 'next'

interface Props {
  params: { slug: string }
}

export function generateStaticParams() {
  return blogData.map((post) => ({ slug: post.slug }))
}

export function generateMetadata({ params }: Props): Metadata {
  const post = blogData.find((p) => p.slug === params.slug)
  if (!post) return {}
  return {
    title: `${post.title} | Chano Studio`,
    description: post.summary,
  }
}

export default function BlogPostPage({ params }: Props) {
  const post = blogData.find((p) => p.slug === params.slug)
  if (!post) notFound()

  return (
    <>
      <Watermark />
      <Header />
      <main>
        <section id="single-blog-post">
          <div className="container">
            <h2>{post.title}</h2>
            <span className="post-date">{post.date}</span>
            {post.content.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
            <p>
              <Link href="/blog" className="btn small-btn">
                ← BACK TO BLOG
              </Link>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
