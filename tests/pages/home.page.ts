import { Page, Locator, expect } from '@playwright/test';
import { testData } from '../fixtures/test-data';

/**
 * Page Object Model para la página principal de Floristería Mundo Flor
 */
export class HomePage {
  readonly page: Page;
  readonly menuCategories: Locator;
  readonly categoryAmor: Locator;
  readonly categoryCumpleanos: Locator;
  readonly cartIcon: Locator;
  readonly cartCounter: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Selectores actualizados basados en la estructura real del sitio
    // Evitar el nav mobile oculto, buscar nav visible o usar header
    this.menuCategories = page.locator('nav:not([aria-hidden="true"]), header, .main-menu, .navbar:not(.mm-menu)').first();
    this.categoryAmor = page.getByRole('link', { name: /amor/i }).first();
    this.categoryCumpleanos = page.getByRole('link', { name: /cumpleaños/i }).first();
    
    // Selectores para el carrito - buscar elementos más específicos
    this.cartIcon = page.locator('.cart, .shopping-cart, [class*="cart"]').first();
    this.cartCounter = page.locator('.cart-counter, .cart-count, [class*="count"]').first();
  }

  /**
   * Navega a la página principal
   */
  async goto(): Promise<void> {
    try {
      // Verificar que la página no esté cerrada
      if (this.page.isClosed()) {
        throw new Error('Page is closed');
      }
      
      await this.page.goto('/', { 
        waitUntil: 'load',
        timeout: 30000 
      });
      await this.waitForPageLoad();
    } catch (error) {
      console.log('Error navegando a página principal:', error);
      throw error;
    }
  }

  /**
   * Espera a que la página esté completamente cargada
   */
  async waitForPageLoad(): Promise<void> {
    // Verificación básica y confiable
    await expect(this.page).toHaveTitle(/floristería|mundo flor/i);
    await this.page.waitForLoadState('domcontentloaded');
    
    // Esperar a que haya contenido básico
    await this.page.waitForFunction(() => document.body.children.length > 3, { 
      timeout: testData.timeouts.medium 
    });
    
    console.log('Página cargada correctamente');
  }

  /**
   * Navega a la categoría Amor usando la URL correcta
   */
  async goToAmorCategory(): Promise<void> {
    try {
      // Verificar que la página no esté cerrada
      if (this.page.isClosed()) {
        throw new Error('Page is closed');
      }
      
      // Usar la URL correcta descubierta: /product-category/amor/
      await this.page.goto('/product-category/amor/', { 
        waitUntil: 'load',
        timeout: 30000 
      });
      await this.page.waitForTimeout(1000);
    } catch (error) {
      console.log('Error navegando a categoría Amor:', error);
      throw error;
    }
  }

  /**
   * Navega a la categoría Cumpleaños usando la URL correcta
   */
  async goToCumpleanosCategory(): Promise<void> {
    try {
      // Verificar que la página no esté cerrada
      if (this.page.isClosed()) {
        throw new Error('Page is closed');
      }
      
      // Usar la URL correcta descubierta: /product-category/cumpleanos/
      await this.page.goto('/product-category/cumpleanos/', { 
        waitUntil: 'load',
        timeout: 30000 
      });
      await this.page.waitForTimeout(1000);
    } catch (error) {
      console.log('Error navegando a categoría Cumpleaños:', error);
      throw error;
    }
  }

  /**
   * Obtiene el contador del carrito
   */
  async getCartCount(): Promise<number> {
    try {
      const counterText = await this.cartCounter.textContent();
      return counterText ? parseInt(counterText.replace(/\D/g, '')) || 0 : 0;
    } catch {
      return 0;
    }
  }

  /**
   * Verifica si el carrito está visible
   */
  async isCartVisible(): Promise<boolean> {
    return await this.cartIcon.isVisible();
  }

  /**
   * Hace clic en el ícono del carrito
   */
  async clickCartIcon(): Promise<void> {
    await this.cartIcon.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Espera a que el contador del carrito se actualice
   */
  async waitForCartUpdate(expectedCount: number): Promise<void> {
    await expect(this.cartCounter).toContainText(expectedCount.toString());
  }

  /**
   * Verifica que estamos en la página principal
   */
  async verifyOnHomePage(): Promise<void> {
    // Verificación básica de URL y título - más confiable que elementos visuales
    await expect(this.page).toHaveURL(/\/$|\/home|\/inicio/);
    await expect(this.page).toHaveTitle(/floristería|mundo flor/i);
    
    // Verificar que la página esté cargada esperando el DOM
    await this.page.waitForLoadState('domcontentloaded');
    
    // Log para debugging
    console.log(`Página principal verificada: ${this.page.url()}`);
  }
}
