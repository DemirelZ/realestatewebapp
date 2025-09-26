import { getPropertyByIdFromDb } from "@/lib/firestore";
import type { Metadata } from "next";
import { toSlug } from "@/lib/slug";
import { redirect, notFound } from "next/navigation";
// headers import removed (not used)

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const { id } = params;
  const num = Number(id);
  const property = Number.isFinite(num)
    ? await getPropertyByIdFromDb(num)
    : null;
  const title = property
    ? `${property.title} | ${property.location} | ${property.price}`
    : "İlan Detayı";
  const description = property
    ? `${property.type} ${property.category ?? ""} - ${property.location} - ${
        property.price
      }`
    : "İlan detayı";

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";
  const canonical = `${baseUrl}/ilan/${id}`;
  const firstImage = property?.images?.[0];
  const images = firstImage ? [firstImage] : undefined;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "article",
      images,
      siteName: "Neşeli Gayrimenkul",
      locale: "tr_TR",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images,
    },
  };
}

export default async function IlanDetay({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const num = Number(id);
  if (!Number.isFinite(num)) {
    return notFound();
  }
  const property = await getPropertyByIdFromDb(num);
  if (!property) {
    return notFound();
  }

  // Redirect legacy /ilan/:id to pretty /:id-:slug
  const prettyPath = `/${num}-${toSlug(property.title)}`;
  return redirect(prettyPath);
}

// removed unused DetailRow component
