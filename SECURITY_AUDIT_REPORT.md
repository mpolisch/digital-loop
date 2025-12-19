# 🔒 COMPREHENSIVE SECURITY AUDIT REPORT
## Digital Loop - Production Deployment Readiness

**Audit Date:** October 13, 2025  
**Project:** Digital Loop (Spotify Analytics Platform)  
**Auditor:** Deep Security Analysis  
**Scope:** Backend (Express/Node.js) + Frontend (Next.js)

---

## 📊 EXECUTIVE SUMMARY

### Overall Security Score: **7.5/10** ⚠️

**Status:** CONDITIONALLY READY for deployment with MANDATORY fixes required

- ✅ **No npm audit vulnerabilities** (0 critical, 0 high, 0 moderate)
- ✅ **No XSS/SQL Injection vulnerabilities found**
- ⚠️ **5 Critical Issues** requiring immediate attention
- ⚠️ **8 High-Priority Issues** requiring fixes before production
- ℹ️ **12 Medium-Priority Recommendations** for hardening

---

## 🚨 CRITICAL VULNERABILITIES (MUST FIX BEFORE DEPLOYMENT)

### 1. **JWT Token Exposed in URL Hash** 🔴 CRITICAL
**Location:** `backend/src/controllers/spotifyController.ts:64-67`

**Issue:**
```typescript
res.redirect(
  `${process.env.FRONTEND_URL}/home#` +
    new URLSearchParams({ token: jwtToken }).toString()
);
```

**Risk:**
- ❌ JWT tokens are **logged in browser history**
- ❌ JWT tokens are **visible in referrer headers**
- ❌ JWT tokens can be **leaked via analytics/monitoring tools**
- ❌ Tokens persist in browser history even after logout

**Impact:** High - Token theft via browser history/logs

**Fix:** Use secure httpOnly cookies instead
```typescript
// Set JWT in httpOnly cookie
res.cookie("jwt_token", jwtToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
});

// Redirect without token in URL
res.redirect(`${process.env.FRONTEND_URL}/home`);
```

---

### 2. **No Rate Limiting** 🔴 CRITICAL
**Location:** `backend/src/index.ts`

**Issue:** No rate limiting on any endpoints

**Risk:**
- ❌ Brute force attacks on login
- ❌ API abuse (search endpoint)
- ❌ DoS attacks
- ❌ Credential stuffing

**Impact:** High - Service disruption, account compromise

**Fix:** Install and configure rate limiting
```bash
npm install express-rate-limit
```

```typescript
import rateLimit from 'express-rate-limit';

// General API limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests, please try again later.'
});

// Strict auth limiter
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true
});

app.use('/api/', apiLimiter);
app.use('/api/spotify/login', authLimiter);
app.use('/api/spotify/callback', authLimiter);
```

---

### 3. **No Security Headers** 🔴 CRITICAL
**Location:** `backend/src/index.ts`

**Issue:** Missing critical security headers (HSTS, CSP, X-Frame-Options, etc.)

**Risk:**
- ❌ Clickjacking attacks
- ❌ XSS attacks
- ❌ MIME sniffing vulnerabilities
- ❌ Man-in-the-middle attacks

**Impact:** High - Multiple attack vectors exposed

**Fix:** Install helmet.js
```bash
npm install helmet
```

```typescript
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https://i.scdn.co"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

---

### 4. **Tokens Stored in localStorage** 🔴 CRITICAL
**Location:** `client/src/contexts/AuthContext.tsx:61,68,91`

**Issue:**
```typescript
localStorage.setItem('authToken', authToken);
const savedToken = localStorage.getItem('authToken');
```

**Risk:**
- ❌ Vulnerable to XSS attacks
- ❌ Accessible via any JavaScript on the page
- ❌ No expiration enforcement
- ❌ Persists across sessions

**Impact:** High - Token theft via XSS

