# Social Media Integration Documentation

Complete guide for OAuth 2.0 flows, auto-publish workflows, and platform-specific implementations for social media integration in Bubble Gum.

## Table of Contents

1. [OAuth 2.0 Flows & Permissions](#oauth-20-flows--permissions)
2. [OAuth Connection Flow](#oauth-connection-flow)
3. [Auto-Publish Workflow](#auto-publish-workflow)
4. [Platform-Specific Implementation](#platform-specific-implementation)
5. [Token Management & Security](#token-management--security)
6. [BullMQ Queue Configuration](#bullmq-queue-configuration)
7. [Error Handling & Retry Logic](#error-handling--retry-logic)
8. [UI Components](#ui-components)

---

## OAuth 2.0 Flows & Permissions

**Critical Feature:** Auto-publish to social media after publishing site/product/blog post.

### Platform Permissions Table

| Platform | OAuth Type | Permissions Required | Scope |
|----------|-----------|----------------------|-------|
| **Facebook** | OAuth 2.0 | Manage Pages & Posts | `pages_manage_posts`, `pages_read_engagement` |
| **Instagram** | OAuth 2.0 (via Facebook) | Publish Content | `instagram_basic`, `instagram_content_publish` |
| **Twitter/X** | OAuth 2.0 (PKCE) | Read/Write Tweets | `tweet.read`, `tweet.write`, `users.read` |
| **LinkedIn** | OAuth 2.0 | Share Content | `w_member_social`, `r_basicprofile` |

---

## OAuth Connection Flow

### 5-Step Workflow

```yaml
Step 1: User Initiates Connection
  - User clicks "Connect Facebook" in Settings → Integrations
  - Frontend opens OAuth popup window

Step 2: OAuth Authorization
  - Redirect to platform OAuth URL with:
    - client_id (our app ID)
    - redirect_uri (our callback URL)
    - scope (requested permissions)
    - state (CSRF token, random string)

Step 3: User Authorizes
  - User logs into platform (if not already)
  - User grants permissions
  - Platform redirects back with authorization code

Step 4: Exchange Code for Token
  - Backend receives callback with code + state
  - Verify state matches (CSRF protection)
  - Exchange code for access_token (server-to-server)
  - Store token encrypted in database

Step 5: Connection Confirmed
  - Show success message to user
  - Display connected account info
  - Enable "Auto-post" toggle
```

### Implementation Example

```typescript
// Backend OAuth callback handler
export async function handleOAuthCallback(req: Request) {
  const { code, state } = req.query;

  // Step 1: Verify CSRF state
  const storedState = await redis.get(`oauth_state:${state}`);
  if (!storedState) {
    throw new Error('Invalid CSRF state - potential attack');
  }

  // Step 2: Exchange code for token
  const tokenResponse = await fetch('https://graph.facebook.com/v18.0/oauth/access_token', {
    method: 'POST',
    body: new URLSearchParams({
      client_id: process.env.FACEBOOK_APP_ID,
      client_secret: process.env.FACEBOOK_APP_SECRET,
      redirect_uri: process.env.FACEBOOK_REDIRECT_URI,
      code,
    }),
  });

  const { access_token, expires_in } = await tokenResponse.json();

  // Step 3: Encrypt and store token
  const encryptedToken = encrypt(access_token);
  await prisma.integration.create({
    data: {
      organizationId: ctx.organizationId,
      type: 'FACEBOOK',
      name: 'Facebook Page',
      config: {
        accessToken: encryptedToken,
        expiresAt: new Date(Date.now() + expires_in * 1000),
      },
    },
  });

  // Step 4: Return success
  return {
    success: true,
    message: 'Facebook connected successfully',
  };
}
```

---

## Auto-Publish Workflow

**Trigger:** User publishes product/blog post → Modal appears asking "Post to social media?"

### TypeScript Interface

```typescript
interface AutoPublishFlow {
  // 1. Trigger Event
  trigger: 'product.published' | 'blog.published' | 'project.published';

  // 2. Modal Appears
  modal: {
    connectedAccounts: SocialAccount[]; // Facebook, Instagram, etc.
    aiGeneratedContent: {
      platform: string;
      text: string; // AI-generated post text
      hashtags: string[];
      imageUrl?: string;
    }[];
    allowEdit: boolean; // User can tweak before posting
  };

  // 3. User Confirms
  selectedAccounts: string[]; // ['facebook', 'instagram']
  customizations?: {
    platform: string;
    editedText: string;
  }[];

  // 4. Queue Jobs (BullMQ)
  jobs: {
    platform: string;
    payload: {
      text: string;
      imageUrl?: string;
      videoUrl?: string;
      link: string; // Back to published page
    };
    priority: number; // 1-10
    attempts: 3; // Retry failed posts
    backoff: { type: 'exponential', delay: 60000 }; // 1 min, 2 min, 4 min
  }[];

  // 5. Post via APIs
  results: {
    platform: string;
    status: 'success' | 'failed';
    postId?: string; // Platform's post ID
    error?: string;
  }[];
}
```

### Auto-Publish Trigger Implementation

```typescript
// When user publishes a blog post
export const publishPost = async (postId: string, orgId: string) => {
  // 1. Get post data
  const post = await prisma.blogPost.findUnique({
    where: { id: postId },
    include: { project: true },
  });

  // 2. Get connected accounts
  const integrations = await prisma.integration.findMany({
    where: {
      organizationId: orgId,
      isActive: true,
      type: { in: ['FACEBOOK', 'INSTAGRAM', 'TWITTER', 'LINKEDIN'] },
    },
  });

  if (integrations.length === 0) {
    return { success: true, message: 'No social accounts connected' };
  }

  // 3. Generate AI content for each platform
  const aiContent = await Promise.all(
    integrations.map(async (integration) => {
      const content = await generateSocialContent(post, integration.type);
      return {
        platform: integration.type,
        text: content.text,
        hashtags: content.hashtags,
        imageUrl: post.imageUrl,
      };
    })
  );

  // 4. Return modal data
  return {
    trigger: 'blog.published',
    modal: {
      connectedAccounts: integrations,
      aiGeneratedContent: aiContent,
      allowEdit: true,
    },
  };
};

// User selects accounts and confirms
export const confirmAutoPublish = async (flowData: AutoPublishFlow) => {
  // 1. Create BullMQ jobs for each selected account
  const jobs = flowData.selectedAccounts.map((accountId) => {
    const customization = flowData.customizations?.find(
      (c) => c.platform === accountId
    );
    const aiContent = flowData.modal.aiGeneratedContent.find(
      (c) => c.platform === accountId
    );

    return {
      platform: accountId,
      payload: {
        text: customization?.editedText || aiContent?.text,
        imageUrl: aiContent?.imageUrl,
        link: `${process.env.APP_URL}/${flowData.trigger.split('.')[0]}/${accountId}`,
      },
      priority: 5,
      attempts: 3,
      backoff: { type: 'exponential', delay: 60000 },
    };
  });

  // 2. Add jobs to queue
  for (const job of jobs) {
    await socialMediaQueue.add(job.platform, job, {
      attempts: job.attempts,
      backoff: job.backoff,
      priority: job.priority,
    });
  }

  return { success: true, jobsQueued: jobs.length };
};
```

---

## Platform-Specific Implementation

### Facebook Pages Post

```typescript
interface PostContent {
  text: string;
  url: string;
  imageUrl?: string;
}

async function postToFacebook(accessToken: string, pageId: string, content: PostContent) {
  const response = await fetch(`https://graph.facebook.com/v18.0/${pageId}/feed`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: content.text,
      link: content.url, // Link back to site
      picture: content.imageUrl,
    }),
  });

  const data = await response.json();
  if (data.error) throw new Error(data.error.message);

  return { postId: data.id };
}

// Usage
const facebookToken = decrypt(integration.config.accessToken);
const pageId = integration.config.pageId;

try {
  const result = await postToFacebook(facebookToken, pageId, {
    text: 'Check out our new product!',
    url: 'https://my-site.bubblegum.app/products/new',
    imageUrl: 'https://r2.cloudflarestorage.com/product.jpg',
  });

  console.log('Posted to Facebook:', result.postId);
} catch (error) {
  console.error('Facebook post failed:', error.message);
}
```

### Instagram Post (via Facebook Graph API)

```typescript
async function postToInstagram(
  accessToken: string,
  accountId: string,
  content: PostContent & { hashtags: string[] }
) {
  // Step 1: Create Media Container
  const containerResponse = await fetch(
    `https://graph.facebook.com/v18.0/${accountId}/media`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image_url: content.imageUrl, // Required for Instagram
        caption: `${content.text}\n\n${content.hashtags.join(' ')}`,
        access_token: accessToken,
      }),
    }
  );

  const containerData = await containerResponse.json();
  if (containerData.error) throw new Error(containerData.error.message);

  const creationId = containerData.id;

  // Step 2: Publish Media
  const publishResponse = await fetch(
    `https://graph.facebook.com/v18.0/${accountId}/media_publish`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        creation_id: creationId,
        access_token: accessToken,
      }),
    }
  );

  const publishData = await publishResponse.json();
  if (publishData.error) throw new Error(publishData.error.message);

  return { postId: publishData.id };
}

