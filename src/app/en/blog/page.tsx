import type { Metadata } from "next";
import { BlogIndex, blogIndexMetadata } from "@/components/blog/blog-pages";

export function generateMetadata(): Promise<Metadata> {
  return blogIndexMetadata("en");
}

export default function Page() {
  return <BlogIndex locale="en" />;
}
