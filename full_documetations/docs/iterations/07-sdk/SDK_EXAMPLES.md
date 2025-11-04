# 💻 BUBBLE GUM - SDK EXAMPLES

**Generated:** November 1, 2025  
**Version:** 1.0.0  
**Languages:** JavaScript, TypeScript, Python, cURL

---

## 📋 TABLE OF CONTENTS

1. [JavaScript/TypeScript SDK](#javascripttypescript-sdk)
2. [Python SDK](#python-sdk)
3. [cURL Examples](#curl-examples)
4. [Common Patterns](#common-patterns)

---

## 🟨 JAVASCRIPT/TYPESCRIPT SDK

### Installation

```bash
npm install @bubblegum/sdk
# or
pnpm add @bubblegum/sdk
# or
yarn add @bubblegum/sdk
```

### Setup

```typescript
import { BubbleGumClient } from '@bubblegum/sdk';

const client = new BubbleGumClient({
  apiKey: process.env.BUBBLEGUM_API_KEY,
  // Optional: custom base URL
  baseUrl: 'https://api.bubblegum.app',
});
```

### Authentication

```typescript
// With Clerk session token
import { useAuth } from '@clerk/nextjs';

const { getToken } = useAuth();
const token = await getToken();

const client = new BubbleGumClient({
  token, // Session token
});
```

---

### Projects

#### List Projects

```typescript
const projects = await client.projects.list({
  organizationId: 'org_abc123',
});

console.log(projects);
// [{
//   id: 'proj_123',
//   name: 'My Portfolio',
//   slug: 'my-portfolio',
//   status: 'PUBLISHED',
//   ...
// }]
```

#### Create Project

```typescript
const project = await client.projects.create({
  organizationId: 'org_abc123',
  name: 'My New Site',
  slug: 'my-new-site',
  description: 'A beautiful website',
  template: 'portfolio', // Optional
});

console.log(`Created project: ${project.id}`);
```

#### Update Project

```typescript
const project = await client.projects.update('proj_123', {
  name: 'Updated Name',
  customDomain: 'example.com',
  metaTitle: 'My Site',
});
```

#### Publish Project

```typescript
const project = await client.projects.publish('proj_123');

console.log(`Published at: ${project.subdomain}`);
// "Published at: my-site.bubblegum.app"
```

#### Delete Project

```typescript
await client.projects.delete('proj_123');
```

---

### Pages

#### List Pages

```typescript
const pages = await client.pages.list({
  projectId: 'proj_123',
});
```

#### Create Page

```typescript
const page = await client.pages.create({
  projectId: 'proj_123',
  name: 'About',
  slug: '/about',
  content: {
    components: [
      {
        id: 'hero_1',
        type: 'Hero',
        props: {
          title: 'About Us',
          subtitle: 'Learn more',
        },
      },
    ],
  },
});
```

#### Update Page

```typescript
const page = await client.pages.update('page_123', {
  name: 'About Us',
  content: {
    components: [
      // Updated components
    ],
  },
  metaTitle: 'About Us - My Site',
  metaDescription: 'Learn more about us',
});
```

#### Duplicate Page

```typescript
const duplicate = await client.pages.duplicate('page_123');
```

---

### Assets

#### List Assets

```typescript
const assets = await client.assets.list({
  organizationId: 'org_abc123',
  type: 'IMAGE', // Optional filter
});
```

#### Upload Asset

```typescript
// Get upload URL
const { uploadUrl, assetUrl, key } = await client.assets.getUploadUrl({
  organizationId: 'org_abc123',
  fileName: 'hero-image.jpg',
  fileType: 'image/jpeg',
});

// Upload file
const file = await fs.readFile('hero-image.jpg');
await fetch(uploadUrl, {
  method: 'PUT',
  body: file,
  headers: {
    'Content-Type': 'image/jpeg',
  },
});

// Confirm upload
const asset = await client.assets.confirmUpload({
  organizationId: 'org_abc123',
  name: 'Hero Image',
  type: 'IMAGE',
  url: assetUrl,
  key,
  size: file.length,
  mimeType: 'image/jpeg',
  width: 1920,
  height: 1080,
});

console.log(`Asset uploaded: ${asset.url}`);
```

#### Delete Asset

```typescript
await client.assets.delete('asset_123');
```

---

### Analytics

#### Dashboard Summary

```typescript
const summary = await client.analytics.getDashboardSummary({
  projectId: 'proj_123',
});

console.log(`Total views: ${summary.totalViews}`);
console.log(`Unique visitors: ${summary.uniqueVisitors}`);
console.log(`Change: ${summary.viewsChange}%`);
```

#### Top Pages

```typescript
const topPages = await client.analytics.getTopPages({
  projectId: 'proj_123',
  limit: 10,
  period: '30d',
});

topPages.forEach((page) => {
  console.log(`${page.path}: ${page.views} views`);
});
```

#### Traffic Sources

```typescript
const sources = await client.analytics.getTrafficSources({
  projectId: 'proj_123',
  limit: 10,
});
```

#### Geography

```typescript
const geo = await client.analytics.getGeography({
  projectId: 'proj_123',
  limit: 10,
});
```

---

### Forms

#### List Form Submissions

```typescript
const { submissions, total } = await client.forms.listSubmissions({
  projectId: 'proj_123',
  formId: 'form_contact', // Optional filter
  limit: 50,
  offset: 0,
});

submissions.forEach((sub) => {
  console.log(`${sub.data.name}: ${sub.data.email}`);
});
```

#### Export Submissions

```typescript
const { data } = await client.forms.exportSubmissions({
  projectId: 'proj_123',
  formId: 'form_contact',
});

// Convert to CSV
const csv = convertToCSV(data);
fs.writeFileSync('submissions.csv', csv);
```

---

### AI

#### Generate Site

```typescript
const site = await client.ai.generateSite({
  organizationId: 'org_abc123',
  prompt: 'Create a modern portfolio for a photographer',
  businessType: 'portfolio',
  colorScheme: 'dark',
  numberOfPages: 3,
});

console.log(`Generated ${site.pages.length} pages`);
```

#### AI Chat

```typescript
const response = await client.ai.chat({
  projectId: 'proj_123',
  message: 'How can I improve my hero section?',
});

console.log(response.message);
response.suggestions.forEach((s) => console.log(`- ${s}`));
```

---

### Products (E-commerce)

#### List Products

```typescript
const { products, total } = await client.products.list({
  organizationId: 'org_abc123',
  isPublished: true,
  limit: 50,
  offset: 0,
});
```

#### Create Product

```typescript
const product = await client.products.create({
  organizationId: 'org_abc123',
  name: 'Awesome T-Shirt',
  slug: 'awesome-tshirt',
  description: 'Super comfy shirt',
  price: 2999, // $29.99 in cents
  compareAtPrice: 3999, // $39.99
  sku: 'TSHIRT-001',
  quantity: 100,
  images: ['https://example.com/shirt.jpg'],
});
```

#### Add Product Variant

```typescript
const variant = await client.products.addVariant({
  productId: 'prod_123',
  name: 'Medium / Red',
  sku: 'TSHIRT-001-M-RED',
  price: 2999,
  quantity: 50,
  options: {
    size: 'M',
    color: 'Red',
  },
});
```

---

### Orders (E-commerce)

#### List Orders

```typescript
const { orders, total } = await client.orders.list({
  organizationId: 'org_abc123',
  paymentStatus: 'paid', // Optional filter
  limit: 50,
});
```

#### Get Order

```typescript
const order = await client.orders.get('order_123');

console.log(`Order ${order.orderNumber}`);
console.log(`Total: $${order.total / 100}`);
order.items.forEach((item) => {
  console.log(`- ${item.name} x${item.quantity}`);
});
```

#### Update Order Status

```typescript
await client.orders.updateStatus('order_123', {
  fulfillmentStatus: 'shipped',
});
```

#### Order Statistics

```typescript
const stats = await client.orders.getStats({
  organizationId: 'org_abc123',
  startDate: new Date('2025-01-01'),
  endDate: new Date('2025-01-31'),
});

console.log(`Total revenue: $${stats.totalRevenue / 100}`);
console.log(`Total orders: ${stats.totalOrders}`);
console.log(`Average order: $${stats.averageOrderValue / 100}`);
console.log(`Conversion rate: ${stats.conversionRate}%`);
```

---

### Blog

#### List Posts

```typescript
const { posts, total } = await client.blog.listPosts({
  organizationId: 'org_abc123',
  isPublished: true,
  limit: 20,
  offset: 0,
});
```

#### Create Post

```typescript
const post = await client.blog.createPost({
  organizationId: 'org_abc123',
  title: 'My First Post',
  slug: 'my-first-post',
  excerpt: 'This is an excerpt',
  content: '# Hello World\n\nThis is my first post!',
  featuredImage: 'https://example.com/image.jpg',
  categoryIds: ['cat_123'],
  tagIds: ['tag_456'],
});
```

#### Publish Post

```typescript
await client.blog.updatePost('post_123', {
  isPublished: true,
});
```

---

### Error Handling

```typescript
try {
  const project = await client.projects.create({ ... });
} catch (error) {
  if (error.code === 'FORBIDDEN') {
    console.error('Project limit reached');
  } else if (error.code === 'CONFLICT') {
    console.error('Slug already exists');
  } else {
    console.error('Error:', error.message);
  }
}
```

---

### Pagination

```typescript
async function fetchAllProjects(organizationId: string) {
  let offset = 0;
  const limit = 50;
  const allProjects = [];

  while (true) {
    const { projects, total } = await client.projects.list({
      organizationId,
      limit,
      offset,
    });

    allProjects.push(...projects);

    if (offset + projects.length >= total) {
      break;
    }

    offset += limit;
  }

  return allProjects;
}
```

---

## 🐍 PYTHON SDK

### Installation

```bash
pip install bubblegum-sdk
```

### Setup

```python
from bubblegum import BubbleGumClient

client = BubbleGumClient(
    api_key=os.environ['BUBBLEGUM_API_KEY'],
    # Optional: custom base URL
    base_url='https://api.bubblegum.app'
)
```

---

### Projects

```python
# List projects
projects = client.projects.list(organization_id='org_abc123')

# Create project
project = client.projects.create(
    organization_id='org_abc123',
    name='My New Site',
    slug='my-new-site',
    description='A beautiful website'
)

# Update project
project = client.projects.update(
    'proj_123',
    name='Updated Name',
    custom_domain='example.com'
)

# Publish project
project = client.projects.publish('proj_123')
print(f"Published at: {project.subdomain}")

# Delete project
client.projects.delete('proj_123')
```

---

### Pages

```python
# List pages
pages = client.pages.list(project_id='proj_123')

# Create page
page = client.pages.create(
    project_id='proj_123',
    name='About',
    slug='/about',
    content={
        'components': [
            {
                'id': 'hero_1',
                'type': 'Hero',
                'props': {
                    'title': 'About Us',
                    'subtitle': 'Learn more'
                }
            }
        ]
    }
)

# Update page
page = client.pages.update(
    'page_123',
    name='About Us',
    content={'components': [...]},
    meta_title='About Us - My Site'
)

# Duplicate page
duplicate = client.pages.duplicate('page_123')
```

---

### Assets

```python
# List assets
assets = client.assets.list(
    organization_id='org_abc123',
    type='IMAGE'  # Optional filter
)

# Upload asset
upload_info = client.assets.get_upload_url(
    organization_id='org_abc123',
    file_name='hero-image.jpg',
    file_type='image/jpeg'
)

# Upload file to upload_url
with open('hero-image.jpg', 'rb') as f:
    requests.put(
        upload_info['upload_url'],
        data=f,
        headers={'Content-Type': 'image/jpeg'}
    )

# Confirm upload
asset = client.assets.confirm_upload(
    organization_id='org_abc123',
    name='Hero Image',
    type='IMAGE',
    url=upload_info['asset_url'],
    key=upload_info['key'],
    size=os.path.getsize('hero-image.jpg'),
    mime_type='image/jpeg',
    width=1920,
    height=1080
)

print(f"Asset uploaded: {asset.url}")
```

---

### Analytics

```python
# Dashboard summary
summary = client.analytics.get_dashboard_summary(
    project_id='proj_123'
)

print(f"Total views: {summary['total_views']}")
print(f"Unique visitors: {summary['unique_visitors']}")
print(f"Change: {summary['views_change']}%")

# Top pages
top_pages = client.analytics.get_top_pages(
    project_id='proj_123',
    limit=10,
    period='30d'
)

for page in top_pages:
    print(f"{page['path']}: {page['views']} views")

# Traffic sources
sources = client.analytics.get_traffic_sources(
    project_id='proj_123',
    limit=10
)

# Geography
geo = client.analytics.get_geography(
    project_id='proj_123',
    limit=10
)
```

---

### Forms

```python
# List form submissions
result = client.forms.list_submissions(
    project_id='proj_123',
    form_id='form_contact',  # Optional
    limit=50,
    offset=0
)

for submission in result['submissions']:
    print(f"{submission['data']['name']}: {submission['data']['email']}")

# Export submissions
data = client.forms.export_submissions(
    project_id='proj_123',
    form_id='form_contact'
)

# Convert to CSV
import csv
with open('submissions.csv', 'w') as f:
    writer = csv.DictWriter(f, fieldnames=data[0].keys())
    writer.writeheader()
    writer.writerows(data)
```

---

### Products

```python
# List products
result = client.products.list(
    organization_id='org_abc123',
    is_published=True,
    limit=50
)

# Create product
product = client.products.create(
    organization_id='org_abc123',
    name='Awesome T-Shirt',
    slug='awesome-tshirt',
    description='Super comfy shirt',
    price=2999,  # $29.99 in cents
    compare_at_price=3999,
    sku='TSHIRT-001',
    quantity=100,
    images=['https://example.com/shirt.jpg']
)

# Add variant
variant = client.products.add_variant(
    product_id='prod_123',
    name='Medium / Red',
    sku='TSHIRT-001-M-RED',
    price=2999,
    quantity=50,
    options={'size': 'M', 'color': 'Red'}
)
```

---

### Orders

```python
# List orders
result = client.orders.list(
    organization_id='org_abc123',
    payment_status='paid',
    limit=50
)

# Get order
order = client.orders.get('order_123')
print(f"Order {order['order_number']}")
print(f"Total: ${order['total'] / 100:.2f}")

# Update status
client.orders.update_status(
    'order_123',
    fulfillment_status='shipped'
)

# Order statistics
stats = client.orders.get_stats(
    organization_id='org_abc123',
    start_date=datetime(2025, 1, 1),
    end_date=datetime(2025, 1, 31)
)

print(f"Total revenue: ${stats['total_revenue'] / 100:.2f}")
print(f"Total orders: {stats['total_orders']}")
```

---

### Error Handling

```python
from bubblegum.exceptions import (
    ForbiddenError,
    NotFoundError,
    ConflictError,
    APIError
)

try:
    project = client.projects.create(...)
except ForbiddenError:
    print('Project limit reached')
except ConflictError:
    print('Slug already exists')
except NotFoundError:
    print('Resource not found')
except APIError as e:
    print(f'API error: {e.message}')
```

---

## 🌐 cURL EXAMPLES

### Authentication

```bash
export TOKEN="your_clerk_session_token"
export BASE_URL="https://api.bubblegum.app"
```

---

### Projects

```bash
# List projects
curl -X GET "$BASE_URL/projects?organizationId=org_abc123" \
  -H "Authorization: Bearer $TOKEN"

# Create project
curl -X POST "$BASE_URL/projects" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "organizationId": "org_abc123",
    "name": "My New Site",
    "slug": "my-new-site",
    "description": "A beautiful website"
  }'

# Update project
curl -X PATCH "$BASE_URL/projects/proj_123" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Name",
    "customDomain": "example.com"
  }'

# Publish project
curl -X POST "$BASE_URL/projects/proj_123/publish" \
  -H "Authorization: Bearer $TOKEN"

# Delete project
curl -X DELETE "$BASE_URL/projects/proj_123" \
  -H "Authorization: Bearer $TOKEN"
```

---

### Pages

```bash
# List pages
curl -X GET "$BASE_URL/pages?projectId=proj_123" \
  -H "Authorization: Bearer $TOKEN"

# Create page
curl -X POST "$BASE_URL/pages" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": "proj_123",
    "name": "About",
    "slug": "/about",
    "content": {
      "components": []
    }
  }'

# Update page
curl -X PATCH "$BASE_URL/pages/page_123" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "About Us",
    "metaTitle": "About Us - My Site"
  }'
```

---

### Analytics

```bash
# Dashboard summary
curl -X GET "$BASE_URL/analytics/proj_123/summary" \
  -H "Authorization: Bearer $TOKEN"

# Top pages
curl -X GET "$BASE_URL/analytics/proj_123/top-pages?limit=10&period=30d" \
  -H "Authorization: Bearer $TOKEN"

# Traffic sources
curl -X GET "$BASE_URL/analytics/proj_123/traffic-sources?limit=10" \
  -H "Authorization: Bearer $TOKEN"
```

---

### Products

```bash
# List products
curl -X GET "$BASE_URL/products?organizationId=org_abc123&isPublished=true" \
  -H "Authorization: Bearer $TOKEN"

# Create product
curl -X POST "$BASE_URL/products" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "organizationId": "org_abc123",
    "name": "Awesome T-Shirt",
    "slug": "awesome-tshirt",
    "price": 2999,
    "quantity": 100
  }'
```

---

### Orders

```bash
# List orders
curl -X GET "$BASE_URL/orders?organizationId=org_abc123&paymentStatus=paid" \
  -H "Authorization: Bearer $TOKEN"

# Get order
curl -X GET "$BASE_URL/orders/order_123" \
  -H "Authorization: Bearer $TOKEN"

# Update status
curl -X PATCH "$BASE_URL/orders/order_123" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fulfillmentStatus": "shipped"
  }'
```

---

## 🎨 COMMON PATTERNS

### Complete Site Generation Flow

```typescript
// 1. Create organization (if needed)
const org = await client.organizations.create({
  name: 'My Company',
  slug: 'my-company',
});

// 2. Generate site with AI
const site = await client.ai.generateSite({
  organizationId: org.id,
  prompt: 'Create a modern portfolio for a photographer',
  businessType: 'portfolio',
  numberOfPages: 3,
});

// 3. Create project
const project = await client.projects.create({
  organizationId: org.id,
  name: 'Photographer Portfolio',
  slug: 'photographer-portfolio',
});

// 4. Create pages from AI generation
for (const pageData of site.pages) {
  await client.pages.create({
    projectId: project.id,
    name: pageData.name,
    slug: pageData.slug,
    content: pageData.content,
  });
}

// 5. Publish project
await client.projects.publish(project.id);

console.log(`Site live at: ${project.subdomain}`);
```

---

### E-commerce Setup

```typescript
// 1. Create products
const products = await Promise.all([
  client.products.create({
    organizationId: 'org_abc123',
    name: 'T-Shirt',
    slug: 'tshirt',
    price: 2999,
    quantity: 100,
    images: ['https://example.com/tshirt.jpg'],
  }),
  client.products.create({
    organizationId: 'org_abc123',
    name: 'Hoodie',
    slug: 'hoodie',
    price: 4999,
    quantity: 50,
    images: ['https://example.com/hoodie.jpg'],
  }),
]);

// 2. Add variants
await client.products.addVariant({
  productId: products[0].id,
  name: 'Small',
  options: { size: 'S' },
  quantity: 30,
});

await client.products.addVariant({
  productId: products[0].id,
  name: 'Medium',
  options: { size: 'M' },
  quantity: 40,
});

await client.products.addVariant({
  productId: products[0].id,
  name: 'Large',
  options: { size: 'L' },
  quantity: 30,
});

// 3. Monitor orders
setInterval(async () => {
  const { orders } = await client.orders.list({
    organizationId: 'org_abc123',
    paymentStatus: 'paid',
    limit: 10,
  });

  for (const order of orders) {
    if (order.fulfillmentStatus === 'unfulfilled') {
      console.log(`New order: ${order.orderNumber}`);
      // Process order...
    }
  }
}, 60000); // Check every minute
```

---

### Analytics Dashboard

```typescript
async function buildAnalyticsDashboard(projectId: string) {
  const [summary, topPages, sources, geo] = await Promise.all([
    client.analytics.getDashboardSummary({ projectId }),
    client.analytics.getTopPages({ projectId, limit: 10 }),
    client.analytics.getTrafficSources({ projectId, limit: 10 }),
    client.analytics.getGeography({ projectId, limit: 10 }),
  ]);

  return {
    overview: {
      totalViews: summary.totalViews,
      uniqueVisitors: summary.uniqueVisitors,
      formSubmissions: summary.formSubmissions,
      change: summary.viewsChange,
    },
    topPages,
    trafficSources: sources,
    geography: geo,
  };
}

const dashboard = await buildAnalyticsDashboard('proj_123');
console.log(JSON.stringify(dashboard, null, 2));
```

---

## 🔗 RELATED DOCUMENTS

- **API_DOCUMENTATION.md** - Complete API reference
- **WEBHOOK_DOCUMENTATION.md** - Webhook events
- **INTEGRATION_GUIDE.md** - Integration guide

---

**SDK Examples Status:** ✅ Complete  
**Last Updated:** November 1, 2025  
**Version:** 1.0.0

---

*This SDK documentation provides examples in JavaScript/TypeScript, Python, and cURL for all Bubble Gum API endpoints.*