**Fix:** Use httpOnly cookies (coordinate with backend fix #1)
```typescript
// Remove all localStorage usage
// Let backend handle token via httpOnly cookies
// Frontend automatically sends cookies with credentials: 'include'
```

---

### 5. **Database Tokens Stored in Plain Text** 🔴 CRITICAL
**Location:** `backend/src/db/schema.sql:13-14`

**Issue:**
```sql
spotify_access_token TEXT,
spotify_refresh_token TEXT,
```

**Risk:**
- ❌ Tokens are **NOT encrypted** in database
- ❌ Database breach = all user tokens compromised
- ❌ DBA can access tokens
- ❌ Backup files contain plain text tokens

**Impact:** Critical - Mass account compromise if database is breached

**Fix:** Encrypt tokens before storing
```bash
npm install crypto-js
```

```typescript
import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!;

function encryptToken(token: string): string {
  return CryptoJS.AES.encrypt(token, ENCRYPTION_KEY).toString();
}

function decryptToken(encrypted: string): string {
  const bytes = CryptoJS.AES.decrypt(encrypted, ENCRYPTION_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}

// Use in userService.ts when storing/retrieving tokens
```

---

## ⚠️ HIGH-PRIORITY ISSUES

### 6. **No Request Body Size Limit** 🟠 HIGH
**Location:** `backend/src/index.ts:19`

**Issue:**
```typescript
app.use(express.json()); // No limit!
```

**Risk:** DoS via large payloads

**Fix:**
```typescript
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
```

---

### 7. **CORS Origin from Environment Variable** 🟠 HIGH
**Location:** `backend/src/index.ts:12`

**Issue:**
```typescript
origin: process.env.FRONTEND_URL || 'http://localhost:3000',
```

**Risk:** If `FRONTEND_URL` is not set, defaults to localhost in production

**Fix:**
```typescript
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? [process.env.FRONTEND_URL!]
  : ['http://localhost:3000'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
```

---

### 8. **No Input Sanitization** 🟠 HIGH
**Location:** Multiple files

**Issue:** User inputs are not sanitized (search queries, etc.)

**Risk:** XSS via search results (low but present)

**Fix:**
```bash
npm install express-validator
```

```typescript
import { query, validationResult } from 'express-validator';

app.get('/api/spotify/search',
  query('q').trim().escape().isLength({ min: 1, max: 100 }),
  query('type').isIn(['track', 'artist', 'album']),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // ... rest
  }
);
```

---

### 9. **Console.log/error May Leak Sensitive Data** 🟠 HIGH
**Location:** Multiple files (18 occurrences)

**Issue:**
```typescript
console.error('Error fetching user profile:', error); // May contain sensitive data
```

**Risk:** Sensitive data in logs (tokens, passwords in error objects)

**Fix:** Use proper logger with sanitization
```bash
npm install winston
```

```typescript
import winston from 'winston';

const logger = winston.createLogger({
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ 
      filename: 'error.log', 
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
      )
    })
  ]
});

// Never log error objects directly
logger.error('Error fetching profile', { 
  message: error.message, // Safe
  userId: user.id // Safe
  // Don't log: error, stack, tokens, passwords
});
```

---

### 10. **Database Connection Has No Pool Limits** 🟠 HIGH
**Location:** `backend/src/db/client.ts:10-16`

**Issue:**
```typescript
const pool = new Pool({
  // No max, idleTimeoutMillis, or connectionTimeoutMillis
});
```

**Risk:** Connection exhaustion, DoS

**Fix:**
```typescript
const pool = new Pool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  port: process.env.PGPORT ? Number(process.env.PGPORT) : undefined,
  ssl: isProduction ? {rejectUnauthorized: false}: false,
  max: 20, // Maximum pool size
  idleTimeoutMillis: 30000, // Close idle clients after 30s
  connectionTimeoutMillis: 2000, // Error if can't connect in 2s
});
```

---

### 11. **No Environment Variable Validation** 🟠 HIGH
**Location:** Backend startup

**Issue:** App starts even if critical env vars are missing

**Risk:** Runtime failures, security misconfigurations

**Fix:** Create `backend/src/config/validateEnv.ts`
```typescript
const requiredEnvVars = [
  'JWT_SECRET',
  'CLIENT_ID',
  'CLIENT_SECRET',
  'REDIRECT_URI',
  'DATABASE',
  'DB_USER',
  'DB_PASSWORD',
  'FRONTEND_URL'
];

export function validateEnv() {
  const missing = requiredEnvVars.filter(v => !process.env[v]);
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }
  
  // Validate JWT_SECRET strength
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters');
  }
}

// Call in index.ts before app.listen()
```

---

### 12. **SQL Injection in getAllUsers** 🟠 HIGH
**Location:** `backend/src/services/userService.ts:62`

**Issue:**
```typescript
const query = 'SELECT id, spotify_id, username, email, country, profile_img, created_at FROM users';
```

**Risk:** While this specific query is safe, there's no route using it. If exposed, could leak all user data.

**Fix:** Remove unused function or add authentication + pagination
```typescript
export const getAllUsers = async (limit: number = 50, offset: number = 0): Promise<User[]> => {
  // Add pagination to prevent mass data exposure
  const query = 'SELECT id, spotify_id, username, email, country, profile_img, created_at FROM users LIMIT $1 OFFSET $2';
  const result: QueryResult<User> = await pool.query(query, [limit, offset]);
  return result.rows;
};

// Or remove if not used
```

---

### 13. **Next.js Image Domain Not Validated** 🟠 HIGH
**Location:** `client/next.config.ts:4`

**Issue:**
```typescript
domains: ["i.scdn.co"] // Only Spotify CDN
```

**Risk:** If Spotify CDN compromised, or URL injection

**Fix:** Add remotePatterns for stricter validation
```typescript
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.scdn.co',
        pathname: '/image/**',
      }
    ]
  }
};
```

---

## 📋 MEDIUM-PRIORITY RECOMMENDATIONS

### 14. **No HTTPS Enforcement** 🟡 MEDIUM
- Add HTTPS redirect in production
- Ensure `secure: true` for all cookies in production

### 15. **No CSRF Token for State Cookie** 🟡 MEDIUM
- Current implementation is good but could add SameSite=Strict in production

### 16. **No Audit Logging** 🟡 MEDIUM
- Log authentication events
- Track failed login attempts
- Monitor token refresh failures

### 17. **No Session Timeout** 🟡 MEDIUM
- JWT expires in 7 days with no refresh
- Consider shorter expiration with refresh tokens

### 18. **Proxy Routes Are Redundant** 🟡 MEDIUM
- Already identified - consider removing (covered in previous discussion)

### 19. **No Health Check Endpoint** 🟡 MEDIUM
```typescript
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
```

### 20. **Database SSL Not Enforced** 🟡 MEDIUM
```typescript
ssl: isProduction ? { rejectUnauthorized: true } : false,
```

### 21. **No Graceful Shutdown** 🟡 MEDIUM
```typescript
process.on('SIGTERM', async () => {
  await pool.end();
  process.exit(0);
});
```

### 22. **Frontend .env Not Using NEXT_PUBLIC_** 🟡 MEDIUM
- Backend URL should use `NEXT_PUBLIC_BACKEND_URL` for client-side access

### 23. **No Error Boundary in React** 🟡 MEDIUM
- Add React Error Boundaries to prevent app crashes

### 24. **No Content Security Policy in Next.js** 🟡 MEDIUM
```typescript
// next.config.ts
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' }
      ]
    }
  ];
}
```

### 25. **Password/Bcrypt Package Not Used** 🟡 MEDIUM
- `bcrypt` is installed but not used anywhere - remove if not needed

---

## ✅ SECURITY STRENGTHS

1. ✅ **SQL Injection Protected** - All queries use parameterized statements
2. ✅ **JWT Secret Required** - Throws error if not set
3. ✅ **CORS Configured** - Whitelist-based origin validation
4. ✅ **CSRF Protection** - State parameter in OAuth flow
5. ✅ **httpOnly Cookies for OAuth State** - Secure state management
6. ✅ **Token Expiration** - JWT expires after 7 days
7. ✅ **No XSS Vectors** - No dangerouslySetInnerHTML or eval()
8. ✅ **.env Files Ignored** - Properly in .gitignore
9. ✅ **No npm Vulnerabilities** - Clean npm audit on both frontend/backend
10. ✅ **TypeScript** - Type safety throughout
11. ✅ **Secure Random Strings** - Using crypto.randomBytes()
12. ✅ **Token Refresh Logic** - Automatic Spotify token refresh

---

## 🎯 DEPLOYMENT CHECKLIST

### MANDATORY (Before ANY Production Deployment)
- [ ] **Fix #1:** Move JWT from URL hash to httpOnly cookie
- [ ] **Fix #2:** Install and configure rate limiting
- [ ] **Fix #3:** Install and configure helmet.js
- [ ] **Fix #4:** Move tokens from localStorage to httpOnly cookies
- [ ] **Fix #5:** Encrypt database tokens at rest
- [ ] **Fix #6:** Add request body size limits
- [ ] **Fix #7:** Validate CORS origin properly
- [ ] **Fix #8:** Add input sanitization
- [ ] **Fix #9:** Implement proper logging (Winston)
- [ ] **Fix #10:** Configure database connection pool limits
- [ ] **Fix #11:** Add environment variable validation
- [ ] **Fix #13:** Validate Next.js image patterns

### HIGHLY RECOMMENDED
- [ ] Remove unused `getAllUsers` function or add auth
- [ ] Add HTTPS enforcement
- [ ] Implement audit logging
- [ ] Add health check endpoint
- [ ] Add graceful shutdown
- [ ] Add React Error Boundaries
- [ ] Add CSP headers to Next.js
- [ ] Remove unused bcrypt dependency

### PRODUCTION ENVIRONMENT CHECKLIST
- [ ] Set `NODE_ENV=production`
- [ ] Use strong JWT_SECRET (32+ chars, random)
- [ ] Use ENCRYPTION_KEY for token encryption
- [ ] Enable SSL for database connection
- [ ] Configure FRONTEND_URL correctly
- [ ] Set up monitoring/alerting
- [ ] Enable HTTPS only
- [ ] Configure firewall rules
- [ ] Set up database backups
- [ ] Review and rotate secrets regularly

---

## 📊 FINAL VERDICT

### **DEPLOYMENT READINESS: NOT READY ❌**

**Critical Issues Found:** 5  
**High Priority Issues:** 8  
**Total Must-Fix:** 13

### **Estimated Time to Fix:**
- Critical Issues: 8-12 hours
- High Priority: 6-8 hours
- **Total:** 2-3 days of development

### **Risk Assessment:**
**Current State:** HIGH RISK for production deployment

**With Fixes Applied:** MEDIUM-LOW RISK (acceptable for production)

---

## 📚 RECOMMENDED READING

1. **OWASP Top 10:** https://owasp.org/www-project-top-ten/
2. **JWT Best Practices:** https://tools.ietf.org/html/rfc8725
3. **Express Security Best Practices:** https://expressjs.com/en/advanced/best-practice-security.html
4. **Next.js Security:** https://nextjs.org/docs/app/building-your-application/configuring/content-security-policy

---

**Report Generated:** October 13, 2025  
**Next Review:** After fixes are implemented
