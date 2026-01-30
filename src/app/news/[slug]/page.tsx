import { notFound } from "next/navigation"
import { sanityFetch } from "@/sanity/lib/live"
import { NEWS_ARTICLE_QUERY, RELATED_NEWS_QUERY } from "@/sanity/lib/queries"
import { NewsArticle } from "@/components/NewsArticle"

interface Props {
  params: Promise<{ slug: string }>
}

export default async function NewsPage({ params }: Props) {
  const { slug } = await params
  
  const [articleResult, relatedResult] = await Promise.all([
    sanityFetch({ query: NEWS_ARTICLE_QUERY, params: { slug } }).catch(() => ({ data: null })),
    sanityFetch({ query: RELATED_NEWS_QUERY, params: { slug } }).catch(() => ({ data: [] })),
  ])

  if (!articleResult.data) {
    notFound()
  }

  return (
    <NewsArticle 
      article={articleResult.data} 
      relatedNews={relatedResult.data || []} 
    />
  )
}

