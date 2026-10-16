import type { Metadata } from "next";
import { BlogArticle, blogArticleMetadata } from "@/components/blog/blog-pages";

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  return blogArticleMetadata("bn", (await params).slug);
}

export default async function Page({ params }: PageProps<"/blog/[slug]">) {
  return <BlogArticle locale="bn" slug={(await params).slug} />;
}
