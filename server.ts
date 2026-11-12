/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import fs from 'fs';
import { GoogleGenAI } from '@google/genai';
import { db } from './src/server/db.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env'), override: true });
dotenv.config({ path: path.resolve(process.cwd(), '.env'), override: true });

const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Default express.json limit: 100kb (allows 8mb only on /api/upload)
app.use((req, res, next) => {
  if (req.path === '/api/upload') {
    return next();
  }
  express.json({ limit: '100kb' })(req, res, next);
});
app.use(express.urlencoded({ extended: true, limit: '100kb' }));

// Ensure public/uploads exists and serve static uploads
const uploadsDir = path.resolve(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// ==========================================
// RATE LIMITING ARCHITECTURE (In-Memory per IP)
// ==========================================
function getClientIp(req: express.Request): string {
  if (req.ip) return req.ip;
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.socket.remoteAddress || 'unknown';
}

// 1. Admin Login Rate Limiter (5 failed attempts per 15 min)
interface RateLimitEntry {
  count: number;
  resetAt: number;
}
const loginAttempts = new Map<string, RateLimitEntry>();
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILED_LOGIN_ATTEMPTS = 5;

const loginCleanupInterval = setInterval(() => {
  const now = Date.now();
  for (const [ipKey, entry] of loginAttempts.entries()) {
    if (now > entry.resetAt) {
      loginAttempts.delete(ipKey);
    }
  }
}, 5 * 60 * 1000);
if (loginCleanupInterval.unref) {
  loginCleanupInterval.unref();
}

function checkLoginRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = loginAttempts.get(ip);
  if (!entry) return true;
  if (now > entry.resetAt) {
    loginAttempts.delete(ip);
    return true;
  }
  return entry.count < MAX_FAILED_LOGIN_ATTEMPTS;
}

function recordFailedLoginAttempt(ip: string): void {
  const now = Date.now();
  const entry = loginAttempts.get(ip);
  if (!entry || now > entry.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + LOGIN_WINDOW_MS });
  } else {
    entry.count += 1;
  }
}

function clearFailedLoginAttempts(ip: string): void {
  loginAttempts.delete(ip);
}

// 2. Generic Route Rate Limiter Factory (with periodic cleanup)
function createRouteRateLimiter(options: { maxRequests: number; windowMs: number; errorMessage: string }) {
  const map = new Map<string, RateLimitEntry>();

  const cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [ip, entry] of map.entries()) {
      if (now > entry.resetAt) {
        map.delete(ip);
      }
    }
  }, Math.min(options.windowMs, 5 * 60 * 1000));
  if (cleanupInterval.unref) {
    cleanupInterval.unref();
  }

  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const ip = getClientIp(req);
    const now = Date.now();
    const entry = map.get(ip);

    if (!entry || now > entry.resetAt) {
      map.set(ip, { count: 1, resetAt: now + options.windowMs });
      return next();
    }

    if (entry.count >= options.maxRequests) {
      res.status(429).json({ error: options.errorMessage });
      return;
    }

    entry.count += 1;
    return next();
  };
}

// POST /api/orders max 10 per hour
const ordersRateLimiter = createRouteRateLimiter({
  maxRequests: 10,
  windowMs: 60 * 60 * 1000,
  errorMessage: 'Order rate limit exceeded. A maximum of 10 orders per hour is permitted per IP.',
});

// POST /api/stylist max 20 per hour
const stylistRateLimiter = createRouteRateLimiter({
  maxRequests: 20,
  windowMs: 60 * 60 * 1000,
  errorMessage: 'AI Stylist rate limit exceeded. A maximum of 20 styling queries per hour is permitted.',
});

// ==========================================
// SESSION & AUTHENTICATION UTILITIES
// ==========================================
function getSessionSecret(): string | null {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    console.warn(
      '[SECURITY WARNING] SESSION_SECRET environment variable is missing or shorter than 32 characters. Admin logins will be refused.'
    );
    return null;
  }
  return secret;
}

