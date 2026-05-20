import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { sanityFetch } from "@/sanity/lib/live"
import { NEWS_ARTICLE_QUERY, RELATED_NEWS_QUERY } from "@/sanity/lib/queries"
import { NewsArticle } from "@/components/NewsArticle"
import { urlFor } from "@/sanity/lib/image"

interface Props {
  params: Promise<{ slug: string }>
}

interface Article {
  _id: string
  title: string
  slug: string
  image: unknown
  publishedAt: string
  description: string
  externalUrl?: string
  body?: unknown[]
  author?: string
  readTime?: number
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const result = await sanityFetch({ query: NEWS_ARTICLE_QUERY, params: { slug } }).catch(() => ({ data: null }))
  const article = result.data as Article | null

  if (!article) return {}

  const ogImage = article.image ? urlFor(article.image).width(1200).height(630).url() : undefined

  return {
    title: article.title,
    description: article.description,
    openGraph: {
      type: "article",
      title: article.title,
      description: article.description,
      url: `https://parofc.com/news/${article.slug}`,
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630, alt: article.title }] : [],
      publishedTime: article.publishedAt,
      authors: article.author ? [article.author] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
      images: ogImage ? [ogImage] : [],
    },
  }
}

export default async function NewsPage({ params }: Props) {
  const { slug } = await params
  
  const [articleResult, relatedResult] = await Promise.all([
    sanityFetch({ query: NEWS_ARTICLE_QUERY, params: { slug } }).catch(() => ({ data: null })),
    sanityFetch({ query: RELATED_NEWS_QUERY, params: { slug } }).catch(() => ({ data: [] })),
  ])

  const article = articleResult.data as Article | null

  if (!article) {
    notFound()
  }

  return (
    <NewsArticle 
      article={article} 
      relatedNews={(relatedResult.data as any[]) || []} 
    />
  )
}