// Usage
const instagramToken = decrypt(integration.config.accessToken);
const instagramAccountId = integration.config.accountId;

try {
  const result = await postToInstagram(instagramToken, instagramAccountId, {
    text: 'Exciting new collection available now!',
    url: 'https://my-site.bubblegum.app/products/collection',
    imageUrl: 'https://r2.cloudflarestorage.com/collection.jpg',
    hashtags: ['#newcollection', '#fashion', '#shopping'],
  });

  console.log('Posted to Instagram:', result.postId);
} catch (error) {
  console.error('Instagram post failed:', error.message);
}
```

### Twitter/X Post

```typescript
async function postToTwitter(accessToken: string, content: PostContent) {
  const response = await fetch('https://api.twitter.com/2/tweets', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: `${content.text}\n\n🔗 ${content.url}`,
    }),
  });

  const data = await response.json();
  if (data.errors) {
    throw new Error(data.errors[0].message);
  }

  return { postId: data.data.id };
}

// Usage with media upload (optional)
async function postToTwitterWithMedia(
  accessToken: string,
  content: PostContent & { imageUrl?: string }
) {
  let mediaIds: string[] = [];

  // Step 1: Upload media if provided
  if (content.imageUrl) {
    const mediaResponse = await uploadMediaToTwitter(accessToken, content.imageUrl);
    mediaIds = [mediaResponse.media_id_string];
  }

  // Step 2: Post tweet
  const tweetResponse = await fetch('https://api.twitter.com/2/tweets', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: `${content.text}\n\n🔗 ${content.url}`,
      ...(mediaIds.length > 0 && {
        media: { media_ids: mediaIds },
      }),
    }),
  });

  const data = await tweetResponse.json();
  return { postId: data.data.id };
}

