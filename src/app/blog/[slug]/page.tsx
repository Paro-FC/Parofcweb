import { notFound } from "next/navigation"
import { sanityFetch } from "@/sanity/lib/live"
import { BLOG_ARTICLE_QUERY, RELATED_BLOG_QUERY } from "@/sanity/lib/queries"
import { BlogArticle } from "@/components/BlogArticle"

interface Props {
  params: Promise<{ slug: string }>
}

interface Article {
  _id: string
  title: string
  slug: string
  image: unknown
  badge: string
  publishedAt: string
  description: string
  body?: unknown[]
  author?: string
  readTime?: number
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params

  const [articleResult, relatedResult] = await Promise.all([
    sanityFetch({ query: BLOG_ARTICLE_QUERY, params: { slug } }).catch(() => ({ data: null })),
    sanityFetch({ query: RELATED_BLOG_QUERY, params: { slug } }).catch(() => ({ data: [] })),
  ])

  const article = articleResult.data as Article | null

  if (!article) {
    notFound()
  }

  return (
    <BlogArticle
      article={article}
      relatedPosts={(relatedResult.data as any[]) || []}
    />
  )
}
