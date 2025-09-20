/**
 * Datos de prueba para el reto técnico SQA
 * Floristería Mundo Flor - https://www.floristeriamundoflor.com/
 */

export const testData = {
  // Categorías para las pruebas
  categories: {
    amor: 'Amor',
    cumpleanos: 'Cumpleaños'
  },

  // Selectores comunes
  selectors: {
    // Navegación principal
    menuCategories: '[data-testid="menu-categories"]',
    categoryAmor: 'a[href*="amor"]',
    categoryCumpleanos: 'a[href*="cumpleanos"]',
    
    // Productos
    productCard: '.product-card, .product-item, [data-testid="product-card"]',
    productTitle: '.product-title, .product-name, h3, h4',
    productPrice: '.price, .product-price, .precio',
    addToCartBtn: '.add-to-cart, [data-testid="add-to-cart"]',
    
    // Carrito
    cartCounter: '.cart-counter, .cart-count, [data-testid="cart-counter"]',
    cartIcon: '.cart-icon, [data-testid="cart-icon"]',
    cartItem: '.cart-item, [data-testid="cart-item"]',
    removeFromCartBtn: '.remove-item, [data-testid="remove-item"]',
    cartTotal: '.cart-total, .total, [data-testid="cart-total"]',
    emptyCartMessage: '.empty-cart, .cart-empty, [data-testid="empty-cart"]',
    
    // Filtros y ordenamiento
    sortSelect: 'select[name="sort"], .sort-select',
    filterOptions: '.filter-option, [data-testid="filter"]'
  },

  // Textos esperados
  expectedTexts: {
    emptyCart: ['Carrito vacío', 'No hay productos', 'Tu carrito está vacío'],
    addToCartSuccess: ['Agregado', 'Añadido', 'Producto agregado'],
    categoryAmor: 'Amor',
    categoryCumpleanos: 'Cumpleaños'
  },

  // Timeouts personalizados
  timeouts: {
    short: 5000,
    medium: 10000,
    long: 20000
  },

  // Datos para retos extra (data-driven)
  testCategories: ['Amor', 'Cumpleaños'],

  // Estado de sesión para storageState
  storageState: {
    cookies: [],
    origins: []
  }
};

/**
 * Utilidades para manejo de precios
 */
export const priceUtils = {
  /**
   * Extrae el valor numérico de un precio formateado
   * @param priceText - Texto del precio (ej: "$1,234.56", "€ 1.234,56")
   * @returns Número del precio
   */
  extractPrice: (priceText: string): number => {
    // Remover símbolos de moneda y espacios
    const cleanPrice = priceText.replace(/[^\d.,]/g, '');
    
    // Detectar formato (punto como separador de miles vs decimal)
    const hasComma = cleanPrice.includes(',');
    const hasDot = cleanPrice.includes('.');
    
    if (hasComma && hasDot) {
      // Formato: 1,234.56 (US) o 1.234,56 (EU)
      const lastComma = cleanPrice.lastIndexOf(',');
      const lastDot = cleanPrice.lastIndexOf('.');
      
      if (lastComma > lastDot) {
        // Formato EU: 1.234,56
        return parseFloat(cleanPrice.replace(/\./g, '').replace(',', '.'));
      } else {
        // Formato US: 1,234.56
        return parseFloat(cleanPrice.replace(/,/g, ''));
      }
    } else if (hasComma) {
      // Solo coma: podría ser decimal o separador de miles
      const parts = cleanPrice.split(',');
      if (parts.length === 2 && parts[1].length <= 2) {
        // Decimal: 123,45
        return parseFloat(cleanPrice.replace(',', '.'));
      } else {
        // Separador de miles: 1,234
        return parseFloat(cleanPrice.replace(',', ''));
      }
    } else {
      // Solo punto o sin separadores
      return parseFloat(cleanPrice);
    }
  },

  /**
   * Formatea un precio para comparación
   * @param price - Número del precio
   * @returns Precio formateado
   */
  formatPrice: (price: number): string => {
    return price.toFixed(2);
  }
};