function timingSafeCompare(provided: string, expected: string): boolean {
  const bufProvided = Buffer.from(provided, 'utf8');
  const bufExpected = Buffer.from(expected, 'utf8');
  if (bufProvided.length !== bufExpected.length) {
    crypto.timingSafeEqual(bufExpected, bufExpected);
    return false;
  }
  return crypto.timingSafeEqual(bufProvided, bufExpected);
}

function createSessionToken(secret: string): string {
  const payload = {
    role: 'owner',
    exp: Date.now() + 8 * 60 * 60 * 1000, // 8 hours
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', secret).update(encodedPayload).digest('base64url');
  return `${encodedPayload}.${signature}`;
}

function verifySessionToken(token: string): boolean {
  const secret = getSessionSecret();
  if (!secret) return false;
  if (!token || typeof token !== 'string') return false;

  const parts = token.split('.');
  if (parts.length !== 2) return false;

  const [encodedPayload, signature] = parts;
  const expectedSignature = crypto.createHmac('sha256', secret).update(encodedPayload).digest('base64url');

  if (!timingSafeCompare(signature, expectedSignature)) {
    return false;
  }

  try {
    const jsonStr = Buffer.from(encodedPayload, 'base64url').toString('utf8');
    const payload = JSON.parse(jsonStr);
    if (!payload || payload.role !== 'owner' || typeof payload.exp !== 'number') {
      return false;
    }
    if (Date.now() > payload.exp) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

function parseCookie(req: express.Request, cookieName: string): string | null {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return null;
  const parts = cookieHeader.split(';');
  for (const part of parts) {
    const [key, ...vals] = part.trim().split('=');
    if (key === cookieName) {
      return decodeURIComponent(vals.join('='));
    }
  }
  return null;
}

// Authentication Middleware for Protected Routes
function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const token = parseCookie(req, 'sarus_admin_session');
  if (token && verifySessionToken(token)) {
    return next();
  }
  res.status(401).json({ error: 'Unauthorized. Admin login required.' });
}

// ==========================================
// 1. HEALTHCHECK & PUBLIC SETTINGS
// ==========================================
app.get('/api/healthz', (_req, res) => {
  res.json({
    status: 'ok',
    store: 'SARUS Premium Fabrics',
    owner: 'Suleman Sarwar',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/settings', (_req, res) => {
  res.json(db.getSettings());
});

app.put('/api/settings', requireAdmin, (req, res) => {
  const updated = db.updateSettings(req.body);
  res.json({ success: true, settings: updated });
});

// ==========================================
// 2. ADMIN AUTHENTICATION
// ==========================================
app.get('/api/admin/session', (req, res) => {
  const token = parseCookie(req, 'sarus_admin_session');
  if (token && verifySessionToken(token)) {
    const status = db.getAdminStatus();
    res.json({ authenticated: true, role: 'owner', passwordChanged: status.passwordChanged });
  } else {
    res.json({ authenticated: false });
  }
});

app.post('/api/admin/login', (req, res) => {
  const ip = getClientIp(req);

  if (!checkLoginRateLimit(ip)) {
    res.status(429).json({ error: 'Too many attempts, try again later' });
    return;
  }

  const { password } = req.body || {};
  if (typeof password !== 'string') {
    res.status(400).json({ error: 'Password required' });
    return;
  }

  const secret = getSessionSecret();
  if (!secret) {
    res.status(503).json({ error: 'Admin authentication is currently unavailable (SESSION_SECRET not configured).' });
    return;
  }

  const isMatch = db.verifyAdminPassword(password);
  if (!isMatch) {
    recordFailedLoginAttempt(ip);
    res.status(401).json({ error: 'Incorrect password' });
    return;
  }

  clearFailedLoginAttempts(ip);
  const token = createSessionToken(secret);
  const isProd = process.env.NODE_ENV === 'production';
  const cookieStr = [
    `sarus_admin_session=${token}`,
    'Path=/',
    `Max-Age=${8 * 3600}`,
    'HttpOnly',
    'SameSite=Strict',
    isProd ? 'Secure' : '',
  ]
    .filter(Boolean)
    .join('; ');

  res.setHeader('Set-Cookie', cookieStr);
  const status = db.getAdminStatus();
  res.json({
    success: true,
    message: 'Authenticated successfully',
    passwordChanged: status.passwordChanged,
  });
});

app.post('/api/admin/change-password', requireAdmin, (req, res) => {
  const { currentPassword, newPassword } = req.body || {};
  if (!currentPassword || !newPassword || typeof newPassword !== 'string' || newPassword.length < 6) {
    res.status(400).json({ error: 'New password must be at least 6 characters.' });
    return;
  }

  if (!db.verifyAdminPassword(currentPassword)) {
    res.status(401).json({ error: 'Current password incorrect.' });
    return;
  }

  db.changeAdminPassword(newPassword);
  res.json({ success: true, message: 'Password updated successfully.' });
});

app.post('/api/admin/logout', (_req, res) => {
  const isProd = process.env.NODE_ENV === 'production';
  const cookieStr = [
    'sarus_admin_session=',
    'Path=/',
    'Max-Age=0',
    'Expires=Thu, 01 Jan 1970 00:00:00 GMT',
    'HttpOnly',
    'SameSite=Strict',
    isProd ? 'Secure' : '',
  ]
    .filter(Boolean)
    .join('; ');

  res.setHeader('Set-Cookie', cookieStr);
  res.json({ success: true, message: 'Logged out successfully' });
});

// Admin Dashboard statistics
app.get('/api/admin/stats', requireAdmin, (_req, res) => {
  res.json(db.getDashboardStats());
});

// Admin Database Backup Download
app.get('/api/admin/backup', requireAdmin, (_req, res) => {
  const dbFile = path.resolve(process.cwd(), 'data', 'sarus_database.json');
  if (!fs.existsSync(dbFile)) {
    res.status(404).json({ error: 'Database backup file not found.' });
    return;
  }
  const dateStr = new Date().toISOString().slice(0, 10);
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename="sarus_database_backup_${dateStr}.json"`);
  fs.createReadStream(dbFile).pipe(res);
});

// ==========================================
// 3. PRODUCTS API (DB PERSISTED)
// ==========================================
app.get('/api/products', (req, res) => {
  const { category, search, featured, published } = req.query;

  const isPublished = published !== undefined ? published === 'true' : undefined;
  const isFeatured = featured !== undefined ? featured === 'true' : undefined;

  const products = db.getProducts({
    category: typeof category === 'string' ? category : undefined,
    search: typeof search === 'string' ? search : undefined,
    isPublished,
    isFeatured,
  });

  res.json(products);
});

app.get('/api/products/:id', (req, res) => {
  const product = db.getProductById(req.params.id);
  if (!product) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }
  res.json(product);
});

app.post('/api/products', requireAdmin, (req, res) => {
  const { name, price, description, category, stock, images, fabric, fit, isPublished, isFeatured, salePrice } = req.body;

  if (!name || !price || isNaN(Number(price))) {
    res.status(400).json({ error: 'Product name and valid price (PKR) are required.' });
    return;
  }

  const newProd = db.createProduct({
    name: name.trim(),
    slug: req.body.slug || '',
    productSku: req.body.productSku || '',
    description: description?.trim() || '',
    price: Number(price),
    salePrice: salePrice ? Number(salePrice) : undefined,
    category: category || 'Cotton',
    audience: req.body.audience || 'unisex',
    season: req.body.season || 'all_season',
    fabric: fabric?.trim() || '100% Pure Fabric',
    fit: fit?.trim() || '4.0m Standard Suit Length',
    stock: stock ? Number(stock) : 25,
    isPublished: isPublished !== false,
    isFeatured: !!isFeatured,
    images: Array.isArray(images) && images.length > 0 ? images : [{ id: 'img-1', url: '/assets/aistudio/SARUS_Premium_Fabrics_Logo-removebg-preview_2b5db1d0.png', alt: name }],
    tags: Array.isArray(req.body.tags) ? req.body.tags : [category?.toLowerCase() || 'fabric'],
    keywords: Array.isArray(req.body.keywords) ? req.body.keywords : name.toLowerCase().split(/\s+/),
  });

  res.status(201).json(newProd);
});

app.put('/api/products/:id', requireAdmin, (req, res) => {
  const updated = db.updateProduct(req.params.id, req.body);
  if (!updated) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }
  res.json(updated);
});

app.delete('/api/products/:id', requireAdmin, (req, res) => {
  const success = db.deleteProduct(req.params.id);
  if (!success) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }
  res.json({ success: true, message: 'Product deleted successfully.' });
});

// ==========================================
// 4. CATEGORIES API (DB PERSISTED)
// ==========================================
app.get('/api/categories', (_req, res) => {
  res.json(db.getCategories());
});

app.post('/api/categories', requireAdmin, (req, res) => {
  const { name, description, imageUrl } = req.body;
  if (!name || !name.trim()) {
    res.status(400).json({ error: 'Category name is required.' });
    return;
  }
  const created = db.createCategory({
    name: name.trim(),
    description: description?.trim() || '',
    imageUrl,
  });
  res.status(201).json(created);
});

app.put('/api/categories/:id', requireAdmin, (req, res) => {
  const updated = db.updateCategory(req.params.id, req.body);
  if (!updated) {
    res.status(404).json({ error: 'Category not found' });
    return;
  }
  res.json(updated);
});

app.delete('/api/categories/:id', requireAdmin, (req, res) => {
  const result = db.deleteCategory(req.params.id);
  if (!result.success) {
    if (result.productsCount && result.productsCount > 0) {
      res.status(400).json({
        error: `Cannot delete category: ${result.productsCount} products belong to this category. Please reassign or delete these products first.`,
        productsCount: result.productsCount,
      });
      return;
    }
    res.status(404).json({ error: 'Category not found' });
    return;
  }
  res.json({ success: true, message: 'Category deleted successfully.' });
});

// ==========================================
// 5. ORDERS API (DB PERSISTED with Rate Limit)
// ==========================================
app.get('/api/orders', requireAdmin, (_req, res) => {
  res.json(db.getOrders());
});

app.get('/api/orders/:id', (req, res) => {
  const order = db.getOrderById(req.params.id);
  if (!order) {
    res.status(404).json({ error: 'Order not found' });
    return;
  }
  const token = parseCookie(req, 'sarus_admin_session');
  const isAdmin = token && verifySessionToken(token);
  const queryPhone = req.query.phone;
  if (!isAdmin && (!queryPhone || queryPhone !== order.customerPhone)) {
    res.status(403).json({ error: 'Unauthorized to view this order.' });
    return;
  }
  res.json(order);
});

app.post('/api/orders', ordersRateLimiter, (req, res) => {
  const result = db.createOrder(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error });
    return;
  }
  res.status(201).json(result.order);
});

app.patch('/api/orders/:id/status', requireAdmin, (req, res) => {
  const { status } = req.body;
  const allowed = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
  if (!allowed.includes(status)) {
    res.status(400).json({ error: 'Invalid order status' });
    return;
  }
  const updated = db.updateOrderStatus(req.params.id, status);
  if (!updated) {
    res.status(404).json({ error: 'Order not found' });
    return;
  }
  res.json(updated);
});

// ==========================================
// 6. PERSISTENT IMAGE UPLOAD (Disk Storage)
// Allow only png, jpg, webp (NO svg), max 5MB, verify magic bytes, server-side filename
// ==========================================
app.post('/api/upload', requireAdmin, express.json({ limit: '8mb' }), (req, res) => {
  const { dataUrl } = req.body || {};
  if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.includes('base64,')) {
    res.status(400).json({ error: 'Invalid image data. Base64 dataUrl required.' });
    return;
  }

  try {
    const matches = dataUrl.match(/^data:image\/([a-zA-Z0-9-+.]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      res.status(400).json({ error: 'Invalid base64 image data URL format.' });
      return;
    }

    const declaredExt = matches[1].toLowerCase().replace('jpeg', 'jpg');
    if (declaredExt !== 'png' && declaredExt !== 'jpg' && declaredExt !== 'webp') {
      res.status(400).json({ error: 'Only PNG, JPG, and WEBP image uploads are supported. SVG is not permitted.' });
      return;
    }

    const buffer = Buffer.from(matches[2], 'base64');
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    if (buffer.length > MAX_FILE_SIZE) {
      res.status(400).json({ error: 'File size exceeds maximum allowed limit of 5MB.' });
      return;
    }

    // Verify magic bytes
    const isPng =
      buffer.length >= 8 &&
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47;

    const isJpg =
      buffer.length >= 3 &&
      buffer[0] === 0xff &&
      buffer[1] === 0xd8 &&
      buffer[2] === 0xff;

    const isWebp =
      buffer.length >= 12 &&
      buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
      buffer.subarray(8, 12).toString('ascii') === 'WEBP';

    let actualExt = '';
    if (isPng) actualExt = 'png';
    else if (isJpg) actualExt = 'jpg';
    else if (isWebp) actualExt = 'webp';

    if (!actualExt || actualExt !== declaredExt) {
      res.status(400).json({ error: 'Image file content (magic bytes) does not match declared image type.' });
      return;
    }

    // Generate secure filename server-side
    const randSuffix = crypto.randomBytes(8).toString('hex');
    const finalFilename = `fabric-${Date.now()}-${randSuffix}.${actualExt}`;
    const filePath = path.join(uploadsDir, finalFilename);

    fs.writeFileSync(filePath, buffer);
    const publicUrl = `/uploads/${finalFilename}`;

    res.json({ success: true, url: publicUrl, filename: finalFilename });
  } catch (err) {
    console.error('[UPLOAD ERROR]', err);
    res.status(500).json({ error: 'Failed to save uploaded image.' });
  }
});

// ==========================================
// 7. AI FABRIC & STYLIST ASSISTANT (OPTIONAL)
// ==========================================
app.post('/api/stylist', stylistRateLimiter, async (req, res) => {
  const { query, occasion } = req.body || {};
  if (!query && !occasion) {
    res.status(400).json({ error: 'Please provide tailoring or occasion preferences.' });
    return;
  }

  const prompt = `You are the Master Textile Consultant for "SARUS Premium Fabrics" in Sadiqabad, Pakistan, owned by Suleman Sarwar.
SARUS curates unstitched pure Egyptian Giza cotton, traditional crisp snow-white latha, organic Belgian flax linen, handloom winter Karandi, and celebratory festive raw silk.
Query: "${query || 'Recommend suitable fabric for shalwar kameez'}"
Occasion: "${occasion || 'Daily Wear / Formal'}"
Provide refined, expert advice on yardage (4.0m vs 4.5m), pre-soak care, and silhouette. Under 150 words.`;

  const modelName = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    res.status(503).json({ error: 'AI Stylist service is currently unavailable. GEMINI_API_KEY is not configured.' });
    return;
  }

  try {
    const aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
    });
    const response = await aiClient.models.generateContent({
      model: modelName,
      contents: prompt,
    });
    const replyText = response.text;
    if (!replyText) {
      res.status(502).json({ error: 'AI Stylist was unable to generate styling recommendations. Please try again.' });
      return;
    }
    res.json({ response: replyText });
  } catch (err: any) {
    console.error('AI Stylist error:', err);
    res.status(502).json({ error: `AI Stylist request failed: ${err?.message || 'Model error'}` });
  }
});

// ==========================================
// 8. VITE MIDDLEWARE & SPA ROUTING
// ==========================================
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SARUS Premium Fabrics full-stack server running on http://localhost:${PORT}`);
    console.log(`Owner: Suleman Sarwar · Database persisted at data/sarus_database.json`);
  });
}

startServer();