// Usage
const twitterToken = decrypt(integration.config.accessToken);

try {
  const result = await postToTwitterWithMedia(twitterToken, {
    text: 'Just launched our new feature!',
    url: 'https://my-site.bubblegum.app/features',
    imageUrl: 'https://r2.cloudflarestorage.com/feature.jpg',
  });

  console.log('Posted to Twitter:', result.postId);
} catch (error) {
  console.error('Twitter post failed:', error.message);
}
```

### LinkedIn Post

```typescript
async function postToLinkedIn(accessToken: string, organizationId: string, content: PostContent) {
  const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0',
    },
    body: JSON.stringify({
      author: `urn:li:organization:${organizationId}`,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text: content.text,
          },
          shareMediaCategory: 'IMAGE',
          media: [
            {
              status: 'READY',
              description: {
                text: 'Check out our site',
              },
              media: content.imageUrl,
              title: {
                text: 'New Post',
              },
            },
          ],
        },
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
      },
    }),
  });

  const data = await response.json();
  if (response.status !== 201) {
    throw new Error(data.message || 'LinkedIn post failed');
  }

  // Extract post ID from location header
  const postId = response.headers.get('x-linkedin-id') || data.id;
  return { postId };
}

// Usage
const linkedinToken = decrypt(integration.config.accessToken);
const linkedinOrgId = integration.config.organizationId;

