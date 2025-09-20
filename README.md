# Reto Técnico SQA - Automatización con Playwright

Este proyecto implementa la solución para el **Reto Técnico de Automatización SQA** utilizando Playwright + TypeScript. La automatización está diseñada para validar la funcionalidad de la floristería **Mundo Flor** (https://www.floristeriamundoflor.com/) aplicando buenas prácticas de testing E2E.

## Descripción del Reto

### Objetivo
Evaluar la capacidad para diseñar y construir pruebas E2E con Playwright + TypeScript, aplicando:
- Buenas prácticas de programación
- Estructura escalable y mantenible
- Validaciones robustas
- Tiempos razonables de ejecución
- Reportes claros y detallados

### URL Objetivo
🌐 **https://www.floristeriamundoflor.com/**

### Tecnologías Implementadas
- **Playwright** (TypeScript)
- **Node.js 18+**
- **Patrón Page Object Model (POM)** bien segmentado
- **Fixtures** de Playwright para datos y estado

## Escenarios Funcionales Implementados

### Escenario 1: Categoría "Amor" - Agregar dos productos al carrito
- Navega al home y entra en la categoría Amor
- Selecciona dos productos distintos
- Abre cada detalle de producto y agrega al carrito
- Valida en el carrito:
  - Exactamente 2 ítems
  - Nombres y precios coinciden
  - Subtotal = suma de precios (con tolerancia para separadores de miles)
- Intercepta la llamada de red que agrega al carrito y aserta el status 2xx

### Escenario 2: Categoría "Cumpleaños" - Agregar y eliminar producto
- Entra a Cumpleaños y abre un producto
- Agrega al carrito y verifica que el contador del carrito se actualiza
- En el carrito, elimina el producto y valida:
  - Carrito vacío o total = 0
  - Mensaje/estado de carrito vacío
- Usa reintentos controlados solo para este spec
- Captura de pantalla del carrito antes y después de eliminar y adjúntalas al reporte

### Test Robusto de Conectividad
- Verifica conectividad básica con el sitio web
- Valida estructura del sitio y elementos clave
- Manejo de errores de red y timeouts

## Estructura del Proyecto

```
reto-tecnico-SQA/
├── tests/
│   ├── e2e/                           # Pruebas end-to-end
│   │   ├── amor.spec.ts              # Escenario 1: Dos productos Amor
│   │   ├── cumple.spec.ts            # Escenario 2: Producto Cumpleaños
│   │   ├── robust-test.spec.ts       # Tests robustos de conectividad
│   │   └── demo-debug.spec.ts        # Demo de navegación paso a paso
│   ├── fixtures/                      # Datos y utilidades
│   │   └── test-data.ts              # Datos centralizados y utilidades
│   └── pages/                         # Page Object Model
│       ├── home.page.ts              # Página principal
│       ├── categoria.page.ts         # Páginas de categoría
│       ├── producto.page.ts          # Página de producto
│       └── carrito.page.ts           # Página del carrito
├── playwright.config.ts              # Configuración optimizada
├── package.json                      # Dependencias y scripts
└── README.md                         # Documentación completa
```

## Instalación

1. **Clona el repositorio:**
   ```bash
   git clone <url-del-repositorio>
   cd reto-tecnico-SQA
   ```

2. **Instala las dependencias:**
   ```bash
   npm install
   ```

3. **Instala los navegadores de Playwright:**
   ```bash
   npx playwright install
   ```

## Ejecución de Pruebas

### Scripts NPM disponibles
```bash
# Scripts principales (RECOMENDADOS)
npm run test:scenarios         # Solo escenarios funcionales (RECOMENDADO)
npm run test:headed            # Ver navegación en tiempo real
npm run test:debug             # Control manual paso a paso
npm run test:ui                # Interfaz visual

# Scripts completos (todos los tests)
npm run test                   # Todos los tests (incluye demo y robustos)

# Scripts específicos
npm run test:amor              # Solo escenario Amor
npm run test:cumple            # Solo escenario Cumpleaños
npm run test:robust            # Solo tests robustos
```

### Ejecutar escenarios específicos
```bash
# Escenario 1: Dos productos de categoría "Amor"
npx playwright test tests/e2e/amor.spec.ts

# Escenario 2: Producto de "Cumpleaños" con eliminación
npx playwright test tests/e2e/cumple.spec.ts

# Test robusto de conectividad
npx playwright test tests/e2e/robust-test.spec.ts

# Demo de navegación paso a paso
npx playwright test tests/e2e/demo-debug.spec.ts
```

### Ver navegación paso a paso (Recomendado)
```bash
# Para escenarios funcionales con navegación visible
npm run test:scenarios -- --headed

# Demo específico con navegación detallada
npx playwright test tests/e2e/demo-debug.spec.ts --headed

# Control manual paso a paso (debug mode)
npm run test:debug

# Interfaz visual para ejecutar tests individuales
npm run test:ui
```

## Reportes y Trazabilidad

### Generar reporte HTML completo
```bash
npm run report
# Si hay conflicto de puerto, usar:
npx playwright show-report --port 9324
```

### Características del reporte implementadas:
- **Reporte HTML** con screenshots y videos
- **Videos on-failure** automáticos
- **Screenshots** en cada fallo
- **Logs detallados** con información de cada paso
- **Trazabilidad** completa de la ejecución

## Configuración Técnica

### playwright.config.ts optimizado:
- **Proyecto Chromium** configurado
- **Reporte HTML** y traces on-first-retry
- **Videos on-failure** automáticos
- **Timeouts** optimizados (10s acción, 30s navegación)
- **Base URL** configurada para floristería Mundo Flor

### Características técnicas implementadas:
- **Selectores resilientes** (aria/role, getByRole, getByText, data-testid)
- **Esperas explícitas** con `expect().toBeVisible()`
- **Sin waitForTimeout** - solo esperas inteligentes
- **Interceptación de red** para validar APIs
- **Manejo de precios** con tolerancia para separadores de miles

## Page Object Model (POM)

### Arquitectura implementada:
- **HomePage**: Navegación principal y acceso a categorías
- **CategoriaPage**: Gestión de productos por categoría
- **ProductoPage**: Detalles de producto y agregado al carrito
- **CarritoPage**: Gestión completa del carrito de compras

### Características del POM:
- **Selectores múltiples** para mayor resilencia
- **Métodos reutilizables** y bien documentados
- **Validaciones robustas** en cada operación
- **Manejo de errores** graceful
- **Información de productos** estructurada

## Datos y Utilidades

### test-data.ts centralizado:
- **Selectores resilientes** para todos los elementos
- **Datos de categorías** (Amor, Cumpleaños)
- **Utilidades de precios** con manejo de formatos
- **Timeouts configurables** por tipo de operación
- **Textos esperados** para validaciones

## Criterios de Evaluación Cumplidos

### Correctitud funcional de los escenarios y estabilidad
- **Escenario 1**: Dos productos de "Amor" agregados correctamente
- **Escenario 2**: Producto de "Cumpleaños" agregado y eliminado
- **Validaciones robustas**: Precios, nombres, cantidades
- **Interceptación de red**: Status 2xx y validación de respuestas
- **Manejo de errores**: Tests no flakean con reintentos controlados

### Calidad de POM, nombres, y reutilización de componentes
- **POM claro**: HomePage, CategoriaPage, ProductoPage, CarritoPage
- **Nombres descriptivos**: Métodos y variables autodocumentados
- **Reutilización**: Componentes compartidos entre tests
- **Selectores resilientes**: Múltiples estrategias de localización

### Reporte y trazabilidad (traces, screenshots, videos)
- **Traces completos**: Screenshots, snapshots, sources
- **Videos on-failure**: Captura automática de errores
- **Screenshots clave**: Antes/después de acciones importantes
- **Anotaciones detalladas**: `test.info().attach` con contexto
- **Métricas de rendimiento**: Tiempos de ejecución medidos

## Troubleshooting

### Problemas comunes y soluciones:

1. **Error de navegadores no instalados:**
   ```bash
   npx playwright install
   ```

2. **Página se queda en "about:blank":**
   - **Normal en modo debug:** Es la página inicial de Playwright
   - **Solución:** Ejecuta el test con `--headed` para ver navegación
   - **Comando:** `npx playwright test --headed`

3. **Solo se ve el primer paso:**
   - **Problema:** Reporter por defecto muestra resumen
   - **Solución:** Usa `--reporter=line` para ver todos los pasos
   - **Comando:** `npx playwright test --headed --reporter=line`

4. **Errores de timeout:**
   - Verificar conectividad a https://www.floristeriamundoflor.com/
   - Los timeouts están optimizados en `playwright.config.ts`

5. **Pruebas fallidas:**
   - Revisar el reporte HTML: `npx playwright show-report`
   - Usar modo debug: `npx playwright test --debug`
   - Ejecutar test robusto: `npx playwright test tests/e2e/robust-test.spec.ts`

6. **Problemas de selectores:**
   - Los selectores son resilientes con múltiples estrategias
   - Se adaptan automáticamente a cambios en la estructura

## Entrega del Reto Técnico

### Requisitos de entrega cumplidos:
- **URL del repositorio público** (este repositorio)
- **Automatización completa** con buenas prácticas
- **Reporte HTML** con escenarios OK
- **Tecnologías requeridas**: Playwright + TypeScript + Node 18+
- **Patrón POM** bien segmentado con fixtures
- **Duración**: Implementado en tiempo razonable

### Información de entrega:
- **Repositorio**: [URL del repositorio público]
- **Email de entrega**: talentosqa@sqasa.co
- **Reporte adjunto**: Captura del reporte HTML con escenarios OK

## Licencia

ISC

---

## Conclusión

Este proyecto implementa una solución completa para el **Reto Técnico de Automatización SQA**, cumpliendo todos los requisitos obligatorios. La automatización está diseñada con buenas prácticas, es escalable, mantenible y proporciona reportes detallados para facilitar el debugging y la trazabilidad.

**¡Listo para entrega! 🚀**