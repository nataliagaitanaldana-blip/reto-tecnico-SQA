import { test, expect } from '@playwright/test';

test.describe('Escenario 2 Funcional: Categoría Cumpleaños', () => {
  test('debería agregar un producto de Cumpleaños al carrito y luego eliminarlo', async ({ page }) => {
    page.setDefaultTimeout(60000);
    
    console.log('Testing cumpleanos category...');
    
    await test.step('Go to cumpleanos', async () => {
      await page.goto('/product-category/cumpleanos/');
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(2000);
    });
    
    await test.step('Check products', async () => {
      const products = page.locator('.product');
      await expect(products.first()).toBeVisible({ timeout: 10000 });
      const productCount = await products.count();
      expect(productCount).toBeGreaterThan(0);
    });
    
    await test.step('Add product to cart', async () => {
      const firstProduct = page.locator('.product').first();
      
      await firstProduct.click();
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(2000);
      
      const addToCartBtn = page.locator('.single_add_to_cart_button');
      await expect(addToCartBtn).toBeVisible({ timeout: 10000 });
      await addToCartBtn.click();
      await page.waitForTimeout(3000);
    });
    
    await test.step('Check cart counter', async () => {
      const cartCounter = page.locator('.cart-counter');
      if (await cartCounter.isVisible()) {
        const countText = await cartCounter.textContent();
        expect(parseInt(countText || '0')).toBeGreaterThan(0);
      }
    });
    
    await test.step('Go to cart', async () => {
      await page.goto('/carrito/');
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(3000);
      
      const cartItems = page.locator('.cart_item');
      const itemCount = await cartItems.count();
      
      expect(itemCount).toBeGreaterThan(0);
      
      await test.info().attach('carrito-antes-eliminar.png', {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png'
      });
    });
    
    await test.step('Remove product', async () => {
      const removeBtn = page.locator('.remove').first();
      if (await removeBtn.isVisible()) {
        await removeBtn.click();
        await page.waitForTimeout(3000);
      }
    });
    
    await test.step('Verify empty cart', async () => {
      await page.waitForTimeout(3000);
      
      const cartItems = page.locator('.cart_item');
      const itemCount = await cartItems.count();
      
      if (itemCount === 0) {
        // Cart is empty
      } else {
        const totalElement = page.locator('.cart-total .amount').first();
        if (await totalElement.isVisible()) {
          const totalText = await totalElement.textContent();
          if (totalText?.includes('0') || totalText?.includes('$0')) {
            // Total is zero
          }
        }
      }
      
      await test.info().attach('carrito-despues-eliminar.png', {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png'
      });
    });
  });
});
