// ═══════════════════════════════════════════════════════════════
// BUBBLE GUM - OPTIMIZED NEXT.JS CONFIGURATION
// ═══════════════════════════════════════════════════════════════
// Version: 1.0.0
// Last Updated: November 2, 2025
// Goal: Maximum Performance & Optimization
// ═══════════════════════════════════════════════════════════════

/** @type {import('next').NextConfig} */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// BUNDLE ANALYZER (Optional)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: true,
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PWA SUPPORT (Optional)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts',
        expiration: {
          maxEntries: 4,
          maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
        },
      },
    },
    {
      urlPattern: /^https:\/\/.*\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'images',
        expiration: {
          maxEntries: 64,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
      },
    },
    {
      urlPattern: /^https:\/\/api\.bubblegum\.app\/.*$/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api',
        networkTimeoutSeconds: 10,
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 5 * 60, // 5 minutes
        },
      },
    },
  ],
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MAIN CONFIGURATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const nextConfig = {
  // ┌─────────────────────────────────────────────────────────────┐
  // │ PERFORMANCE OPTIMIZATIONS                                   │
  // └─────────────────────────────────────────────────────────────┘

  // Enable SWC Minification (faster than Terser)
  swcMinify: true,

  // Enable React Strict Mode for better development experience
  reactStrictMode: true,

  // Production browser targets (reduces polyfills)
  productionBrowserSourceMaps: false,

  // Disable x-powered-by header
  poweredByHeader: false,

  // Enable compression
  compress: true,

  // ┌─────────────────────────────────────────────────────────────┐
  // │ IMAGE OPTIMIZATION                                          │
  // └─────────────────────────────────────────────────────────────┘
  images: {
    // Image formats (AVIF first, then WebP fallback)
    formats: ['image/avif', 'image/webp'],

    // Device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],

    // Image sizes for different layouts
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

    // Domains allowed for image optimization
    domains: [
      'bubblegum.app',
      's3.amazonaws.com',
      'images.unsplash.com',
      'avatars.githubusercontent.com',
    ],

    // Remote patterns for image optimization
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.bubblegum.app',
      },
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
    ],

    // Minimize image size
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year

    // Disable static image imports if not needed
    disableStaticImages: false,

    // Dangerous allow SVG (be careful)
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // ┌─────────────────────────────────────────────────────────────┐
  // │ WEBPACK OPTIMIZATION                                        │
  // └─────────────────────────────────────────────────────────────┘
  webpack: (config, { dev, isServer }) => {
    // Production optimizations
    if (!dev) {
      // Minimize bundle size
      config.optimization = {
        ...config.optimization,
        minimize: true,
        usedExports: true, // Tree shaking
        sideEffects: true,
        
        // Split chunks for better caching
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            
            // Vendor chunk (node_modules)
            vendor: {
              name: 'vendor',
              chunks: 'all',
              test: /node_modules/,
              priority: 20,
            },
            
            // Common chunk (shared between pages)
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              priority: 10,
              reuseExistingChunk: true,
              enforce: true,
            },
            
            // Framework chunk (React, Next.js core)
            framework: {
              name: 'framework',
              test: /[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
              priority: 40,
              enforce: true,
            },
            
            // Lib chunk (large libraries)
            lib: {
              test: /[\\/]node_modules[\\/]/,
              name(module) {
                const packageName = module.context.match(
                  /[\\/]node_modules[\\/](.*?)([\\/]|$)/
                )?.[1];
                return `lib.${packageName?.replace('@', '')}`;
              },
              priority: 30,
            },
          },
        },
      };
    }

    // Ignore source maps in production
    if (!dev) {
      config.devtool = false;
    }

    // Improve build performance
    config.infrastructureLogging = {
      level: 'error',
    };

    // Add custom loaders/plugins here if needed

    return config;
  },

  // ┌─────────────────────────────────────────────────────────────┐
  // │ COMPILER OPTIONS                                            │
  // └─────────────────────────────────────────────────────────────┘
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,

    // Enable React Compiler (experimental)
    reactCompiler: true,

    // Styled-components support
    styledComponents: false,

    // Emotion support
    emotion: false,
  },

  // ┌─────────────────────────────────────────────────────────────┐
  // │ EXPERIMENTAL FEATURES                                       │
  // └─────────────────────────────────────────────────────────────┘
  experimental: {
    // Enable optimized package imports
    optimizePackageImports: [
      'lucide-react',
      'date-fns',
      'lodash-es',
      '@radix-ui/react-icons',
    ],

    // Use optimized fonts
    optimizeCss: true,

    // Enable Turbopack (faster than Webpack)
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },

    // Server Actions
    serverActions: {
      bodySizeLimit: '2mb',
      allowedOrigins: ['bubblegum.app', '*.bubblegum.app'],
    },

    // Partial Prerendering (PPR)
    ppr: true,

    // React Server Components
    serverComponentsExternalPackages: [
      '@prisma/client',
      'bcrypt',
      'sharp',
    ],

    // Optimize font loading
    optimizeFonts: true,

    // Enable concurrent features
    concurrentFeatures: true,
  },

  // ┌─────────────────────────────────────────────────────────────┐
  // │ REDIRECTS & REWRITES                                        │
  // └─────────────────────────────────────────────────────────────┘
  async redirects() {
    return [
      // Redirect www to non-www
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.bubblegum.app',
          },
        ],
        destination: 'https://bubblegum.app/:path*',
        permanent: true,
      },
      // Redirect old URLs
      {
        source: '/old-dashboard',
        destination: '/dashboard',
        permanent: true,
      },
    ];
  },

  async rewrites() {
    return [
      // API rewrite
      {
        source: '/api/v1/:path*',
        destination: 'https://api.bubblegum.app/:path*',
      },
    ];
  },

  // ┌─────────────────────────────────────────────────────────────┐
  // │ HEADERS (Security & Performance)                            │
  // └─────────────────────────────────────────────────────────────┘
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Security Headers
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
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
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      // Cache static assets
      {
        source: '/assets/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Cache images
      {
        source: '/:path*.{jpg,jpeg,png,gif,svg,ico,webp,avif}',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Cache fonts
      {
        source: '/:path*.{woff,woff2,ttf,otf,eot}',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // ┌─────────────────────────────────────────────────────────────┐
  // │ OUTPUT CONFIGURATION                                        │
  // └─────────────────────────────────────────────────────────────┘
  
  // Output as standalone for Docker
  output: process.env.BUILD_STANDALONE === 'true' ? 'standalone' : undefined,

  // Generate build ID
  generateBuildId: async () => {
    // Use git commit hash or timestamp
    return process.env.GIT_COMMIT_SHA || `build-${Date.now()}`;
  },

  // ┌─────────────────────────────────────────────────────────────┐
  // │ TYPESCRIPT                                                  │
  // └─────────────────────────────────────────────────────────────┘
  typescript: {
    // Ignore TypeScript errors during build (not recommended)
    ignoreBuildErrors: false,
  },

  // ┌─────────────────────────────────────────────────────────────┐
  // │ ESLINT                                                      │
  // └─────────────────────────────────────────────────────────────┘
  eslint: {
    // Ignore ESLint errors during build (not recommended)
    ignoreDuringBuilds: false,
    
    // Directories to lint
    dirs: ['src', 'app', 'components', 'lib', 'pages'],
  },

  // ┌─────────────────────────────────────────────────────────────┐
  // │ I18N (Internationalization)                                 │
  // └─────────────────────────────────────────────────────────────┘
  i18n: {
    locales: ['en', 'es', 'fr', 'de'],
    defaultLocale: 'en',
    localeDetection: true,
  },

  // ┌─────────────────────────────────────────────────────────────┐
  // │ ENVIRONMENT VARIABLES                                       │
  // └─────────────────────────────────────────────────────────────┘
  env: {
    // Public env vars
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV || 'production',
  },

  // ┌─────────────────────────────────────────────────────────────┐
  // │ SERVER OPTIONS                                              │
  // └─────────────────────────────────────────────────────────────┘
  
  // Only build what's needed
  onDemandEntries: {
    // Period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // Number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },

  // ┌─────────────────────────────────────────────────────────────┐
  // │ LOGGING                                                     │
  // └─────────────────────────────────────────────────────────────┘
  
  // Reduce logging in production
  logging: {
    fetches: {
      fullUrl: process.env.NODE_ENV === 'development',
    },
  },
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EXPORT WITH PLUGINS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
module.exports = withBundleAnalyzer(withPWA(nextConfig));

// Alternative: Without PWA
// module.exports = withBundleAnalyzer(nextConfig);

// ═══════════════════════════════════════════════════════════════
// PERFORMANCE TIPS
// ═══════════════════════════════════════════════════════════════
//
// 1. Use Static Generation whenever possible
// 2. Implement ISR for dynamic content
// 3. Use Image component for all images
// 4. Enable compression (gzip/brotli)
// 5. Use CDN for static assets
// 6. Implement proper caching strategies
// 7. Optimize bundle size
// 8. Use code splitting and lazy loading
// 9. Monitor Core Web Vitals
// 10. Regular performance audits
//
// ═══════════════════════════════════════════════════════════════
// USEFUL COMMANDS
// ═══════════════════════════════════════════════════════════════
//
// Analyze bundle:
//   ANALYZE=true npm run build
//
// Build standalone (Docker):
//   BUILD_STANDALONE=true npm run build
//
// Generate build ID:
//   GIT_COMMIT_SHA=$(git rev-parse HEAD) npm run build
//
// ═══════════════════════════════════════════════════════════════
