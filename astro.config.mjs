import { defineConfig } from "astro/config";
import { remarkModifiedTime } from "./src/utils/remark-modified-time.mjs";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import partytown from "@astrojs/partytown";
import pagefind from "astro-pagefind";
import icon from "astro-icon";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://astrology-monolingual.vercel.app",
  trailingSlash: "always",
  vite: {
    plugins: [tailwindcss()],
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "viewport",
  },

  // Disable remote image optimization during build to avoid network
  // requests when processing Markdown files. Remote images will be
  // used as-is without size inference.

  markdown: {
    remarkPlugins: [remarkModifiedTime],
  },

  integrations: [
    mdx(),
    sitemap(),
    pagefind(),
    partytown({
      config: {
        forward: ["dataLayer.push"],
        debug: false,
      },
    }),

    icon({
      include: {
        tabler: ["*"],
      },
    }),
  ],
});
