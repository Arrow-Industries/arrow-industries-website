import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServicePageTemplate } from "@/components/ServicePageTemplate";
import { getServiceBySlug } from "@/data/services";
import { getServiceContent } from "@/data/serviceContent";

const slug = "semi-trailers";
const content = getServiceContent(slug);

export const metadata: Metadata = {
  title: content.metaTitle,
  description: content.metaDescription,
  alternates: { canonical: `/${slug}` },
};

export default function Page() {
  const service = getServiceBySlug(slug);
  if (!service) notFound();
  return <ServicePageTemplate service={service} content={content} />;
}
