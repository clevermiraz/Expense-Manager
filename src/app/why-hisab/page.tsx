import type { Metadata } from "next";
import { WhyPage, whyMetadata } from "@/components/why-page";

export function generateMetadata(): Metadata {
  return whyMetadata("bn");
}

export default function Page() {
  return <WhyPage locale="bn" />;
}
