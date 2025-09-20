import { test, expect } from '@playwright/test';

test.describe('Tests robustos para el reto técnico', () => {
  test('test básico de conectividad con manejo de errores', async ({ page }) => {
    page.setDefaultTimeout(60000);
    
    console.log('Starting robust test...');
    
    try {
      await test.step('Navigate to site', async () => {
        try {
          await page.goto('https://www.floristeriamundoflor.com/', { 
            waitUntil: 'load', 
            timeout: 30000 
          });
        } catch (error) {
          await page.goto('https://www.floristeriamundoflor.com/', { 
            waitUntil: 'domcontentloaded', 
            timeout: 45000 
          });
        }
      });
      
      await test.step('Check basic connectivity', async () => {
        const title = await page.title();
        expect(title).toContain('Floristería');
        
        const bodyContent = await page.textContent('body');
        expect(bodyContent).toBeTruthy();
      });
      
      await test.step('Check server response', async () => {
        const response = await page.goto('https://www.floristeriamundoflor.com/');
        expect(response?.status()).toBe(200);
      });
      
    } catch (error) {
      throw error;
    }
  });
  
  test('test de estructura básica del sitio', async ({ page }) => {
    page.setDefaultTimeout(60000);
    
    await test.step('Check site structure', async () => {
      await page.goto('https://www.floristeriamundoflor.com/');
      await page.waitForLoadState('domcontentloaded');
      
      const nav = page.locator('nav');
      const header = page.locator('header');
      
      expect(await nav.count()).toBeGreaterThan(0);
      expect(await header.count()).toBeGreaterThan(0);
    });
  });
});