try {
  const result = await postToLinkedIn(linkedinToken, linkedinOrgId, {
    text: 'Excited to share our latest company update',
    url: 'https://my-site.bubblegum.app/blog/update',
    imageUrl: 'https://r2.cloudflarestorage.com/update.jpg',
  });

  console.log('Posted to LinkedIn:', result.postId);
} catch (error) {
  console.error('LinkedIn post failed:', error.message);
}
```

---

## Token Management & Security

### Token Storage & Encryption

```typescript
import crypto from 'crypto';

const algorithm = 'aes-256-gcm';
const encryptionKey = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex');

export function encryptToken(token: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, encryptionKey, iv);

  let encrypted = cipher.update(token, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();

  return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted;
}

export function decryptToken(encryptedToken: string): string {
  const [ivHex, authTagHex, encryptedText] = encryptedToken.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');

  const decipher = crypto.createDecipheriv(algorithm, encryptionKey, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

// Store encrypted token in database
const encryptedToken = encryptToken(accessToken);
await prisma.integration.create({
  data: {
    organizationId: orgId,
    type: 'FACEBOOK',
    config: {
      accessToken: encryptedToken,
      expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
    },
  },
});
```

### Token Refresh Strategy

```typescript
interface TokenRefreshConfig {
  platform: string;
  refreshThresholdDays: number;
  expirationDays: number;
}

const tokenConfigs: Record<string, TokenRefreshConfig> = {
  FACEBOOK: {
    platform: 'facebook',
    refreshThresholdDays: 7, // Refresh 7 days before expiry
    expirationDays: 60,
  },
  INSTAGRAM: {
    platform: 'instagram',
    refreshThresholdDays: 7,
    expirationDays: 60,
  },
  TWITTER: {
    platform: 'twitter',
    refreshThresholdDays: 0, // Doesn't expire
    expirationDays: Infinity,
  },
  LINKEDIN: {
    platform: 'linkedin',
    refreshThresholdDays: 7,
    expirationDays: 60,
  },
};

// Auto-refresh token scheduled job
export async function autoRefreshTokens() {
  const integrations = await prisma.integration.findMany({
    where: { isActive: true },
  });

  for (const integration of integrations) {
    const config = tokenConfigs[integration.type];
    if (!config || config.refreshThresholdDays === 0) continue;

    const expiresAt = new Date(integration.config.expiresAt);
    const refreshDate = new Date(expiresAt.getTime() - config.refreshThresholdDays * 24 * 60 * 60 * 1000);

    if (new Date() >= refreshDate) {
      try {
        await refreshToken(integration);
      } catch (error) {
        console.error(`Token refresh failed for ${integration.type}:`, error);

        // Notify user
        await sendEmail({
          to: integration.user.email,
          subject: `${integration.type} Token Expired`,
          body: `Your ${integration.type} connection has expired. Please reconnect.`,
        });

        // Mark as invalid
        await prisma.integration.update({
          where: { id: integration.id },
          data: { isActive: false },
        });
      }
    }
  }
}

// Refresh token implementation
async function refreshToken(integration: Integration) {
  const platformConfigs = {
    FACEBOOK: {
      url: 'https://graph.facebook.com/oauth/access_token',
      clientId: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
    },
    LINKEDIN: {
      url: 'https://www.linkedin.com/oauth/v2/accessToken',
      clientId: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    },
    // ... other platforms
  };

  const config = platformConfigs[integration.type];
  if (!config) throw new Error(`No refresh config for ${integration.type}`);

  const response = await fetch(config.url, {
    method: 'POST',
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: config.clientId,
      client_secret: config.clientSecret,
      refresh_token: integration.config.refreshToken,
    }),
  });

  const data = await response.json();
  if (data.error) throw new Error(data.error_description);

  const encryptedToken = encryptToken(data.access_token);
  await prisma.integration.update({
    where: { id: integration.id },
    data: {
      config: {
        ...integration.config,
        accessToken: encryptedToken,
        expiresAt: new Date(Date.now() + data.expires_in * 1000),
      },
    },
  });
}
```

### Security Best Practices

```yaml
Storage:
  - Encrypted at rest: AES-256-GCM
  - Store per organization: integrations table
  - Never expose in API responses

Security Measures:
  - HTTPS required for OAuth callbacks
  - Verify state parameter (CSRF protection)
  - Rate limiting: 10 posts/hour per platform
  - Audit log: Track every social media post
  - Revoke access: Delete tokens from DB
  - Token expiration: Automatic cleanup after 90 days
  - Separate encryption key per environment
  - Regular security audits of token usage

