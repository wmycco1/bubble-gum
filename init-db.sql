-- ═══════════════════════════════════════════════════════════════
-- BUBBLE GUM - DATABASE INITIALIZATION
-- ═══════════════════════════════════════════════════════════════
-- PostgreSQL 16.6 | Extensions & Configuration
-- ═══════════════════════════════════════════════════════════════

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";      -- UUID generation
CREATE EXTENSION IF NOT EXISTS "pg_trgm";        -- Trigram matching (full-text search)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";       -- Cryptographic functions
CREATE EXTENSION IF NOT EXISTS "btree_gin";      -- GIN index support for btree types
CREATE EXTENSION IF NOT EXISTS "btree_gist";     -- GIST index support for btree types

-- Set timezone to UTC
SET timezone = 'UTC';

-- Performance & security settings
ALTER DATABASE bubblegum SET statement_timeout = '30s';
ALTER DATABASE bubblegum SET lock_timeout = '10s';
ALTER DATABASE bubblegum SET idle_in_transaction_session_timeout = '60s';
ALTER DATABASE bubblegum SET default_transaction_isolation = 'read committed';

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE bubblegum TO bubblegum;
GRANT ALL PRIVILEGES ON SCHEMA public TO bubblegum;

-- Create indexes for common queries (add after Prisma migrations)
-- Example:
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_email ON users(email);
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_projects_user_id ON projects(user_id);

-- Log initialization success
DO $$
BEGIN
  RAISE NOTICE '═══════════════════════════════════════════════════════';
  RAISE NOTICE 'Bubble Gum Database Initialized Successfully!';
  RAISE NOTICE '═══════════════════════════════════════════════════════';
  RAISE NOTICE 'PostgreSQL Version: %', version();
  RAISE NOTICE 'Database: bubblegum';
  RAISE NOTICE 'User: bubblegum';
  RAISE NOTICE 'Timezone: UTC';
  RAISE NOTICE 'Extensions enabled:';
  RAISE NOTICE '  - uuid-ossp (UUID generation)';
  RAISE NOTICE '  - pg_trgm (Full-text search)';
  RAISE NOTICE '  - pgcrypto (Encryption)';
  RAISE NOTICE '  - btree_gin (Advanced indexing)';
  RAISE NOTICE '  - btree_gist (Advanced indexing)';
  RAISE NOTICE '═══════════════════════════════════════════════════════';
END $$;
