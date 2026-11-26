import type { MetadataRoute } from "next";
import { isGithubPages, pagesSiteUrl } from "@/lib/hosting";
import { EXAMPLES } from "@/lib/roast";
import { resultPath } from "@/lib/site";

export const dynamic = "force-static";

const VERCEL_URL = "https://pitch-roast.vercel.app";
const SITE_URL = isGithubPages ? pagesSiteUrl(VERCEL_URL) : VERCEL_URL;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  if (isGithubPages) {
    return [
      { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
      { url: `${SITE_URL}/how-it-works/`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
      { url: `${SITE_URL}/legal/disclaimer/`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    ];
  }
  return [
    { url: `${SITE_URL}`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/how-it-works`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/legal/disclaimer`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    ...EXAMPLES.map((e) => ({ url: `${SITE_URL}${resultPath(e.pitch, e.stage, e.category)}`.replace(/&/g, "&amp;"), lastModified: now, changeFrequency: "yearly" as const, priority: 0.4 })),
  ];
}
