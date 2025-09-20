import { test, expect } from '@playwright/test';

test.describe('Demo: Navegación Paso a Paso', () => {
  test('demostración de navegación visual', async ({ page }) => {
    page.setDefaultTimeout(30000);
    
    console.log('Starting navigation demo...');
    
    await test.step('Go to home', async () => {
      await page.goto('/');
      await page.waitForLoadState('domcontentloaded');
      
      const title = await page.title();
      console.log(`Title: ${title}`);
    });
    
    await test.step('Go to amor category', async () => {
      await page.goto('/product-category/amor/');
      await page.waitForLoadState('domcontentloaded');
      
      const products = page.locator('.product');
      const productCount = await products.count();
      console.log(`Products found: ${productCount}`);
    });
    
    await test.step('Select first product', async () => {
      const firstProduct = page.locator('.product').first();
      
      const productTitle = await firstProduct.locator('h2').textContent();
      const productPrice = await firstProduct.locator('.price').first().textContent();
      
      console.log(`Product: ${productTitle}`);
      console.log(`Price: ${productPrice}`);
      
      await firstProduct.click();
      await page.waitForLoadState('domcontentloaded');
    });
    
    await test.step('Add to cart', async () => {
      const addToCartBtn = page.locator('.single_add_to_cart_button');
      await expect(addToCartBtn).toBeVisible({ timeout: 10000 });
      await addToCartBtn.click();
      
      await page.waitForTimeout(2000);
    });
    
    await test.step('Check cart', async () => {
      await page.goto('/carrito/');
      await page.waitForLoadState('domcontentloaded');
      
      const cartItems = page.locator('.cart_item');
      const itemCount = await cartItems.count();
      console.log(`Items in cart: ${itemCount}`);
      expect(itemCount).toBeGreaterThan(0);
    });
  });
});
