# 🪝 BUBBLE GUM - WEBHOOK DOCUMENTATION

**Generated:** November 1, 2025  
**Version:** 1.0.0

---

## 📋 OVERVIEW

Webhooks allow you to receive real-time notifications when events occur in Bubble Gum.

### Key Features
- ✅ Real-time event notifications
- ✅ HMAC SHA-256 signature verification
- ✅ Automatic retries with exponential backoff
- ✅ 20+ event types

---

## 📡 WEBHOOK EVENTS

### Project Events
- `project.created` - New project created
- `project.updated` - Project settings changed
- `project.published` - Project goes live
- `project.deleted` - Project removed

### Page Events
- `page.created` - New page added
- `page.updated` - Page content changed
- `page.deleted` - Page removed

### Form Events
- `form.submitted` - Form submission received

### E-commerce Events
- `order.created` - New order placed
- `order.paid` - Payment successful
- `order.fulfilled` - Order fulfilled
- `order.shipped` - Order shipped

### Blog Events
- `blog.post_published` - Blog post published
- `blog.comment_created` - New comment

---

## 📦 PAYLOAD STRUCTURE

```json
{
  "id": "evt_abc123",
  "type": "project.created",
  "createdAt": "2025-11-01T12:00:00Z",
  "data": {
    "project": {
      "id": "proj_abc123",
      "name": "My Portfolio",
      "status": "DRAFT"
    }
  },
  "organization": {
    "id": "org_abc123",
    "name": "Acme Inc."
  }
}
```

---

## 🔒 SECURITY

### HMAC Signature Verification

**Node.js:**
```javascript
const crypto = require('crypto');

function verifySignature(payload, signature, secret) {
  const expected = signature.replace('sha256=', '');
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(JSON.stringify(payload));
  const calculated = hmac.digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(expected),
    Buffer.from(calculated)
  );
}
```

**Python:**
```python
import hmac
import hashlib
import json

def verify_signature(payload, signature, secret):
    expected = signature.replace('sha256=', '')
    payload_str = json.dumps(payload, separators=(',', ':'))
    calculated = hmac.new(
        secret.encode(),
        payload_str.encode(),
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(expected, calculated)
```

---

## 🛠️ SETUP GUIDE

### 1. Create Webhook

```bash
curl -X POST https://api.bubblegum.app/v1/webhooks \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "organizationId": "org_abc123",
    "url": "https://your-app.com/webhooks/bubblegum",
    "events": ["project.created", "form.submitted"],
    "secret": "your_webhook_secret"
  }'
```

### 2. Handle Webhook

**Node.js + Express:**
```javascript
app.post('/webhooks/bubblegum', express.json(), (req, res) => {
  const signature = req.headers['x-signature'];
  const secret = process.env.WEBHOOK_SECRET;
  
  if (!verifySignature(req.body, signature, secret)) {
    return res.status(401).send('Invalid signature');
  }
  
  const event = req.body;
  
  switch (event.type) {
    case 'project.created':
      console.log('New project:', event.data.project.name);
      break;
    case 'form.submitted':
      console.log('Form submission:', event.data.submission);
      break;
  }
  
  res.status(200).send('OK');
});
```

---

## 🔄 RETRY POLICY

| Attempt | Delay |
|---------|-------|
| 1 | Immediate |
| 2 | 1 minute |
| 3 | 5 minutes |
| 4 | 15 minutes |

---

## 📚 BEST PRACTICES

1. **Respond quickly** - Return 200 OK within 5 seconds
2. **Process asynchronously** - Queue events for background processing
3. **Verify signatures** - Always verify HMAC signature
4. **Handle duplicates** - Use event.id to deduplicate
5. **Log everything** - Keep logs for debugging

---

**Status:** ✅ Complete  
**Last Updated:** November 1, 2025