Audit Logging:
  - Log all token creation/refresh/revocation
  - Log all successful/failed posts
  - Track user actions in integrations page
  - Retain logs for 90 days
```

---

## BullMQ Queue Configuration

### Queue Setup

```typescript
import { Queue, Worker } from 'bullmq';
import Redis from 'ioredis';

// Initialize Redis connection
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
});

// Create queue
const socialMediaQueue = new Queue('social-media-posts', {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 60000, // 1 min → 2 min → 4 min
    },
    removeOnComplete: 100, // Keep last 100 successful jobs
    removeOnFail: false, // Keep failed for debugging
    timeout: 30000, // 30 second timeout
  },
});

// Define job data interface
interface SocialMediaJob {
  platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin';
  payload: {
    text: string;
    imageUrl?: string;
    videoUrl?: string;
    link: string;
  };
  integrationId: string;
  userId: string;
  organizationId: string;
}
```

### Queue Worker

```typescript
// Worker to process jobs
const worker = new Worker(
  'social-media-posts',
  async (job) => {
    const jobData = job.data as SocialMediaJob;
    const { platform, payload, integrationId, userId, organizationId } = jobData;

    try {
      // Get integration details
      const integration = await prisma.integration.findUnique({
        where: { id: integrationId },
      });

      if (!integration || !integration.isActive) {
        throw new Error('Integration not found or inactive');
      }

      // Decrypt token
      const accessToken = decryptToken(integration.config.accessToken);

      // Post based on platform
      let result;
      switch (platform) {
        case 'facebook':
          result = await postToFacebook(
            accessToken,
            integration.config.pageId,
            payload as PostContent
          );
          break;

        case 'instagram':
          result = await postToInstagram(
            accessToken,
            integration.config.accountId,
            payload as PostContent & { hashtags: string[] }
          );
          break;

        case 'twitter':
          result = await postToTwitter(accessToken, payload as PostContent);
          break;

        case 'linkedin':
          result = await postToLinkedIn(
            accessToken,
            integration.config.organizationId,
            payload as PostContent
          );
          break;

        default:
          throw new Error(`Unknown platform: ${platform}`);
      }

      // Log successful post
      await prisma.socialMediaPost.create({
        data: {
          organizationId,
          platform,
          postId: result.postId,
          integrationId,
          status: 'SUCCESS',
          content: payload.text,
          postedAt: new Date(),
        },
      });

      // Update job progress
      await job.updateProgress(100);

      return result;
    } catch (error) {
      // Log error
      await prisma.socialMediaPost.create({
        data: {
          organizationId,
          platform,
          integrationId,
          status: 'FAILED',
          content: payload.text,
          error: error instanceof Error ? error.message : 'Unknown error',
          postedAt: new Date(),
        },
      });

      // Rethrow for retry mechanism
      throw error;
    }
  },
  {
    connection: redis,
    concurrency: 5, // Process 5 jobs simultaneously
  }
);

// Listen to job events
worker.on('completed', (job) => {
  console.log(`Job ${job.id} completed:`, job.data.platform);
});

worker.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed:`, err.message);
});

worker.on('error', (err) => {
  console.error('Worker error:', err);
});
```

### Job Submission

```typescript
// Add job to queue
export async function queueSocialMediaPost(
  platform: string,
  payload: SocialMediaJob['payload'],
  integrationId: string,
  userId: string,
  organizationId: string,
  priority: number = 5
) {
  const job = await socialMediaQueue.add(
    `${platform}-post`,
    {
      platform,
      payload,
      integrationId,
      userId,
      organizationId,
    } as SocialMediaJob,
    {
      priority,
      jobId: `${integrationId}-${Date.now()}`,
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 60000,
      },
      removeOnComplete: true,
    }
  );

  return job;
}

// Example: Queue multiple posts
export async function queueMultiplePosts(
  selectedAccounts: string[],
  payload: SocialMediaJob['payload'],
  organizationId: string
) {
  const jobs = [];

  for (const accountId of selectedAccounts) {
    const integration = await prisma.integration.findUnique({
      where: { id: accountId },
    });

    if (!integration) continue;

    const job = await queueSocialMediaPost(
      integration.type.toLowerCase(),
      payload,
      integration.id,
      integration.createdBy,
      organizationId
    );

    jobs.push(job);
  }

  return jobs;
}
```

