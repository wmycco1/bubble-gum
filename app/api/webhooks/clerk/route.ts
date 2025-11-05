// ═══════════════════════════════════════════════════════════════
// CLERK WEBHOOK HANDLER
// ═══════════════════════════════════════════════════════════════
// Syncs user data from Clerk to database
// Events: user.created, user.updated, user.deleted
// ═══════════════════════════════════════════════════════════════

import { Webhook } from 'svix';
import { headers } from 'next/headers';
import type { WebhookEvent } from '@clerk/nextjs/server';
import prisma from '@/lib/db/prisma';

/**
 * POST /api/webhooks/clerk
 * Handle Clerk webhook events
 */
export async function POST(req: Request) {
  // Get webhook secret from environment
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('CLERK_WEBHOOK_SECRET is not set in environment variables');
  }

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If no headers, reject request
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing svix headers', { status: 400 });
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create Svix instance
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify webhook signature
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error: Verification failed', { status: 400 });
  }

  // Handle events
  const eventType = evt.type;

  try {
    if (eventType === 'user.created') {
      const { id, email_addresses, first_name, last_name, image_url } = evt.data;

      // Create user in database
      await prisma.user.create({
        data: {
          clerkId: id,
          email: email_addresses[0]?.email_address || '',
          firstName: first_name || null,
          lastName: last_name || null,
          avatarUrl: image_url || null,
        },
      });

      // eslint-disable-next-line no-console
      console.log('✅ User created:', id);
    } else if (eventType === 'user.updated') {
      const { id, email_addresses, first_name, last_name, image_url } = evt.data;

      // Update user in database
      await prisma.user.update({
        where: { clerkId: id },
        data: {
          email: email_addresses[0]?.email_address || '',
          firstName: first_name || null,
          lastName: last_name || null,
          avatarUrl: image_url || null,
        },
      });

      // eslint-disable-next-line no-console
      console.log('✅ User updated:', id);
    } else if (eventType === 'user.deleted') {
      const { id } = evt.data;

      // Hard delete user (Prisma schema doesn't have soft delete field)
      await prisma.user.delete({
        where: { clerkId: id as string },
      });

      // eslint-disable-next-line no-console
      console.log('✅ User deleted:', id);
    }

    return new Response('Webhook processed successfully', { status: 200 });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response('Error: Processing failed', { status: 500 });
  }
}
