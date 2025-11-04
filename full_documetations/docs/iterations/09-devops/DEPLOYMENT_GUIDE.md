# 🚀 BUBBLE GUM - COMPLETE DEPLOYMENT GUIDE

**Generated:** November 2, 2025  
**Version:** 1.0.0  
**Platforms Covered:** Vercel, AWS, DigitalOcean, Self-Hosted

---

## 📋 TABLE OF CONTENTS

1. [Prerequisites](#prerequisites)
2. [Vercel Deployment](#vercel-deployment)
3. [AWS Deployment](#aws-deployment)
4. [DigitalOcean Deployment](#digitalocean-deployment)
5. [Self-Hosted Deployment](#self-hosted-deployment)
6. [Database Setup](#database-setup)
7. [Domain Configuration](#domain-configuration)
8. [Monitoring & Logging](#monitoring--logging)
9. [Troubleshooting](#troubleshooting)

---

## 🎯 PREREQUISITES

### Required Accounts

- [ ] GitHub account (for CI/CD)
- [ ] Clerk account (authentication)
- [ ] Anthropic account (AI API)
- [ ] Stripe account (payments)
- [ ] AWS account (file storage)
- [ ] Domain name (DNS management)

### Required Tools

```bash
# Node.js & npm
node --version  # v20+
npm --version   # v10+

# Docker (for local testing)
docker --version  # v24+
docker-compose --version  # v2.20+

# Kubernetes (optional, for K8s deployment)
kubectl version  # v1.28+
helm version  # v3.12+

# CLI Tools
vercel --version  # Latest
aws --version  # Latest
doctl version  # Latest
```

### Local Setup

```bash
# Clone repository
git clone https://github.com/your-org/bubblegum.git
cd bubblegum

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your values
nano .env

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Start development server
npm run dev
```

---

## 🎨 VERCEL DEPLOYMENT

### Option 1: Deploy with Vercel CLI

#### 1. Install Vercel CLI

```bash
npm install -g vercel
vercel login
```

#### 2. Link Project

```bash
vercel link
```

**Questions:**
- Set up and deploy "~/bubblegum"? **Yes**
- Which scope? **your-org**
- Link to existing project? **No**
- Project name: **bubblegum**
- Directory: **.** (root)
- Want to override settings? **No**

#### 3. Configure Environment Variables

```bash
# Add environment variables
vercel env add DATABASE_URL production
vercel env add CLERK_SECRET_KEY production
vercel env add ANTHROPIC_API_KEY production
vercel env add STRIPE_SECRET_KEY production

# Add all variables from .env.example
# Repeat for each variable
```

#### 4. Deploy to Production

```bash
# Deploy to production
vercel --prod

# This will:
# 1. Build your application
# 2. Upload to Vercel
# 3. Assign production domain
# 4. Run migrations
```

### Option 2: Deploy with GitHub Integration

#### 1. Connect GitHub Repository

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Import Git Repository"
3. Select your GitHub repo
4. Click "Import"

#### 2. Configure Project

**Framework Preset:** Next.js  
**Root Directory:** `./`  
**Build Command:** `npm run build`  
**Output Directory:** `.next`  
**Install Command:** `npm ci`  
**Development Command:** `npm run dev`

#### 3. Add Environment Variables

In Vercel dashboard:
- Settings → Environment Variables
- Add all variables from `.env.example`
- Set for: Production, Preview, Development

**Required Variables:**
```bash
DATABASE_URL=postgresql://...
CLERK_SECRET_KEY=sk_live_...
ANTHROPIC_API_KEY=sk-ant-...
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
STRIPE_SECRET_KEY=sk_live_...
```

#### 4. Deploy

Click "Deploy" button. Vercel will:
1. Clone your repository
2. Install dependencies
3. Build application
4. Deploy to edge network

#### 5. Run Database Migrations

```bash
# Install Vercel CLI
npm install -g vercel

# Link project
vercel link

# Run migrations
vercel env pull .env.production
npx prisma migrate deploy
```

### Vercel Configuration

Create `vercel.json`:

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm ci",
  "framework": "nextjs",
  "regions": ["iad1", "sfo1"],
  "env": {
    "DATABASE_URL": "@database-url",
    "CLERK_SECRET_KEY": "@clerk-secret"
  },
  "build": {
    "env": {
      "NEXT_PUBLIC_APP_URL": "https://bubblegum.app"
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ],
  "redirects": [
    {
      "source": "/",
      "has": [
        {
          "type": "host",
          "value": "www.bubblegum.app"
        }
      ],
      "destination": "https://bubblegum.app/:path*",
      "permanent": true
    }
  ]
}
```

### Post-Deployment

1. **Add Custom Domain**
   - Settings → Domains
   - Add `bubblegum.app`
   - Add `www.bubblegum.app`
   - Configure DNS (automatic)

2. **Enable Analytics**
   - Analytics → Enable
   - View real-time metrics

3. **Set up Cron Jobs**
   ```json
   {
     "crons": [
       {
         "path": "/api/cron/cleanup",
         "schedule": "0 2 * * *"
       },
       {
         "path": "/api/cron/sync-analytics",
         "schedule": "*/15 * * * *"
       }
     ]
   }
   ```

---

## ☁️ AWS DEPLOYMENT

### Architecture

- **Compute:** ECS Fargate or EC2
- **Database:** RDS PostgreSQL
- **Cache:** ElastiCache Redis
- **Storage:** S3
- **CDN:** CloudFront
- **Load Balancer:** ALB
- **DNS:** Route 53

### Step-by-Step Deployment

#### 1. Setup AWS CLI

```bash
# Install AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Configure credentials
aws configure
# AWS Access Key ID: YOUR_KEY
# AWS Secret Access Key: YOUR_SECRET
# Default region: us-east-1
# Default output format: json
```

#### 2. Create VPC and Subnets

```bash
# Create VPC
aws ec2 create-vpc \
  --cidr-block 10.0.0.0/16 \
  --tag-specifications 'ResourceType=vpc,Tags=[{Key=Name,Value=bubblegum-vpc}]'

# Save VPC ID
VPC_ID=vpc-xxxxx

# Create Internet Gateway
aws ec2 create-internet-gateway \
  --tag-specifications 'ResourceType=internet-gateway,Tags=[{Key=Name,Value=bubblegum-igw}]'

IGW_ID=igw-xxxxx

# Attach to VPC
aws ec2 attach-internet-gateway \
  --vpc-id $VPC_ID \
  --internet-gateway-id $IGW_ID

# Create Public Subnets
aws ec2 create-subnet \
  --vpc-id $VPC_ID \
  --cidr-block 10.0.1.0/24 \
  --availability-zone us-east-1a \
  --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=bubblegum-public-1a}]'

aws ec2 create-subnet \
  --vpc-id $VPC_ID \
  --cidr-block 10.0.2.0/24 \
  --availability-zone us-east-1b \
  --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=bubblegum-public-1b}]'

# Create Private Subnets
aws ec2 create-subnet \
  --vpc-id $VPC_ID \
  --cidr-block 10.0.3.0/24 \
  --availability-zone us-east-1a \
  --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=bubblegum-private-1a}]'

aws ec2 create-subnet \
  --vpc-id $VPC_ID \
  --cidr-block 10.0.4.0/24 \
  --availability-zone us-east-1b \
  --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=bubblegum-private-1b}]'
```

#### 3. Create RDS Database

```bash
# Create DB Subnet Group
aws rds create-db-subnet-group \
  --db-subnet-group-name bubblegum-db-subnet \
  --db-subnet-group-description "Bubble Gum DB Subnet Group" \
  --subnet-ids subnet-xxxxx subnet-yyyyy

# Create RDS Instance
aws rds create-db-instance \
  --db-instance-identifier bubblegum-db \
  --db-instance-class db.t3.medium \
  --engine postgres \
  --engine-version 16.1 \
  --master-username bubblegum \
  --master-user-password 'YOUR_STRONG_PASSWORD' \
  --allocated-storage 100 \
  --storage-type gp3 \
  --storage-encrypted \
  --db-subnet-group-name bubblegum-db-subnet \
  --vpc-security-group-ids sg-xxxxx \
  --backup-retention-period 7 \
  --preferred-backup-window "03:00-04:00" \
  --preferred-maintenance-window "sun:04:00-sun:05:00" \
  --multi-az \
  --publicly-accessible false \
  --tags Key=Name,Value=bubblegum-db

# Wait for instance to be available (5-10 minutes)
aws rds wait db-instance-available \
  --db-instance-identifier bubblegum-db

# Get endpoint
aws rds describe-db-instances \
  --db-instance-identifier bubblegum-db \
  --query 'DBInstances[0].Endpoint.Address' \
  --output text
```

#### 4. Create ElastiCache Redis

```bash
# Create Cache Subnet Group
aws elasticache create-cache-subnet-group \
  --cache-subnet-group-name bubblegum-cache-subnet \
  --cache-subnet-group-description "Bubble Gum Cache Subnet Group" \
  --subnet-ids subnet-xxxxx subnet-yyyyy

# Create Redis Cluster
aws elasticache create-replication-group \
  --replication-group-id bubblegum-redis \
  --replication-group-description "Bubble Gum Redis Cluster" \
  --engine redis \
  --engine-version 7.0 \
  --cache-node-type cache.t3.medium \
  --num-cache-clusters 2 \
  --automatic-failover-enabled \
  --cache-subnet-group-name bubblegum-cache-subnet \
  --security-group-ids sg-xxxxx \
  --at-rest-encryption-enabled \
  --transit-encryption-enabled \
  --snapshot-retention-limit 5 \
  --snapshot-window "03:00-05:00"

# Get endpoint
aws elasticache describe-replication-groups \
  --replication-group-id bubblegum-redis \
  --query 'ReplicationGroups[0].NodeGroups[0].PrimaryEndpoint.Address' \
  --output text
```

#### 5. Create S3 Bucket

```bash
# Create bucket
aws s3api create-bucket \
  --bucket bubblegum-assets \
  --region us-east-1

# Enable versioning
aws s3api put-bucket-versioning \
  --bucket bubblegum-assets \
  --versioning-configuration Status=Enabled

# Enable encryption
aws s3api put-bucket-encryption \
  --bucket bubblegum-assets \
  --server-side-encryption-configuration '{
    "Rules": [{
      "ApplyServerSideEncryptionByDefault": {
        "SSEAlgorithm": "AES256"
      }
    }]
  }'

