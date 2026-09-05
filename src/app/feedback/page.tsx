import type { Metadata } from "next";
import { getSiteContent } from "@/lib/site-config";
import { FeedbackForm } from "@/components/feedback-form";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  return { title: `${content.navLabels.feedback} — ${content.name}` };
}

export default async function FeedbackPage() {
  const content = await getSiteContent();
  return <FeedbackForm title={content.navLabels.feedback} />;
}
