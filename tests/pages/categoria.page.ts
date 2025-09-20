import { Page, Locator, expect } from '@playwright/test';
import { testData } from '../fixtures/test-data';

/**
 * Page Object Model para páginas de categoría de productos
 */
export class CategoriaPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly productCards: Locator;
  readonly sortSelect: Locator;
  readonly filterOptions: Locator;
  readonly breadcrumb: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Selectores actualizados basados en la estructura real descubierta
    this.pageTitle = page.locator('h1').first();
    this.productCards = page.locator('.product'); // Selector que funciona (120+ elementos encontrados)
    this.sortSelect = page.locator('select[name="sort"]').or(page.locator('.sort-select'));
    this.filterOptions = page.locator('.filter-option').or(page.locator('[data-testid="filter"]'));
    this.breadcrumb = page.locator('.breadcrumb').or(page.locator('[data-testid="breadcrumb"]'));
  }

  /**
   * Espera a que la página de categoría se cargue completamente
   */
  async waitForPageLoad(): Promise<void> {
    await expect(this.pageTitle).toBeVisible({ timeout: testData.timeouts.long });
    await expect(this.productCards.first()).toBeVisible({ timeout: testData.timeouts.medium });
  }

  /**
   * Obtiene el título de la página de categoría
   */
  async getPageTitle(): Promise<string> {
    return await this.pageTitle.textContent() || '';
  }

  /**
   * Verifica que estamos en la categoría correcta
   */
  async verifyCategory(categoryName: string): Promise<void> {
    const title = await this.getPageTitle();
    expect(title.toLowerCase()).toContain(categoryName.toLowerCase());
  }

  /**
   * Obtiene todos los productos visibles en la página
   */
  async getProducts(): Promise<Locator[]> {
    await this.waitForPageLoad();
    // Usar el selector que sabemos que funciona (120+ elementos encontrados)
    const products = await this.productCards.all();
    return products;
  }

  /**
   * Obtiene un producto específico por índice
   */
  async getProductByIndex(index: number): Promise<Locator> {
    const products = await this.getProducts();
    expect(products.length).toBeGreaterThan(index);
    return products[index];
  }

  /**
   * Obtiene información de un producto (nombre y precio)
   */
  async getProductInfo(product: Locator): Promise<{ name: string; price: number }> {
    try {
      // Usar selectores más amplios para encontrar el nombre del producto
      const nameElement = product.locator('.product-title, .product-name, h1, h2, h3, h4, h5, .title, .name, a[title], [title], .woocommerce-loop-product__title').first();
      const priceElement = product.locator('.price, .product-price, .precio, .amount, .woocommerce-Price-amount, .cost, .value').first();

      const name = await nameElement.textContent() || '';
      const priceText = await priceElement.textContent() || '0';
      
      // Si no se encontró nombre, intentar con el atributo title o alt
      let finalName = name.trim();
      if (!finalName) {
        const titleAttr = await nameElement.getAttribute('title') || '';
        const altAttr = await product.locator('img').first().getAttribute('alt') || '';
        finalName = titleAttr || altAttr || 'Producto sin nombre';
      }
      
      // Importar la utilidad de precios
      const { priceUtils } = await import('../fixtures/test-data');
      const price = priceUtils.extractPrice(priceText);

      console.log(`Producto encontrado: "${finalName}" - Precio: ${price}`);
      return { name: finalName, price };
      
    } catch (error) {
      console.log('Error obteniendo información del producto:', error);
      return { name: 'Producto desconocido', price: 0 };
    }
  }

  /**
   * Hace clic en un producto para ver sus detalles
   */
  async clickProduct(product: Locator): Promise<void> {
    await product.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Ordena los productos por una opción específica
   */
  async sortProducts(sortOption: string): Promise<void> {
    if (await this.sortSelect.isVisible()) {
      await this.sortSelect.selectOption(sortOption);
      await this.page.waitForLoadState('networkidle');
    }
  }

  /**
   * Aplica un filtro específico
   */
  async applyFilter(filterName: string): Promise<void> {
    const filter = this.filterOptions.filter({ hasText: filterName });
    if (await filter.isVisible()) {
      await filter.click();
      await this.page.waitForLoadState('networkidle');
    }
  }

  /**
   * Verifica que hay productos disponibles
   */
  async verifyProductsAvailable(): Promise<void> {
    const products = await this.getProducts();
    expect(products.length).toBeGreaterThan(0);
  }

  /**
   * Obtiene el número total de productos visibles
   */
  async getProductCount(): Promise<number> {
    const products = await this.getProducts();
    return products.length;
  }

  /**
   * Espera a que se carguen más productos (para paginación o scroll infinito)
   */
  async waitForMoreProducts(currentCount: number): Promise<void> {
    await this.page.waitForFunction(
      (expectedCount) => {
        const products = document.querySelectorAll('.product-card, .product-item, [data-testid="product-card"], article.product');
        return products.length > expectedCount;
      },
      currentCount,
      { timeout: testData.timeouts.medium }
    );
  }
}
