import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Wyłączamy "X-Powered-By: Next.js" (ukrywanie technologii)
  poweredByHeader: false,
  
  // Enable response compression (gzip/brotli)
  compress: true,
  
  images: {
    formats: ['image/avif', 'image/webp'],
  },

  experimental: {
    // Tree-shake heavy dependencies — only import used exports
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },

  // Definiujemy pancerne nagłówki HTTP
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
          }
        ],
      },
    ];
  },
};

export default nextConfig;