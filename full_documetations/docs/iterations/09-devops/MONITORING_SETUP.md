# 📊 BUBBLE GUM - MONITORING & LOGGING SETUP

**Generated:** November 2, 2025  
**Version:** 1.0.0  
**Tools:** Prometheus, Grafana, Loki, Sentry

---

## 📋 TABLE OF CONTENTS

1. [Overview](#overview)
2. [Prometheus Setup](#prometheus-setup)
3. [Grafana Dashboards](#grafana-dashboards)
4. [Loki Logging](#loki-logging)
5. [Sentry Error Tracking](#sentry-error-tracking)
6. [Uptime Monitoring](#uptime-monitoring)
7. [Alerting](#alerting)

---

## 🌐 OVERVIEW

Complete monitoring stack for production:
- **Prometheus** - Metrics collection
- **Grafana** - Visualization
- **Loki** - Log aggregation
- **Sentry** - Error tracking
- **UptimeRobot** - Uptime monitoring

---

## 📊 PROMETHEUS SETUP

### Installation (Docker Compose)

Already included in `docker-compose.yml` with `--profile monitoring`.

```bash
# Start with monitoring
docker-compose --profile monitoring up -d

# Check Prometheus
curl http://localhost:9090
```

### Configuration

Create `monitoring/prometheus.yml`:

```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s
  external_labels:
    cluster: 'production'
    environment: 'production'

scrape_configs:
  - job_name: 'bubblegum-app'
    static_configs:
      - targets: ['app:3000']
    metrics_path: /api/metrics
    
  - job_name: 'postgres'
    static_configs:
      - targets: ['postgres-exporter:9187']
  
  - job_name: 'redis'
    static_configs:
      - targets: ['redis-exporter:9121']
  
  - job_name: 'node'
    static_configs:
      - targets: ['node-exporter:9100']
```

### Next.js Metrics Endpoint

Create `pages/api/metrics.ts`:

```typescript
import { NextApiRequest, NextApiResponse } from 'next';
import { register } from 'prom-client';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader('Content-Type', register.contentType);
  res.send(await register.metrics());
}
```

---

## 📈 GRAFANA DASHBOARDS

### Access Grafana

```
URL: http://localhost:3001
Username: admin
Password: admin (change on first login)
```

### Pre-built Dashboards

#### 1. Application Dashboard

```json
{
  "dashboard": {
    "title": "Bubble Gum Application",
    "panels": [
      {
        "title": "Request Rate",
        "targets": [
          {
            "expr": "rate(http_requests_total[5m])"
          }
        ]
      },
      {
        "title": "Response Time (p95)",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, http_request_duration_seconds_bucket)"
          }
        ]
      }
    ]
  }
}
```

#### 2. Database Dashboard

- Connection pool usage
- Query duration
- Slow queries
- Deadlocks

#### 3. System Dashboard

- CPU usage
- Memory usage
- Disk I/O
- Network traffic

---

## 📝 LOKI LOGGING

### Configuration

Create `monitoring/loki-config.yml`:

```yaml
auth_enabled: false

server:
  http_listen_port: 3100

ingester:
  lifecycler:
    address: 127.0.0.1
    ring:
      kvstore:
        store: inmemory
      replication_factor: 1
    final_sleep: 0s
  chunk_idle_period: 5m
  chunk_retain_period: 30s

schema_config:
  configs:
    - from: 2020-05-15
      store: boltdb
      object_store: filesystem
      schema: v11
      index:
        prefix: index_
        period: 168h

storage_config:
  boltdb:
    directory: /loki/index
  filesystem:
    directory: /loki/chunks

limits_config:
  enforce_metric_name: false
  reject_old_samples: true
  reject_old_samples_max_age: 168h
```

### Application Logging

Add to `lib/logger.ts`:

```typescript
import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-loki',
    options: {
      batching: true,
      interval: 5,
      host: process.env.LOKI_URL || 'http://localhost:3100',
      labels: {
        app: 'bubblegum',
        environment: process.env.NODE_ENV,
      },
    },
  },
});

// Usage
logger.info('User logged in', { userId: '123' });
logger.error('Payment failed', { error, orderId });
```

---

## 🐛 SENTRY ERROR TRACKING

### Setup

```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

### Configuration

`sentry.client.config.ts`:

```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.SENTRY_ENVIRONMENT,
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
});
```

---

## ⏰ UPTIME MONITORING

### UptimeRobot Configuration

1. Sign up at [uptimerobot.com](https://uptimerobot.com)
2. Add monitors:
   - Main site: https://bubblegum.app
   - API: https://bubblegum.app/api/health
   - Check interval: 5 minutes
3. Configure alerts (email, Slack, SMS)

---

## 🚨 ALERTING

### Alert Rules (`monitoring/alerts.yml`)

```yaml
groups:
  - name: application
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
          
      - alert: HighResponseTime
        expr: histogram_quantile(0.95, http_request_duration_seconds_bucket) > 2
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Response time is too high"
```

---

**Monitoring Setup Status:** ✅ Complete  
**Last Updated:** November 2, 2025
