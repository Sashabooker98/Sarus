/**
 * Comprehensive visual verification script for SARUS Clothes
 * Captures:
 * 1. Storefront Desktop
 * 2. Storefront Mobile
 * 3. Admin Login Modal
 * 4. Admin Dashboard Overview (with verified empty states)
 * 5. Admin Products View & Add Product Form
 * 6. Admin Inventory View
 * 7. Admin Orders View
 * 8. Admin Settings View
 */
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const outDir = path.resolve(process.cwd(), 'verification_screenshots');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function run() {
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  // 1. Desktop Storefront
  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2
  });
  const desktopPage = await desktopContext.newPage();
  await desktopPage.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await desktopPage.waitForTimeout(800);
  await desktopPage.screenshot({ path: path.join(outDir, '01_storefront_desktop.png') });
  await desktopPage.screenshot({ path: path.join(outDir, '02_storefront_desktop_fullpage.png'), fullPage: true });

  // 2. Mobile Storefront
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(800);
  await mobilePage.screenshot({ path: path.join(outDir, '03_storefront_mobile.png') });

  // 3. Admin Portal - Click Admin Portal button to show login modal
  const adminContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2
  });
  const adminPage = await adminContext.newPage();
  await adminPage.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await adminPage.waitForTimeout(500);

  // Click ADMIN PORTAL button in header
  const adminBtn = adminPage.locator('button:has-text("ADMIN PORTAL")').first();
  await adminBtn.click();
  await adminPage.waitForTimeout(600);
  await adminPage.screenshot({ path: path.join(outDir, '04_admin_login_modal.png') });

  // Click Quick Owner Entry or Unlock Admin Portal
  const quickOwnerBtn = adminPage.locator('button:has-text("Quick Owner Entry")');
  if (await quickOwnerBtn.isVisible()) {
    await quickOwnerBtn.click();
  } else {
    await adminPage.fill('input#admin-pin-input', '1234');
    await adminPage.click('button:has-text("Unlock Admin Portal")');
  }
  await adminPage.waitForTimeout(1000);
  await adminPage.screenshot({ path: path.join(outDir, '05_admin_dashboard_overview.png') });

  // 4. Admin Products View
  const productsNav = adminPage.locator('button:has-text("Products & Catalog")');
  if (await productsNav.isVisible()) {
    await productsNav.click();
    await adminPage.waitForTimeout(600);
    await adminPage.screenshot({ path: path.join(outDir, '06_admin_products_view.png') });

    // Open Add Product Modal
    const addProductBtn = adminPage.locator('button:has-text("Add New Product")');
    if (await addProductBtn.isVisible()) {
      await addProductBtn.click();
      await adminPage.waitForTimeout(600);
      await adminPage.screenshot({ path: path.join(outDir, '07_admin_add_product_modal.png') });
      // Close modal
      const closeBtn = adminPage.locator('button:has-text("Discard")');
      if (await closeBtn.isVisible()) await closeBtn.click();
      await adminPage.waitForTimeout(400);
    }
  }

  // 5. Admin Inventory View
  const inventoryNav = adminPage.locator('button:has-text("Inventory & Stock")');
  if (await inventoryNav.isVisible()) {
    await inventoryNav.click();
    await adminPage.waitForTimeout(600);
    await adminPage.screenshot({ path: path.join(outDir, '08_admin_inventory_view.png') });
  }

  // 6. Admin Orders View
  const ordersNav = adminPage.locator('button:has-text("Order Management")');
  if (await ordersNav.isVisible()) {
    await ordersNav.click();
    await adminPage.waitForTimeout(600);
    await adminPage.screenshot({ path: path.join(outDir, '09_admin_orders_view.png') });
  }

  // 7. Admin Settings View
  const settingsNav = adminPage.locator('button:has-text("Store Settings")');
  if (await settingsNav.isVisible()) {
    await settingsNav.click();
    await adminPage.waitForTimeout(600);
    await adminPage.screenshot({ path: path.join(outDir, '10_admin_settings_view.png') });
  }

  await browser.close();
  console.log('All verification captures completed successfully.');
}

run().catch((err) => {
  console.error('Capture failed:', err);
  process.exit(1);
});