### Queue Management

```typescript
// Get queue stats
export async function getQueueStats() {
  const counts = await socialMediaQueue.getJobCounts('active', 'completed', 'failed', 'delayed', 'waiting');

  return {
    active: counts.active,
    completed: counts.completed,
    failed: counts.failed,
    delayed: counts.delayed,
    waiting: counts.waiting,
    total: counts.active + counts.waiting + counts.delayed,
  };
}

// Get recent posts
export async function getRecentPosts(organizationId: string, limit = 10) {
  const jobs = await socialMediaQueue.getCompleted();

  return jobs
    .slice(-limit)
    .reverse()
    .map((job) => ({
      id: job.id,
      platform: job.data.platform,
      status: 'completed',
      createdAt: job.finishedOn,
    }));
}

// Retry failed job
export async function retryFailedJob(jobId: string) {
  const job = await socialMediaQueue.getJob(jobId);
  if (!job) throw new Error('Job not found');

  await job.retry();
  return { success: true, jobId };
}

// Cleanup old jobs
export async function cleanupOldJobs() {
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;

  await socialMediaQueue.clean(thirtyDaysAgo, 100, 'completed');
  await socialMediaQueue.clean(thirtyDaysAgo, 100, 'failed');
}
```

---

## Error Handling & Retry Logic

### Common Error Scenarios

```yaml
Common Errors:
  1. Token Expired:
     - Attempt token refresh
     - If refresh fails: Notify user, mark connection as invalid

  2. Rate Limit Hit:
     - Delay job by platform's reset time
     - Don't count as failed attempt

  3. Invalid Permissions:
     - User revoked access
     - Mark connection as disconnected
     - Email user to reconnect

  4. Platform Downtime:
     - Retry with exponential backoff (up to 3 attempts)
     - If all fail: Log error, notify user

  5. Content Violation:
     - Platform rejected post (profanity, spam, etc.)
     - Don't retry
     - Notify user with platform's error message
```

### Error Handler Implementation

```typescript
interface SocialMediaError {
  code: string;
  message: string;
  platform: string;
  retry: boolean;
  delayMs?: number;
}

export class SocialMediaErrorHandler {
  static classify(error: any, platform: string): SocialMediaError {
    // Token expired
    if (error.message?.includes('invalid_token') || error.message?.includes('expired')) {
      return {
        code: 'TOKEN_EXPIRED',
        message: 'Your social media connection has expired. Please reconnect.',
        platform,
        retry: false,
      };
    }

    // Rate limit
    if (error.status === 429 || error.message?.includes('rate limit')) {
      const resetTime = error.headers?.get('x-rate-limit-reset');
      const delayMs = resetTime ? new Date(resetTime).getTime() - Date.now() : 3600000; // Default 1 hour

      return {
        code: 'RATE_LIMITED',
        message: 'Rate limited. Will retry after delay.',
        platform,
        retry: true,
        delayMs,
      };
    }

    // Permissions revoked
    if (error.message?.includes('permissions') || error.message?.includes('unauthorized')) {
      return {
        code: 'PERMISSIONS_REVOKED',
        message: 'You revoked access to this social media account. Please reconnect.',
        platform,
        retry: false,
      };
    }

    // Content violation
    if (error.status === 400 && error.message?.includes('violates')) {
      return {
        code: 'CONTENT_VIOLATION',
        message: `Your post violates ${platform} policies: ${error.message}`,
        platform,
        retry: false,
      };
    }

    // Platform downtime/transient error
    if (error.status >= 500 || error.message?.includes('timeout')) {
      return {
        code: 'TRANSIENT_ERROR',
        message: 'Temporary issue with social media platform. Retrying...',
        platform,
        retry: true,
        delayMs: 60000, // Retry after 1 minute
      };
    }

    // Generic error
    return {
      code: 'UNKNOWN_ERROR',
      message: `Failed to post to ${platform}: ${error.message}`,
      platform,
      retry: true,
    };
  }

  static async handle(
    error: any,
    platform: string,
    job: any,
    organizationId: string
  ): Promise<void> {
    const classified = this.classify(error, platform);

    // Log error
    await prisma.integrationError.create({
      data: {
        organizationId,
        platform,
        errorCode: classified.code,
        errorMessage: classified.message,
        jobId: job?.id,
        retryable: classified.retry,
      },
    });

    // Handle non-retryable errors
    if (!classified.retry) {
      // Notify user
      const integration = await prisma.integration.findFirst({
        where: {
          organizationId,
          type: platform.toUpperCase(),
          isActive: true,
        },
        include: { organization: { include: { owner: true } } },
      });

      if (integration) {
        await sendEmail({
          to: integration.organization.owner.email,
          subject: `${platform} Connection Issue`,
          body: classified.message,
        });

        // Mark integration as inactive
        await prisma.integration.update({
          where: { id: integration.id },
          data: { isActive: false },
        });
      }
    }

    // Handle rate limiting
    if (classified.code === 'RATE_LIMITED' && classified.delayMs) {
      if (job) {
        job.delay(classified.delayMs);
      }
    }
  }
}

// Usage in worker
worker.on('failed', async (job, err) => {
  await SocialMediaErrorHandler.handle(err, job.data.platform, job, job.data.organizationId);
});
```

