# 🖼️ IMAGE OPTIMIZATION - BUBBLE GUM

**Version:** 1.0.0  
**Last Updated:** November 2, 2025  
**Goal:** Fast Image Loading, Optimal Quality

---

## 📋 TABLE OF CONTENTS

1. [Image Optimization Overview](#image-optimization-overview)
2. [Next.js Image Component](#nextjs-image-component)
3. [Image Formats](#image-formats)
4. [Responsive Images](#responsive-images)
5. [Image CDN Configuration](#image-cdn-configuration)
6. [Blur Placeholders](#blur-placeholders)
7. [Lazy Loading](#lazy-loading)
8. [Image Compression](#image-compression)
9. [S3/CloudFront Setup](#s3cloudfront-setup)
10. [Best Practices](#best-practices)

---

## 🎯 IMAGE OPTIMIZATION OVERVIEW

### Goals

| Metric | Target |
|--------|--------|
| LCP (Hero Image) | <2.5s |
| Image File Size | <200 KB |
| Format | AVIF/WebP |
| Responsive | 5+ sizes |
| Lazy Loading | Below fold |
| Compression | 80-90% quality |

### Image Performance Budget

| Image Type | Max Size | Format |
|------------|----------|--------|
| Hero | 300 KB | AVIF/WebP |
| Thumbnails | 50 KB | AVIF/WebP |
| Icons | 10 KB | SVG |
| Avatars | 30 KB | AVIF/WebP |
| Product Images | 150 KB | AVIF/WebP |

---

## 📸 NEXT.JS IMAGE COMPONENT

### Basic Usage

```typescript
import Image from 'next/image';

export function Hero() {
  return (
    <Image
      src="/hero.jpg"
      alt="Hero image"
      width={1920}
      height={1080}
      priority // Load immediately for LCP
      quality={90}
    />
  );
}
```

### Fill Container

```typescript
export function Banner() {
  return (
    <div className="relative w-full h-96">
      <Image
        src="/banner.jpg"
        alt="Banner"
        fill
        className="object-cover"
        sizes="100vw"
      />
    </div>
  );
}
```

### Remote Images

```typescript
// next.config.js
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's3.amazonaws.com',
        pathname: '/your-bucket/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

// Component
<Image
  src="https://s3.amazonaws.com/your-bucket/image.jpg"
  alt="Remote image"
  width={800}
  height={600}
/>
```

### Priority Images (LCP)

```typescript
// Hero image - loads immediately
<Image
  src="/hero.jpg"
  alt="Hero"
  width={1920}
  height={1080}
  priority // CRITICAL for LCP
  quality={90}
/>

// Only use priority for 1-2 images per page
```

### Placeholder Blur

```typescript
<Image
  src="/product.jpg"
  alt="Product"
  width={800}
  height={600}
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRg..."
/>
```

---

## 🎨 IMAGE FORMATS

### Format Comparison

| Format | Size | Quality | Browser Support |
|--------|------|---------|-----------------|
| JPEG | 100% | Good | 100% |
| PNG | 120% | Excellent | 100% |
| WebP | 30% | Excellent | 97% |
| AVIF | 20% | Excellent | 90% |

### Next.js Format Configuration

```typescript
// next.config.js
module.exports = {
  images: {
    // Serve AVIF first, then WebP, then original
    formats: ['image/avif', 'image/webp'],
    
    // Device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    
    // Image sizes for different layouts
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};
```

### Manual Format Conversion

```typescript
// lib/image-convert.ts
import sharp from 'sharp';

export async function convertToAVIF(
  input: Buffer,
  quality: number = 80
): Promise<Buffer> {
  return await sharp(input)
    .avif({ quality })
    .toBuffer();
}

export async function convertToWebP(
  input: Buffer,
  quality: number = 80
): Promise<Buffer> {
  return await sharp(input)
    .webp({ quality })
    .toBuffer();
}

// Usage in API route
export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  
  const buffer = Buffer.from(await file.arrayBuffer());
  
  // Convert to AVIF
  const avifBuffer = await convertToAVIF(buffer, 80);
  
  // Upload to S3
  await uploadToS3(avifBuffer, 'image.avif');
  
  return NextResponse.json({ success: true });
}
```

---

## 📱 RESPONSIVE IMAGES

### Sizes Prop

```typescript
// Image adapts to container width
<Image
  src="/product.jpg"
  alt="Product"
  width={1200}
  height={800}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>

// Breakdowns:
// Mobile (<768px): Full width (100vw)
// Tablet (768-1200px): Half width (50vw)
// Desktop (>1200px): Third width (33vw)
```

### Art Direction with Picture

```typescript
// For different images at different breakpoints
export function ResponsiveHero() {
  return (
    <picture>
      {/* Mobile */}
      <source
        media="(max-width: 768px)"
        srcSet="/hero-mobile.avif 640w"
        type="image/avif"
      />
      <source
        media="(max-width: 768px)"
        srcSet="/hero-mobile.webp 640w"
        type="image/webp"
      />
      
      {/* Desktop */}
      <source
        srcSet="/hero-desktop.avif 1920w"
        type="image/avif"
      />
      <source
        srcSet="/hero-desktop.webp 1920w"
        type="image/webp"
      />
      
      {/* Fallback */}
      <Image
        src="/hero-desktop.jpg"
        alt="Hero"
        width={1920}
        height={1080}
        priority
      />
    </picture>
  );
}
```

### Responsive Grid

```typescript
// components/ImageGrid.tsx
export function ImageGrid({ images }: { images: string[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {images.map((src, i) => (
        <div key={i} className="relative aspect-square">
          <Image
            src={src}
            alt={`Image ${i + 1}`}
            fill
            className="object-cover rounded-lg"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      ))}
    </div>
  );
}
```

---

## 🌍 IMAGE CDN CONFIGURATION

### Vercel Image Optimization

```typescript
// Automatic with Next.js Image component
// Vercel serves optimized images from edge CDN

// Custom loader
// next.config.js
module.exports = {
  images: {
    loader: 'default', // or 'imgix', 'cloudinary', 'akamai'
    path: '/_next/image',
  },
};
```

### Cloudinary Setup

```typescript
// lib/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadToCloudinary(file: Buffer, publicId: string) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          public_id: publicId,
          format: 'auto', // Auto format selection
          quality: 'auto', // Auto quality
          fetch_format: 'auto',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      )
      .end(file);
  });
}

// next.config.js
module.exports = {
  images: {
    loader: 'cloudinary',
    path: 'https://res.cloudinary.com/your-cloud-name/image/upload/',
  },
};
```

### imgix Setup

```typescript
// lib/imgix.ts
import ImgixClient from '@imgix/js-core';

const client = new ImgixClient({
  domain: 'your-source.imgix.net',
  secureURLToken: process.env.IMGIX_TOKEN,
});

export function getImgixUrl(path: string, params = {}) {
  return client.buildURL(path, {
    auto: 'format,compress',
    q: 80,
    ...params,
  });
}

// Usage
<Image
  src={getImgixUrl('/path/to/image.jpg', { w: 800, h: 600 })}
  alt="Image"
  width={800}
  height={600}
/>
```

---

## 🌫️ BLUR PLACEHOLDERS

### Generate Blur Data URL

```typescript
// lib/blur-placeholder.ts
import { getPlaiceholder } from 'plaiceholder';
import fs from 'fs/promises';

export async function getBase64(imagePath: string) {
  try {
    const file = await fs.readFile(`./public${imagePath}`);
    const { base64 } = await getPlaiceholder(file);
    return base64;
  } catch (err) {
    console.error(err);
    return null;
  }
}

// Generate at build time
export async function generateStaticParams() {
  const images = ['/hero.jpg', '/banner.jpg'];
  
  const blurData = await Promise.all(
    images.map(async (src) => ({
      src,
      blurDataURL: await getBase64(src),
    }))
  );

  return blurData;
}
```

### Inline SVG Blur

```typescript
// lib/svg-blur.ts
export function generateSVGBlur(width: number, height: number) {
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${width} ${height}'%3E%3Cfilter id='b' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3CfeColorMatrix values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 100 -1' result='s'/%3E%3CfeFlood x='0' y='0' width='100%25' height='100%25'/%3E%3CfeComposite operator='out' in='s'/%3E%3CfeComposite in2='SourceGraphic'/%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3C/filter%3E%3Cimage width='100%25' height='100%25' x='0' y='0' preserveAspectRatio='none' style='filter: url(%23b);' href='${imageSrc}'/%3E%3C/svg%3E`;
}

// Usage
<Image
  src="/image.jpg"
  alt="Image"
  width={800}
  height={600}
  placeholder="blur"
  blurDataURL={generateSVGBlur(800, 600)}
/>
```

### CSS Blur Effect

```typescript
// components/BlurImage.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';

export function BlurImage({ src, alt, ...props }: any) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Image
      {...props}
      src={src}
      alt={alt}
      className={`
        duration-700 ease-in-out
        ${isLoading ? 'scale-110 blur-2xl grayscale' : 'scale-100 blur-0 grayscale-0'}
      `}
      onLoadingComplete={() => setIsLoading(false)}
    />
  );
}
```

---

## 🚀 LAZY LOADING

### Native Lazy Loading

```typescript
// Below-the-fold images
<Image
  src="/product.jpg"
  alt="Product"
  width={800}
  height={600}
  loading="lazy"
/>

// Above-the-fold (priority)
<Image
  src="/hero.jpg"
  alt="Hero"
  width={1920}
  height={1080}
  priority
/>
```

### Intersection Observer

```typescript
// hooks/useInView.ts
import { useEffect, useRef, useState } from 'react';

export function useInView(options = {}) {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting);
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [options]);

  return [ref, isInView] as const;
}

// Usage
export function LazyImage({ src, alt }: { src: string; alt: string }) {
  const [ref, isInView] = useInView({ threshold: 0.1 });

  return (
    <div ref={ref}>
      {isInView && (
        <Image src={src} alt={alt} width={800} height={600} />
      )}
    </div>
  );
}
```

### Progressive Loading

```typescript
'use client';

import { useState } from 'react';
import Image from 'next/image';

export function ProgressiveImage({
  lowQualitySrc,
  highQualitySrc,
  alt,
}: {
  lowQualitySrc: string;
  highQualitySrc: string;
  alt: string;
}) {
  const [src, setSrc] = useState(lowQualitySrc);

  return (
    <Image
      src={src}
      alt={alt}
      width={800}
      height={600}
      onLoadingComplete={() => setSrc(highQualitySrc)}
    />
  );
}
```

---

## 📉 IMAGE COMPRESSION

### Sharp Library

```typescript
// lib/compress-image.ts
import sharp from 'sharp';

export async function compressImage(
  input: Buffer,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'jpeg' | 'png' | 'webp' | 'avif';
  } = {}
) {
  const {
    width,
    height,
    quality = 80,
    format = 'webp',
  } = options;

  let pipeline = sharp(input);

  // Resize if dimensions provided
  if (width || height) {
    pipeline = pipeline.resize(width, height, {
      fit: 'inside',
      withoutEnlargement: true,
    });
  }

  // Convert format and compress
  switch (format) {
    case 'jpeg':
      pipeline = pipeline.jpeg({ quality, mozjpeg: true });
      break;
    case 'png':
      pipeline = pipeline.png({ quality, compressionLevel: 9 });
      break;
    case 'webp':
      pipeline = pipeline.webp({ quality });
      break;
    case 'avif':
      pipeline = pipeline.avif({ quality });
      break;
  }

  return await pipeline.toBuffer();
}

// Usage in upload API
export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  
  const buffer = Buffer.from(await file.arrayBuffer());
  
  // Compress to multiple formats
  const [jpeg, webp, avif] = await Promise.all([
    compressImage(buffer, { format: 'jpeg', quality: 85, width: 1920 }),
    compressImage(buffer, { format: 'webp', quality: 80, width: 1920 }),
    compressImage(buffer, { format: 'avif', quality: 75, width: 1920 }),
  ]);

  // Upload all formats
  await Promise.all([
    uploadToS3(jpeg, 'image.jpg'),
    uploadToS3(webp, 'image.webp'),
    uploadToS3(avif, 'image.avif'),
  ]);

  return NextResponse.json({ success: true });
}
```

### ImageOptim API

```typescript
// lib/imageoptim.ts
import fetch from 'node-fetch';

export async function optimizeWithImageOptim(buffer: Buffer) {
  const formData = new FormData();
  formData.append('file', new Blob([buffer]));

  const response = await fetch('https://api.imageoptim.com/v1/optimize', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.IMAGEOPTIM_API_KEY}`,
    },
    body: formData,
  });

  return Buffer.from(await response.arrayBuffer());
}
```

---

## ☁️ S3/CLOUDFRONT SETUP

### S3 Upload with Optimization

```typescript
// lib/s3-image-upload.ts
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function uploadImageToS3(
  file: File,
  key: string
): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());

  // Optimize image
  const optimized = await sharp(buffer)
    .resize(2048, 2048, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality: 85 })
    .toBuffer();

  // Upload to S3
  await s3Client.send(
    new PutObjectCommand({
      Bucket: process.env.S3_BUCKET!,
      Key: key,
      Body: optimized,
      ContentType: 'image/webp',
      CacheControl: 'public, max-age=31536000, immutable',
      Metadata: {
        'original-name': file.name,
        'optimized': 'true',
      },
    })
  );

  // Return CloudFront URL
  return `https://${process.env.CLOUDFRONT_DOMAIN}/${key}`;
}
```

### CloudFront Configuration

```typescript
// CloudFront config (in AWS Console or CDK)
{
  "Origins": [
    {
      "DomainName": "your-bucket.s3.amazonaws.com",
      "OriginPath": "/images",
      "S3OriginConfig": {
        "OriginAccessIdentity": "origin-access-identity/cloudfront/..."
      }
    }
  ],
  "CacheBehaviors": [
    {
      "PathPattern": "*.jpg",
      "TargetOriginId": "S3-your-bucket",
      "ViewerProtocolPolicy": "redirect-to-https",
      "CachePolicyId": "658327ea-f89d-4fab-a63d-7e88639e58f6", // CachingOptimized
      "Compress": true
    }
  ]
}
```

---

## ✅ BEST PRACTICES

### 1. Always Specify Dimensions

```typescript
// ❌ Bad - causes layout shift
<Image src="/image.jpg" alt="Image" />

// ✅ Good - reserves space
<Image src="/image.jpg" alt="Image" width={800} height={600} />
```

### 2. Use Priority Wisely

```typescript
// Only 1-2 images per page
<Image src="/hero.jpg" alt="Hero" priority />
```

### 3. Optimize for Mobile First

```typescript
// Smaller images for mobile
<Image
  src="/image.jpg"
  alt="Image"
  width={800}
  height={600}
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

### 4. Use Modern Formats

```typescript
// AVIF first, then WebP
// next.config.js
module.exports = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};
```

### 5. Lazy Load Below Fold

```typescript
// Above fold
<Image src="/hero.jpg" priority />

// Below fold
<Image src="/product.jpg" loading="lazy" />
```

---

## 📊 IMAGE OPTIMIZATION CHECKLIST

- [ ] Use Next.js Image component
- [ ] Specify width and height
- [ ] Enable AVIF/WebP formats
- [ ] Add blur placeholders
- [ ] Lazy load below-fold images
- [ ] Compress images (80-90% quality)
- [ ] Use CDN (CloudFront/Vercel)
- [ ] Implement responsive images
- [ ] Set cache headers (1 year)
- [ ] Monitor image performance

---

**Image Optimization Status:** ✅ Complete  
**Last Updated:** November 2, 2025  
**Target:** <2.5s LCP with optimized images
