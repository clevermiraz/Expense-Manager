import type { Metadata } from "next";
import { BlogArticle, blogArticleMetadata } from "@/components/blog/blog-pages";

export async function generateMetadata({ params }: PageProps<"/en/blog/[slug]">): Promise<Metadata> {
  return blogArticleMetadata("en", (await params).slug);
}

export default async function Page({ params }: PageProps<"/en/blog/[slug]">) {
  return <BlogArticle locale="en" slug={(await params).slug} />;
}
