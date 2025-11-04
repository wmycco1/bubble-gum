# 🔐 SECURITY TESTING PROCEDURES

**Generated:** November 2, 2025  
**Framework:** OWASP Top 10  
**Tools:** OWASP ZAP, Burp Suite, npm audit

---

## 📋 TABLE OF CONTENTS

1. [OWASP Top 10](#owasp-top-10)
2. [Authentication Testing](#authentication-testing)
3. [Authorization Testing](#authorization-testing)
4. [Input Validation](#input-validation)
5. [Security Scanning Tools](#security-scanning-tools)

---

## 🛡️ OWASP TOP 10

### A01: Broken Access Control

**Tests:**
- [ ] Access other user's data by changing ID in URL
- [ ] Bypass authorization by manipulating tokens
- [ ] Access admin functions as regular user
- [ ] IDOR (Insecure Direct Object References)

**Example Test:**
```bash
# Try accessing another user's page
curl https://bubblegum.app/api/pages/other-user-page-id \
  -H "Authorization: Bearer YOUR_TOKEN"
  
# Expected: 403 Forbidden
```

---

### A02: Cryptographic Failures

**Tests:**
- [ ] Passwords stored as plaintext (should be hashed)
- [ ] Sensitive data in URL parameters
- [ ] Weak encryption algorithms
- [ ] Missing HTTPS enforcement

**Example Test:**
```bash
# Check HTTPS redirect
curl -I http://bubblegum.app
# Expected: 301 Moved Permanently to https://

# Check database
psql -c "SELECT password FROM users LIMIT 1"
# Expected: Hashed password (bcrypt/argon2)
```

---

### A03: Injection

**Tests:**
- [ ] SQL Injection
- [ ] NoSQL Injection
- [ ] Command Injection
- [ ] XSS (Cross-Site Scripting)

**SQL Injection Test:**
```bash
# Try SQL injection in login
curl -X POST https://bubblegum.app/api/auth/signin \
  -d "email=' OR '1'='1&password=anything"
  
# Expected: Invalid credentials (not SQL error)
```

**XSS Test:**
```javascript
// Try injecting script in form
const maliciousInput = '<script>alert("XSS")</script>';

// Submit to page title
await page.fill('[name="title"]', maliciousInput);
await page.click('button:has-text("Save")');

// Check if script executes
const title = await page.locator('h1').textContent();
expect(title).toBe('<script>alert("XSS")</script>'); // Escaped
```

---

### A04: Insecure Design

**Tests:**
- [ ] No rate limiting on login
- [ ] Missing CAPTCHA on signup
- [ ] Weak password requirements
- [ ] No account lockout after failed attempts

**Rate Limiting Test:**
```bash
# Try 100 login attempts
for i in {1..100}; do
  curl -X POST https://bubblegum.app/api/auth/signin \
    -d "email=test@test.com&password=wrong"
done

# Expected: Rate limit error after ~10 attempts
```

---

### A05: Security Misconfiguration

**Tests:**
- [ ] Verbose error messages exposing internals
- [ ] Default credentials still active
- [ ] Unnecessary features enabled
- [ ] Missing security headers

**Security Headers Test:**
```bash
curl -I https://bubblegum.app

# Expected headers:
# Strict-Transport-Security: max-age=31536000
# X-Frame-Options: DENY
# X-Content-Type-Options: nosniff
# Content-Security-Policy: default-src 'self'
# X-XSS-Protection: 1; mode=block
```

---

### A06: Vulnerable Components

**Tests:**
- [ ] Outdated dependencies
- [ ] Known vulnerabilities
- [ ] Unused dependencies

**Dependency Scan:**
```bash
# npm audit
npm audit
npm audit fix

# Check outdated packages
npm outdated

# Use Snyk
npx snyk test
npx snyk monitor
```

---

### A07: Authentication Failures

**Tests:**
- [ ] Brute force attack possible
- [ ] Weak password accepted
- [ ] Session fixation
- [ ] Missing MFA
- [ ] Session doesn't expire

**Password Strength Test:**
```bash
# Try weak passwords
curl -X POST https://bubblegum.app/api/auth/signup \
  -d "email=test@test.com&password=123"
  
# Expected: Password too weak error
```

---

### A08: Software and Data Integrity Failures

**Tests:**
- [ ] No integrity checks on updates
- [ ] Insecure deserialization
- [ ] CI/CD pipeline not secured

**Subresource Integrity Test:**
```html
<!-- CDN scripts should have integrity -->
<script 
  src="https://cdn.example.com/script.js"
  integrity="sha384-..."
  crossorigin="anonymous"
></script>
```

---

### A09: Security Logging Failures

**Tests:**
- [ ] Failed logins not logged
- [ ] Security events not monitored
- [ ] Logs contain sensitive data

**Logging Test:**
```typescript
// Check logs after failed login
const logs = await getLogs();
const loginAttempt = logs.find(l => 
  l.event === 'login_failed' && 
  l.email === 'test@test.com'
);
expect(loginAttempt).toBeDefined();
expect(loginAttempt.password).toBeUndefined(); // Don't log passwords
```

---

### A10: Server-Side Request Forgery (SSRF)

**Tests:**
- [ ] Internal network accessible via URL param
- [ ] File inclusion vulnerabilities
- [ ] Metadata endpoint accessible

**SSRF Test:**
```bash
# Try accessing internal service
curl https://bubblegum.app/api/fetch?url=http://localhost:5432

# Expected: Request blocked or sanitized
```

---

## 🔑 AUTHENTICATION TESTING

### Password Policy

```typescript
describe('Password Policy', () => {
  it('enforces minimum length', async () => {
    const response = await signup({ password: '123' });
    expect(response.error).toContain('at least 8 characters');
  });

  it('requires uppercase letter', async () => {
    const response = await signup({ password: 'lowercase123' });
    expect(response.error).toContain('uppercase letter');
  });

  it('requires lowercase letter', async () => {
    const response = await signup({ password: 'UPPERCASE123' });
    expect(response.error).toContain('lowercase letter');
  });

  it('requires number', async () => {
    const response = await signup({ password: 'Password' });
    expect(response.error).toContain('number');
  });

  it('requires special character', async () => {
    const response = await signup({ password: 'Password123' });
    expect(response.error).toContain('special character');
  });
});
```

### Session Management

```typescript
describe('Session Security', () => {
  it('generates secure session tokens', async () => {
    const { token } = await signin();
    expect(token).toMatch(/^[A-Za-z0-9_-]{43}$/); // JWT format
  });

  it('sessions expire after timeout', async () => {
    const { token } = await signin();
    
    // Wait for session timeout
    await wait(SESSION_TIMEOUT + 1000);
    
    const response = await fetch('/api/profile', {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    expect(response.status).toBe(401);
  });

  it('invalidates token on logout', async () => {
    const { token } = await signin();
    await signout(token);
    
    const response = await fetch('/api/profile', {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    expect(response.status).toBe(401);
  });
});
```

---

## 🚪 AUTHORIZATION TESTING

### Role-Based Access Control

```typescript
describe('RBAC', () => {
  it('users cannot access admin routes', async () => {
    const userToken = await signinAsUser();
    
    const response = await fetch('/api/admin/users', {
      headers: { Authorization: `Bearer ${userToken}` },
    });
    
    expect(response.status).toBe(403);
  });

  it('admins can access admin routes', async () => {
    const adminToken = await signinAsAdmin();
    
    const response = await fetch('/api/admin/users', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    
    expect(response.status).toBe(200);
  });
});
```

### Resource Ownership

```typescript
describe('Resource Ownership', () => {
  it('users cannot edit other users pages', async () => {
    const user1Token = await signinAs('user1');
    const user2Page = await createPageAs('user2');
    
    const response = await fetch(`/api/pages/${user2Page.id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${user1Token}` },
      body: JSON.stringify({ title: 'Hacked' }),
    });
    
    expect(response.status).toBe(403);
  });

  it('users can only delete their own pages', async () => {
    const user1Token = await signinAs('user1');
    const user2Page = await createPageAs('user2');
    
    const response = await fetch(`/api/pages/${user2Page.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${user1Token}` },
    });
    
    expect(response.status).toBe(403);
  });
});
```

---

## ✅ INPUT VALIDATION

### Server-Side Validation

```typescript
describe('Input Validation', () => {
  it('validates email format', async () => {
    const response = await signup({
      email: 'invalid-email',
      password: 'SecurePass123!',
    });
    
    expect(response.error).toContain('Invalid email');
  });

  it('sanitizes HTML input', async () => {
    const response = await createPage({
      title: '<script>alert("XSS")</script>',
    });
    
    const page = await getPage(response.id);
    expect(page.title).toBe('&lt;script&gt;alert("XSS")&lt;/script&gt;');
  });

  it('validates file upload types', async () => {
    const response = await uploadFile({
      file: new File(['content'], 'script.exe', { type: 'application/x-msdownload' }),
    });
    
    expect(response.error).toContain('File type not allowed');
  });

  it('enforces file size limits', async () => {
    const largeFile = new File([new ArrayBuffer(11 * 1024 * 1024)], 'large.jpg');
    
    const response = await uploadFile({ file: largeFile });
    
    expect(response.error).toContain('File too large');
  });
});
```

---

## 🔧 SECURITY SCANNING TOOLS

### 1. npm audit

```bash
# Check for vulnerabilities
npm audit

# Fix automatically
npm audit fix

# Force fix (may break things)
npm audit fix --force
```

### 2. Snyk

```bash
# Install Snyk
npm install -g snyk

# Authenticate
snyk auth

# Test project
snyk test

# Monitor project
snyk monitor

# Test Docker image
snyk container test bubblegum:latest
```

### 3. OWASP ZAP

```bash
# Docker
docker run -t owasp/zap2docker-stable zap-baseline.py \
  -t https://bubblegum.app \
  -r zap-report.html
```

### 4. Trivy (Container Scanning)

```bash
# Scan Docker image
trivy image bubblegum:latest

# Generate report
trivy image --format json --output trivy-report.json bubblegum:latest
```

---

## 🔐 SECURITY CHECKLIST

### Authentication
- [ ] Passwords hashed with bcrypt/argon2
- [ ] Password complexity enforced
- [ ] Account lockout after failed attempts
- [ ] MFA available
- [ ] Session timeout configured
- [ ] Secure session cookies (httpOnly, secure, sameSite)

### Authorization
- [ ] Role-based access control
- [ ] Resource ownership verified
- [ ] API endpoints protected
- [ ] Admin functions restricted

### Data Protection
- [ ] HTTPS enforced
- [ ] Sensitive data encrypted at rest
- [ ] PII anonymized in logs
- [ ] API keys in environment variables
- [ ] No secrets in code

### Input Validation
- [ ] Server-side validation
- [ ] XSS prevention
- [ ] SQL injection prevention
- [ ] File upload restrictions
- [ ] Rate limiting

### Security Headers
- [ ] Strict-Transport-Security
- [ ] X-Frame-Options
- [ ] X-Content-Type-Options
- [ ] Content-Security-Policy
- [ ] X-XSS-Protection

### Dependencies
- [ ] Regular updates
- [ ] Vulnerability scanning
- [ ] No known CVEs

### Monitoring
- [ ] Failed login attempts logged
- [ ] Security events monitored
- [ ] Error tracking (Sentry)
- [ ] Alerts configured

---

**Security Testing Status:** ✅ Complete  
**Last Updated:** November 2, 2025
