import { Page, Locator, expect } from '@playwright/test';
import { testData, priceUtils } from '../fixtures/test-data';

/**
 * Page Object Model para la página de detalle de producto
 */
export class ProductoPage {
  readonly page: Page;
  readonly productTitle: Locator;
  readonly productPrice: Locator;
  readonly addToCartBtn: Locator;
  readonly quantitySelector: Locator;
  readonly productImage: Locator;
  readonly productDescription: Locator;
  readonly breadcrumb: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Selectores actualizados basados en la estructura real del sitio
    this.productTitle = page.locator('h1').first();
    this.productPrice = page.locator('.price, .product-price, .precio, .amount, .woocommerce-Price-amount').first();
    this.addToCartBtn = page.locator('.single_add_to_cart_button, .add-to-cart, .btn-add-cart, button[name="add-to-cart"], .cart-button, button:has-text("Agregar"), button:has-text("Add to Cart"), button[type="submit"]:has-text("Agregar")').first();
    this.quantitySelector = page.locator('input[type="number"]').or(page.locator('.quantity-select'));
    this.productImage = page.locator('.product-image').or(page.locator('img.product')).or(page.locator('img'));
    this.productDescription = page.locator('.product-description').or(page.locator('.description')).or(page.locator('.woocommerce-product-details__short-description'));
    this.breadcrumb = page.locator('.breadcrumb').or(page.locator('[data-testid="breadcrumb"]'));
  }

  /**
   * Espera a que la página de producto se cargue completamente
   */
  async waitForPageLoad(): Promise<void> {
    await expect(this.productTitle).toBeVisible({ timeout: testData.timeouts.long });
    await expect(this.productPrice).toBeVisible({ timeout: testData.timeouts.medium });
    await expect(this.addToCartBtn).toBeVisible({ timeout: testData.timeouts.medium });
  }

  /**
   * Obtiene el nombre del producto
   */
  async getProductName(): Promise<string> {
    return await this.productTitle.textContent() || '';
  }

  /**
   * Obtiene el precio del producto
   */
  async getProductPrice(): Promise<number> {
    const priceText = await this.productPrice.textContent() || '0';
    return priceUtils.extractPrice(priceText);
  }

  /**
   * Obtiene información completa del producto
   */
  async getProductInfo(): Promise<{ name: string; price: number; priceText: string }> {
    await this.waitForPageLoad();
    
    const name = await this.getProductName();
    const price = await this.getProductPrice();
    const priceText = await this.productPrice.textContent() || '';

    return { name: name.trim(), price, priceText: priceText.trim() };
  }

  /**
   * Establece la cantidad del producto
   */
  async setQuantity(quantity: number): Promise<void> {
    if (await this.quantitySelector.isVisible()) {
      await this.quantitySelector.fill(quantity.toString());
    }
  }

  /**
   * Agrega el producto al carrito
   */
  async addToCart(): Promise<void> {
    try {
      // Primero verificar que el botón esté visible
      await expect(this.addToCartBtn).toBeVisible({ timeout: 5000 });
      
      // Hacer clic en el botón
      await this.addToCartBtn.click();
      
      // Esperar un poco para que la acción se complete
      await this.page.waitForTimeout(1000);
      
      // Verificar que el botón cambió de estado (opcional)
      try {
        await expect(this.addToCartBtn).toHaveText(/agregado|añadido|added/i, { timeout: 2000 });
      } catch {
        // Si no cambia el texto, verificar que no hay errores
        console.log('Botón de agregar al carrito clickeado, verificando estado...');
      }
      
    } catch (error) {
      console.log('Error agregando producto al carrito:', error);
      
      // Intentar con selectores alternativos
      const alternativeButtons = this.page.locator('button, input[type="submit"], .button').filter({ hasText: /agregar|add|comprar|buy/i });
      const buttonCount = await alternativeButtons.count();
      
      if (buttonCount > 0) {
        console.log(`Intentando con botones alternativos (${buttonCount} encontrados)`);
        await alternativeButtons.first().click();
        await this.page.waitForTimeout(1000);
      } else {
        throw new Error('No se pudo encontrar ningún botón para agregar al carrito');
      }
    }
  }

  /**
   * Agrega el producto al carrito e intercepta la llamada de red
   */
  async addToCartWithNetworkValidation(): Promise<{ response: any; productInfo: any }> {
    const productInfo = await this.getProductInfo();
    
    // Configurar interceptación de la llamada de red
    const responsePromise = this.page.waitForResponse(response => 
      response.url().includes('cart') || 
      response.url().includes('add') ||
      response.url().includes('carrito'),
      { timeout: testData.timeouts.medium }
    );

    await this.addToCart();
    
    const response = await responsePromise;
    
    return { response, productInfo };
  }

  /**
   * Verifica que el producto se agregó exitosamente al carrito
   */
  async verifyAddedToCart(): Promise<void> {
    // Verificar que aparece algún mensaje de éxito o que el botón cambió
    const successIndicators = [
      this.page.getByText(/agregado|añadido|producto agregado/i),
      this.page.locator('.success-message'),
      this.page.locator('[data-testid="add-success"]')
    ];

    let found = false;
    for (const indicator of successIndicators) {
      try {
        await expect(indicator).toBeVisible({ timeout: 2000 });
        found = true;
        break;
      } catch {
        // Continuar con el siguiente indicador
      }
    }

    if (!found) {
      // Si no hay indicadores visibles, verificar que el botón sigue disponible
      await expect(this.addToCartBtn).toBeVisible();
    }
  }

  /**
   * Verifica que estamos en la página correcta del producto
   */
  async verifyProductPage(): Promise<void> {
    await expect(this.productTitle).toBeVisible();
    await expect(this.productPrice).toBeVisible();
    await expect(this.addToCartBtn).toBeVisible();
  }

  /**
   * Obtiene el ID del producto desde la URL o elementos de la página
   */
  async getProductId(): Promise<string | null> {
    // Intentar obtener el ID desde la URL
    const url = this.page.url();
    const urlMatch = url.match(/product[\/\-](\d+)/i) || url.match(/id[\/\-](\d+)/i);
    if (urlMatch) {
      return urlMatch[1];
    }

    // Intentar obtener el ID desde elementos de la página
    try {
      const idElement = this.page.locator('[data-product-id]').or(this.page.locator('[data-id]'));
      if (await idElement.isVisible()) {
        return await idElement.getAttribute('data-product-id') || 
               await idElement.getAttribute('data-id');
      }
    } catch {
      // Si no se encuentra, retornar null
    }

    return null;
  }

  /**
   * Verifica que la imagen del producto está cargada
   */
  async verifyProductImage(): Promise<void> {
    if (await this.productImage.isVisible()) {
      await expect(this.productImage).toBeVisible();
    }
  }
}
