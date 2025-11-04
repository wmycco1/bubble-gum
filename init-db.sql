-- ═══════════════════════════════════════════════════════════════
-- BUBBLE GUM - DATABASE INITIALIZATION
-- ═══════════════════════════════════════════════════════════════
-- Purpose: Initialize PostgreSQL database for Bubble Gum project
-- Run automatically by Docker on first container start
-- ═══════════════════════════════════════════════════════════════

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Set timezone
SET timezone = 'UTC';

-- Create schema if not exists
CREATE SCHEMA IF NOT EXISTS public;

-- Grant permissions
GRANT ALL ON SCHEMA public TO bubblegum;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO bubblegum;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO bubblegum;

-- ═══════════════════════════════════════════════════════════════
-- NOTES:
-- - Tables will be created by Prisma migrations
-- - Run: npx prisma migrate dev
-- - Or: npx prisma db push (for development)
-- ═══════════════════════════════════════════════════════════════