# Set CORS
aws s3api put-bucket-cors \
  --bucket bubblegum-assets \
  --cors-configuration file://cors.json

# Block public access
aws s3api put-public-access-block \
  --bucket bubblegum-assets \
  --public-access-block-configuration \
    BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true
```

#### 6. Create ECR Repository

```bash
# Create ECR repository
aws ecr create-repository \
  --repository-name bubblegum/app \
  --image-scanning-configuration scanOnPush=true \
  --encryption-configuration encryptionType=AES256

# Get login password
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin \
  ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

# Build and push image
docker build -t bubblegum/app:latest .
docker tag bubblegum/app:latest \
  ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/bubblegum/app:latest
docker push ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/bubblegum/app:latest
```

#### 7. Create ECS Cluster

```bash
# Create cluster
aws ecs create-cluster \
  --cluster-name bubblegum-production \
  --capacity-providers FARGATE FARGATE_SPOT \
  --default-capacity-provider-strategy \
    capacityProvider=FARGATE_SPOT,weight=1 \
    capacityProvider=FARGATE,weight=1,base=1

# Create task definition
aws ecs register-task-definition \
  --cli-input-json file://task-definition.json

# Create service
aws ecs create-service \
  --cluster bubblegum-production \
  --service-name bubblegum-app \
  --task-definition bubblegum-app:1 \
  --desired-count 3 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={
    subnets=[subnet-xxxxx,subnet-yyyyy],
    securityGroups=[sg-xxxxx],
    assignPublicIp=DISABLED
  }" \
  --load-balancers "targetGroupArn=arn:aws:elasticloadbalancing:...,containerName=app,containerPort=3000" \
  --health-check-grace-period-seconds 60
