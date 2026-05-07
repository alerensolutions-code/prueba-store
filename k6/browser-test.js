import { browser } from 'k6/browser';
import { check, sleep } from 'k6';

export const options = {
  scenarios: {
    ui_test: {
      executor: 'constant-vus',
      exec: 'runBrowser',
      vus: 5, // 5 navegadores reales simultáneos
      duration: '10m', // Tiempo suficiente para que los 10 VUs completen sus ciclos
      options: {
        browser: {
          type: 'chromium',
        },
      },
    },
  },
  thresholds: {
    browser_web_vital_lcp: ['p(95)<2500'], // LCP por debajo de 2.5s
  },
};

export async function runBrowser() {
  const page = await browser.newPage();

  try {
    // 1. Entrar a la Home (Aleren)
    await page.goto('https://www.aleren.com.ar');
    
    // Esperar a que la web esté lista
    await page.waitForLoadState('networkidle');
    check(page, { 'Home cargada': () => page.locator('h1').isVisible() });
    
    sleep(2);

    // 2. Proceso de visitar 10 productos
    for (let i = 1; i <= 10; i++) {
      console.log(`Usuario visitando producto #${i}`);

      // Hacer un poco de scroll para que el navegador "vea" los productos (lazy loading)
      await page.evaluate(() => window.scrollBy(0, 400));
      
      // Buscar todos los enlaces a productos
      const productLinks = page.locator('a[href*="/product/"]');
      const count = await productLinks.count();
      
      if (count > 0) {
        // Elegir uno al azar entre los visibles
        const randomIndex = Math.floor(Math.random() * Math.min(count, 10));
        const targetProduct = productLinks.nth(randomIndex);
        
        // Clic y esperar navegación
        await Promise.all([
          page.waitForNavigation(),
          targetProduct.click(),
        ]);

        // Verificar que estamos en la ficha del producto
        check(page, { [`Producto ${i} cargado`]: () => page.locator('h1').isVisible() });
        
        // Simular que el usuario mira las fotos y el precio (3-5 segundos)
        sleep(Math.random() * 2 + 3);

        // Volver a la home o a la lista para el siguiente producto
        const logoHome = page.locator('header a').first();
        await Promise.all([
          page.waitForNavigation(),
          logoHome.click(),
        ]);
        
        await page.waitForLoadState('networkidle');
        sleep(1);
      }
    }

    console.log('Sesión de usuario completada (10 productos visitados)');

  } catch (err) {
    console.error(`Error durante la navegación: ${err.message}`);
  } finally {
    await page.close();
  }
}
