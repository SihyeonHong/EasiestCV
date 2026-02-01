import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["storage.googleapis.com", "picsum.photos"],
  },
  experimental: {
    serverComponentsExternalPackages: ["isomorphic-dompurify"],
  },
};

export default withNextIntl(nextConfig);