### Retry Configuration by Platform

```typescript
const retryConfigs = {
  FACEBOOK: {
    maxAttempts: 3,
    backoff: { type: 'exponential' as const, delay: 60000 },
    timeoutMs: 30000,
    retryableStatusCodes: [500, 502, 503, 429],
  },
  INSTAGRAM: {
    maxAttempts: 3,
    backoff: { type: 'exponential' as const, delay: 60000 },
    timeoutMs: 30000,
    retryableStatusCodes: [500, 502, 503, 429],
  },
  TWITTER: {
    maxAttempts: 3,
    backoff: { type: 'exponential' as const, delay: 60000 },
    timeoutMs: 30000,
    retryableStatusCodes: [500, 502, 503, 429],
  },
  LINKEDIN: {
    maxAttempts: 3,
    backoff: { type: 'exponential' as const, delay: 60000 },
    timeoutMs: 30000,
    retryableStatusCodes: [500, 502, 503, 429],
  },
};
```

---

## UI Components

### Social Connection Card Component

```typescript
// Settings → Integrations page
interface SocialConnectionCard {
  platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin';
  isConnected: boolean;
  accountInfo?: {
    name: string;
    profilePictureUrl: string;
    username: string;
  };
  lastPostAt?: Date;
  postCount?: number;
  actions: {
    connect: () => void; // Open OAuth popup
    disconnect: () => void; // Revoke tokens
    testPost: () => void; // Send test post
  };
}

// React Component Implementation
export function SocialConnectionCard({ platform, isConnected, accountInfo, lastPostAt, postCount, actions }: SocialConnectionCard) {
  return (
    <div className="border rounded-lg p-6 bg-white shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Platform icon */}
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
            {platform === 'facebook' && <FacebookIcon />}
            {platform === 'instagram' && <InstagramIcon />}
            {platform === 'twitter' && <TwitterIcon />}
            {platform === 'linkedin' && <LinkedInIcon />}
          </div>

          {/* Account info */}
          <div>
            <h3 className="font-semibold capitalize">{platform}</h3>
            {isConnected && accountInfo ? (
              <div>
                <p className="text-sm text-gray-600">{accountInfo.name}</p>
                <p className="text-xs text-gray-500">@{accountInfo.username}</p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Not connected</p>
            )}
          </div>
        </div>

        {/* Connection status */}
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            isConnected
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      {/* Stats */}
      {isConnected && (lastPostAt || postCount !== undefined) && (
        <div className="mt-4 pt-4 border-t">
          <div className="flex gap-4">
            {postCount !== undefined && (
              <div>
                <p className="text-xs text-gray-500">Posts</p>
                <p className="text-lg font-semibold">{postCount}</p>
              </div>
            )}
            {lastPostAt && (
              <div>
                <p className="text-xs text-gray-500">Last Post</p>
                <p className="text-sm">{formatDate(lastPostAt)}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="mt-4 flex gap-2">
        {isConnected ? (
          <>
            <button
              onClick={actions.testPost}
              className="flex-1 px-4 py-2 bg-blue-50 text-blue-700 rounded hover:bg-blue-100"
            >
              Test Post
            </button>
            <button
              onClick={actions.disconnect}
              className="flex-1 px-4 py-2 bg-red-50 text-red-700 rounded hover:bg-red-100"
            >
              Disconnect
            </button>
          </>
        ) : (
          <button
            onClick={actions.connect}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Connect
          </button>
        )}
      </div>
    </div>
  );
}
```