```

#### 8. Create Application Load Balancer

```bash
# Create ALB
aws elbv2 create-load-balancer \
  --name bubblegum-alb \
  --subnets subnet-xxxxx subnet-yyyyy \
  --security-groups sg-xxxxx \
  --scheme internet-facing \
  --type application \
  --ip-address-type ipv4

# Create target group
aws elbv2 create-target-group \
  --name bubblegum-tg \
  --protocol HTTP \
  --port 3000 \
  --vpc-id vpc-xxxxx \
  --target-type ip \
  --health-check-enabled \
  --health-check-protocol HTTP \
  --health-check-path /api/health \
  --health-check-interval-seconds 30 \
  --health-check-timeout-seconds 5 \
  --healthy-threshold-count 2 \
  --unhealthy-threshold-count 3

# Create HTTPS listener
aws elbv2 create-listener \
  --load-balancer-arn arn:aws:elasticloadbalancing:... \
  --protocol HTTPS \
  --port 443 \
  --certificates CertificateArn=arn:aws:acm:... \
  --default-actions Type=forward,TargetGroupArn=arn:aws:elasticloadbalancing:...
```

#### 9. Configure Route 53

```bash
# Create hosted zone
aws route53 create-hosted-zone \
  --name bubblegum.app \
  --caller-reference $(date +%s)

# Create A record for ALB
aws route53 change-resource-record-sets \
  --hosted-zone-id Z... \
  --change-batch file://dns-record.json
```

#### 10. Setup CloudFront CDN

```bash
# Create CloudFront distribution
aws cloudfront create-distribution \
  --distribution-config file://cloudfront-config.json
```

---

## 🌊 DIGITALOCEAN DEPLOYMENT

### Architecture

- **Compute:** Kubernetes (DOKS)
- **Database:** Managed PostgreSQL
- **Storage:** Spaces (S3-compatible)
- **Load Balancer:** Managed Load Balancer
- **DNS:** DigitalOcean DNS

### Step-by-Step Deployment

#### 1. Install doctl CLI

```bash
# Download and install
cd ~
wget https://github.com/digitalocean/doctl/releases/download/v1.100.0/doctl-1.100.0-linux-amd64.tar.gz
tar xf ~/doctl-1.100.0-linux-amd64.tar.gz
sudo mv ~/doctl /usr/local/bin

