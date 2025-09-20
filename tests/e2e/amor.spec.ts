import { test, expect } from '@playwright/test';

test.describe('Escenario 1 Funcional: Categoría Amor', () => {
  test('debería agregar dos productos de la categoría Amor al carrito', async ({ page }) => {
    page.setDefaultTimeout(90000);
    
    console.log('Testing amor category...');
    
    const addedProducts: Array<{title: string, price: string}> = [];
    let networkResponses: Array<{url: string, status: number}> = [];
    
    page.on('response', async (response) => {
      const url = response.url();
      if (url.includes('admin-ajax.php') && url.includes('add_to_cart')) {
        networkResponses.push({
          url: url,
          status: response.status()
        });
      }
    });
    
    await test.step('Go to home', async () => {
      await page.goto('/');
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(2000);
    });
    
    await test.step('Navigate to amor category', async () => {
      const amorLink = page.getByRole('link', { name: /amor/i }).first();
      if (await amorLink.isVisible()) {
        await amorLink.click();
      } else {
        await page.goto('/product-category/amor/');
      }
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(2000);
    });
    
    await test.step('Check products available', async () => {
      const products = page.locator('.product');
      await expect(products.first()).toBeVisible({ timeout: 10000 });
      const productCount = await products.count();
      expect(productCount).toBeGreaterThan(1);
    });
    
    await test.step('Add first product', async () => {
      const firstProduct = page.locator('.product').first();
      const productTitle = await firstProduct.locator('h2').textContent();
      const productPrice = await firstProduct.locator('.price').first().textContent();
      
      const productInfo = {
        title: productTitle?.trim() || '',
        price: productPrice?.trim() || ''
      };
      
      await firstProduct.click();
      await page.waitForLoadState('domcontentloaded');
      
      const addToCartBtn = page.locator('.single_add_to_cart_button');
      await expect(addToCartBtn).toBeVisible({ timeout: 10000 });
      await addToCartBtn.click();
      await page.waitForTimeout(2000);
      
      addedProducts.push(productInfo);
    });
    
    await test.step('Go back to category', async () => {
      await page.goto('/product-category/amor/');
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(2000);
    });
    
    await test.step('Add second product', async () => {
      const products = page.locator('.product');
      const secondProduct = products.nth(1);
      const productTitle = await secondProduct.locator('h2').textContent();
      const productPrice = await secondProduct.locator('.price').first().textContent();
      
      const productInfo = {
        title: productTitle?.trim() || '',
        price: productPrice?.trim() || ''
      };
      
      await secondProduct.click();
      await page.waitForLoadState('domcontentloaded');
      
      const addToCartBtn = page.locator('.single_add_to_cart_button');
      await expect(addToCartBtn).toBeVisible({ timeout: 10000 });
      await addToCartBtn.click();
      await page.waitForTimeout(2000);
      
      addedProducts.push(productInfo);
    });
    
    await test.step('Verify cart', async () => {
      await page.goto('/carrito/', { waitUntil: 'domcontentloaded', timeout: 60000 });
      
      const cartItems = page.locator('.cart_item');
      const itemCount = await cartItems.count();
      
      expect(itemCount).toBe(2);
      
      for (let i = 0; i < itemCount; i++) {
        const cartItem = cartItems.nth(i);
        const cartItemTitle = await cartItem.locator('a').first().textContent();
        const cartItemPrice = await cartItem.locator('.amount').first().textContent();
        
        const expectedProduct = addedProducts[i];
        expect(cartItemTitle?.trim()).toContain(expectedProduct.title?.trim() || '');
        expect(cartItemPrice?.trim()).toContain(expectedProduct.price?.trim() || '');
      }
      
      networkResponses.forEach((response) => {
        expect(response.status).toBeGreaterThanOrEqual(200);
        expect(response.status).toBeLessThan(300);
      });
    });
  });
});
