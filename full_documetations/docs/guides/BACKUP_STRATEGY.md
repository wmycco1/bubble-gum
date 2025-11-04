# 💾 Backup Strategy - Bubble Gum

Complete backup and disaster recovery plan.

---

## 🎯 Backup Goals

- **RPO (Recovery Point Objective):** <1 hour
- **RTO (Recovery Time Objective):** <4 hours
- **Data Retention:** 30 days
- **Backup Frequency:** Every 6 hours
- **Backup Location:** Multi-region

---

## 📦 What to Backup

### Critical Data
- ✅ PostgreSQL database
- ✅ User uploads (S3)
- ✅ Redis cache (optional)
- ✅ Configuration files
- ✅ Environment variables

### Not Backed Up
- ❌ Build artifacts
- ❌ node_modules
- ❌ Temporary files
- ❌ Logs (archived separately)

---

## 🗄️ Database Backups

### Automated PostgreSQL Backups

```bash
#!/bin/bash
# scripts/backup-db.sh

DATE=$(date +%Y-%m-%d_%H-%M-%S)
BACKUP_DIR="/backups/postgresql"
BUCKET="s3://bubblegum-backups/db"

# Create backup
pg_dump $DATABASE_URL | gzip > "$BACKUP_DIR/backup_$DATE.sql.gz"

# Upload to S3
aws s3 cp "$BACKUP_DIR/backup_$DATE.sql.gz" "$BUCKET/"

# Clean old backups (keep 30 days)
find $BACKUP_DIR -type f -mtime +30 -delete

echo "Backup completed: backup_$DATE.sql.gz"
```

### Cron Schedule

```cron
# Backup every 6 hours
0 */6 * * * /scripts/backup-db.sh >> /var/log/backup.log 2>&1
```

### Manual Backup

```bash
# Full backup
pg_dump $DATABASE_URL > backup.sql

# Compressed
pg_dump $DATABASE_URL | gzip > backup.sql.gz

# Specific tables
pg_dump -t users -t pages $DATABASE_URL > backup.sql
```

---

## ☁️ S3 Backups

### Sync to Backup Bucket

```bash
#!/bin/bash
# scripts/backup-s3.sh

SOURCE_BUCKET="s3://bubblegum-uploads"
BACKUP_BUCKET="s3://bubblegum-backups/uploads"

# Sync to backup bucket
aws s3 sync $SOURCE_BUCKET $BACKUP_BUCKET \
  --storage-class GLACIER \
  --exclude "*" \
  --include "*.jpg" \
  --include "*.png" \
  --include "*.pdf"

echo "S3 backup completed"
```

### S3 Versioning

```bash
# Enable versioning
aws s3api put-bucket-versioning \
  --bucket bubblegum-uploads \
  --versioning-configuration Status=Enabled

# Lifecycle policy
aws s3api put-bucket-lifecycle-configuration \
  --bucket bubblegum-uploads \
  --lifecycle-configuration file://lifecycle.json
```

**lifecycle.json:**
```json
{
  "Rules": [
    {
      "Id": "Archive old versions",
      "Status": "Enabled",
      "NoncurrentVersionTransitions": [
        {
          "NoncurrentDays": 30,
          "StorageClass": "GLACIER"
        }
      ],
      "NoncurrentVersionExpiration": {
        "NoncurrentDays": 90
      }
    }
  ]
}
```

---

## 🔄 Restore Procedures

### Database Restore

```bash
# Download backup
aws s3 cp s3://bubblegum-backups/db/backup_latest.sql.gz .

# Decompress
gunzip backup_latest.sql.gz

# Restore
psql $DATABASE_URL < backup_latest.sql

# Or with pg_restore
pg_restore -d $DATABASE_URL backup_latest.dump
```

### S3 Restore

```bash
# Restore specific file
aws s3 cp s3://bubblegum-backups/uploads/file.jpg \
  s3://bubblegum-uploads/file.jpg

# Restore all files
aws s3 sync s3://bubblegum-backups/uploads/ \
  s3://bubblegum-uploads/
```

---

## 🧪 Backup Testing

### Monthly Test Restore

```bash
#!/bin/bash
# scripts/test-restore.sh

# Download latest backup
aws s3 cp s3://bubblegum-backups/db/backup_latest.sql.gz /tmp/

# Create test database
createdb bubblegum_test

# Restore
gunzip -c /tmp/backup_latest.sql.gz | psql bubblegum_test

# Verify data
psql bubblegum_test -c "SELECT COUNT(*) FROM users;"

# Cleanup
dropdb bubblegum_test

echo "Backup test successful"
```

---

## 📊 Monitoring

### Backup Status Dashboard

```typescript
// app/api/admin/backup-status/route.ts
export async function GET() {
  const lastBackup = await getLastBackupTime();
  const backupSize = await getBackupSize();
  const status = lastBackup > Date.now() - 7200000 ? 'healthy' : 'warning';

  return NextResponse.json({
    status,
    lastBackup,
    size: backupSize,
    nextBackup: calculateNextBackup(),
  });
}
```

### Alerts

```yaml
# monitoring/alerts.yml
alerts:
  - name: BackupFailed
    condition: backup_age > 8 hours
    action: send_email
    recipients:
      - ops@bubblegum.app
```

---

## ✅ Backup Checklist

- [ ] Automated backups running
- [ ] Backups tested monthly
- [ ] Multi-region storage
- [ ] Encrypted backups
- [ ] Documented restore procedures
- [ ] Monitoring alerts configured
- [ ] Team trained on recovery

---

**Backup Strategy Complete! 💾**
