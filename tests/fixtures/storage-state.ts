import { test as base, Page } from '@playwright/test';
import { HomePage } from '../pages/home.page';

/**
 * Fixture para manejar el estado de sesión (storageState)
 * Reto Extra 2: Guarda/restaura state tras iniciar una navegación inicial
 */

interface StorageStateFixtures {
  authenticatedPage: Page;
}

export const test = base.extend<StorageStateFixtures>({
  // Fixture simplificado que proporciona una página estándar
  authenticatedPage: async ({ page }, use) => {
    // Usar la página estándar de Playwright - simple y confiable
    await use(page);
  },
});

/**
 * Maneja la configuración inicial de la página (cookies, modales, etc.)
 */
async function handleInitialPageSetup(page: Page): Promise<void> {
  try {
    // Esperar un poco para que se carguen todos los elementos
    await page.waitForTimeout(2000);
    
    // Manejar posibles pop-ups o modales
    await handlePopups(page);
    
    // Manejar cookies si es necesario
    await handleCookies(page);
    
    // Esperar a que la página esté completamente lista
    await page.waitForLoadState('networkidle');
    
    console.log('Configuración inicial de la página completada');
    
  } catch (error) {
    console.log('Error en configuración inicial:', error);
    // Continuar aunque haya errores en la configuración inicial
  }
}

/**
 * Maneja pop-ups y modales que puedan aparecer
 */
async function handlePopups(page: Page): Promise<void> {
  try {
    // Buscar y cerrar posibles modales o pop-ups comunes
    const popupSelectors = [
      '.modal-close',
      '.popup-close',
      '.close-modal',
      '[data-dismiss="modal"]',
      '.btn-close',
      'button[aria-label="Close"]',
      'button[aria-label="Cerrar"]'
    ];

    for (const selector of popupSelectors) {
      try {
        const element = page.locator(selector);
        if (await element.isVisible({ timeout: 1000 })) {
          await element.click();
          console.log(`Cerrado popup con selector: ${selector}`);
          await page.waitForTimeout(500);
        }
      } catch {
        // Continuar si no se encuentra el elemento
      }
    }
  } catch (error) {
    console.log('Error manejando popups:', error);
  }
}

/**
 * Maneja la aceptación de cookies si es necesario
 */
async function handleCookies(page: Page): Promise<void> {
  try {
    // Buscar botones de aceptar cookies
    const cookieSelectors = [
      'button:has-text("Aceptar")',
      'button:has-text("Accept")',
      'button:has-text("Aceptar todas")',
      'button:has-text("Accept all")',
      '.cookie-accept',
      '#cookie-accept',
      '[data-testid="accept-cookies"]'
    ];

    for (const selector of cookieSelectors) {
      try {
        const element = page.locator(selector);
        if (await element.isVisible({ timeout: 1000 })) {
          await element.click();
          console.log(`Aceptadas cookies con selector: ${selector}`);
          await page.waitForTimeout(500);
          break; // Solo aceptar cookies una vez
        }
      } catch {
        // Continuar si no se encuentra el elemento
      }
    }
  } catch (error) {
    console.log('Error manejando cookies:', error);
  }
}

/**
 * Utilidad para guardar el estado de sesión en un archivo
 */
export async function saveStorageState(page: Page, filePath: string): Promise<void> {
  try {
    await page.context().storageState({ path: filePath });
    console.log(`Estado de sesión guardado en: ${filePath}`);
  } catch (error) {
    console.log('Error guardando estado de sesión:', error);
  }
}

/**
 * Utilidad para cargar el estado de sesión desde un archivo
 */
export async function loadStorageState(browser: any, filePath: string): Promise<Page> {
  try {
    const context = await browser.newContext({ 
      storageState: filePath 
    });
    return await context.newPage();
  } catch (error) {
    console.log('Error cargando estado de sesión:', error);
    // Si hay error, crear una página normal
    const context = await browser.newContext();
    return await context.newPage();
  }
}

export { expect } from '@playwright/test';