# Authenticate
doctl auth init
# Enter your API token
```

#### 2. Create Kubernetes Cluster

```bash
# Create cluster
doctl kubernetes cluster create bubblegum-prod \
  --region nyc1 \
  --version 1.28.2-do.0 \
  --size s-2vcpu-4gb \
  --count 3 \
  --auto-upgrade=true \
  --maintenance-window "sunday=02:00" \
  --surge-upgrade=true

# Get kubeconfig
doctl kubernetes cluster kubeconfig save bubblegum-prod

# Verify
kubectl cluster-info
kubectl get nodes
```

#### 3. Create Managed Database

```bash
# Create PostgreSQL cluster
doctl databases create bubblegum-db \
  --engine pg \
  --version 16 \
  --region nyc1 \
  --size db-s-2vcpu-4gb \
  --num-nodes 2

# Wait for database to be ready
doctl databases get bubblegum-db --format Status

# Get connection details
doctl databases connection bubblegum-db \
  --format Host,Port,User,Password,Database
```

#### 4. Create Spaces Bucket

```bash
# Create Space
doctl spaces create bubblegum-assets \
  --region nyc3

# Set CORS
doctl spaces put-cors bubblegum-assets --region nyc3 --cors-rules '[
  {
    "allowed_headers": ["*"],
    "allowed_methods": ["GET", "PUT", "POST", "DELETE"],
    "allowed_origins": ["https://bubblegum.app"],
    "max_age_seconds": 3000
  }
]'

# Generate access keys
doctl spaces keys create bubblegum-spaces-key
```

#### 5. Setup Container Registry

```bash
# Create registry
doctl registry create bubblegum

# Login to registry
doctl registry login

# Build and push image
docker build -t registry.digitalocean.com/bubblegum/app:latest .
docker push registry.digitalocean.com/bubblegum/app:latest
```

#### 6. Deploy to Kubernetes

```bash
# Apply Kubernetes manifests
kubectl apply -f kubernetes-manifests.yml

# Check deployment
kubectl get pods -n bubblegum
kubectl get svc -n bubblegum

# Get load balancer IP
kubectl get svc bubblegum-app-service -n bubblegum \
  -o jsonpath='{.status.loadBalancer.ingress[0].ip}'
```

#### 7. Configure DNS

```bash
# Create domain
doctl compute domain create bubblegum.app

# Add A records
doctl compute domain records create bubblegum.app \
  --record-type A \
  --record-name @ \
  --record-data LOAD_BALANCER_IP \
  --record-ttl 300

doctl compute domain records create bubblegum.app \
  --record-type A \
  --record-name www \
  --record-data LOAD_BALANCER_IP \
  --record-ttl 300
```

#### 8. Setup SSL Certificate

```bash
# Install cert-manager
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

# Create Let's Encrypt issuer
kubectl apply -f - <<EOF
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: admin@bubblegum.app
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx
EOF

# SSL will be automatically provisioned via Ingress
```

---

## 🏠 SELF-HOSTED DEPLOYMENT

### Requirements

- Ubuntu 22.04 LTS server
- 4+ CPU cores
- 8GB+ RAM
- 100GB+ SSD storage
- Static IP address
- Domain name

### Step 1: Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Nginx
sudo apt install nginx -y

# Install Certbot
sudo apt install certbot python3-certbot-nginx -y
```

### Step 2: Clone and Configure

```bash
# Clone repository
git clone https://github.com/your-org/bubblegum.git
cd bubblegum

# Copy environment file
cp .env.example .env

# Edit environment variables
nano .env
# Fill in all production values

# Generate secrets
openssl rand -hex 32  # For SESSION_SECRET
openssl rand -hex 32  # For WEBHOOK_SECRET
```

### Step 3: Start Services

```bash
# Start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f app
```

### Step 4: Configure Nginx

```bash
# Create Nginx config
sudo nano /etc/nginx/sites-available/bubblegum
```

```nginx
server {
    listen 80;
    server_name bubblegum.app www.bubblegum.app;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/bubblegum /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Step 5: Setup SSL

```bash
# Get SSL certificate
sudo certbot --nginx -d bubblegum.app -d www.bubblegum.app

# Auto-renewal
sudo certbot renew --dry-run
```

### Step 6: Run Migrations

```bash
# Run database migrations
docker-compose exec app npx prisma migrate deploy

# Seed database (optional)
docker-compose exec app npx prisma db seed
```

---

## 📚 COMPLETE DEPLOYMENT GUIDE ENDS HERE

For monitoring, logging, and troubleshooting, see MONITORING_SETUP.md

**Status:** ✅ Complete  
**Last Updated:** November 2, 2025