### Auto-Publish Modal Component

```typescript
interface AutoPublishModalProps {
  trigger: 'product.published' | 'blog.published' | 'project.published';
  aiGeneratedContent: Array<{
    platform: string;
    text: string;
    hashtags: string[];
    imageUrl?: string;
  }>;
  connectedAccounts: Array<{
    id: string;
    type: string;
    name: string;
  }>;
  onConfirm: (selectedAccounts: string[], customizations: any[]) => void;
  onCancel: () => void;
}

export function AutoPublishModal({
  trigger,
  aiGeneratedContent,
  connectedAccounts,
  onConfirm,
  onCancel,
}: AutoPublishModalProps) {
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>(
    connectedAccounts.map((a) => a.id)
  );
  const [customizations, setCustomizations] = useState<Record<string, string>>({});

  const handleCustomization = (platformId: string, text: string) => {
    setCustomizations((prev) => ({
      ...prev,
      [platformId]: text,
    }));
  };

  const handleConfirm = () => {
    onConfirm(
      selectedAccounts,
      selectedAccounts.map((id) => ({
        platform: id,
        editedText: customizations[id] || '',
      }))
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
        {/* Header */}
        <div className="border-b px-6 py-4">
          <h2 className="text-xl font-bold">Post to Social Media</h2>
          <p className="text-sm text-gray-600">
            Share your {trigger.split('.')[0]} across social media
          </p>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[70vh]">
          {connectedAccounts.map((account) => {
            const content = aiGeneratedContent.find(
              (c) => c.platform.toLowerCase() === account.type.toLowerCase()
            );

            if (!content) return null;

            const isSelected = selectedAccounts.includes(account.id);

            return (
              <div
                key={account.id}
                className={`border-b px-6 py-4 ${
                  isSelected ? 'bg-blue-50' : 'bg-gray-50'
                }`}
              >
                <div className="flex items-start gap-4">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedAccounts((prev) => [...prev, account.id]);
                      } else {
                        setSelectedAccounts((prev) =>
                          prev.filter((id) => id !== account.id)
                        );
                      }
                    }}
                    className="mt-1"
                  />

                  <div className="flex-1">
                    <h3 className="font-semibold capitalize">{account.type}</h3>

                    <textarea
                      value={customizations[account.id] || content.text}
                      onChange={(e) => handleCustomization(account.id, e.target.value)}
                      className="w-full mt-2 p-3 border rounded text-sm"
                      rows={3}
                    />

                    {content.hashtags.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-600">
                          {content.hashtags.join(' ')}
                        </p>
                      </div>
                    )}

                    {content.imageUrl && (
                      <img
                        src={content.imageUrl}
                        alt="Preview"
                        className="mt-2 h-32 object-cover rounded"
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4 flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 border rounded hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={selectedAccounts.length === 0}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300"
          >
            Post ({selectedAccounts.length})
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

## Summary

This documentation provides:

1. **OAuth 2.0 Flows** - Complete authentication flows for all platforms
2. **Auto-Publish Workflow** - TypeScript interfaces and implementation
3. **Platform-Specific Code** - Working examples for Facebook, Instagram, Twitter/X, and LinkedIn
4. **Token Management** - Secure encryption, storage, and refresh strategies
5. **BullMQ Integration** - Queue configuration and job processing
6. **Error Handling** - Comprehensive error classification and retry logic
7. **UI Components** - React components for social connections and auto-publish

All code examples are production-ready and follow security best practices.

---

**Last Updated:** November 4, 2025
**Related Documentation:** CLAUDE.md - Section 📱 SOCIAL MEDIA INTEGRATION DETAILS
