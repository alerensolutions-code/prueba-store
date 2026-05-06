import http from 'k6/http';
import { check, sleep } from 'k6';
import { randomItem } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

export const options = {
  stages: [
    { duration: '1m', target: 10 },  // Ramp up to 10 users
    { duration: '3m', target: 50 },  // Stay at 50 users
    { duration: '1m', target: 100 }, // Peak at 100 users
    { duration: '1m', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
    http_req_failed: ['rate<0.01'],   // Error rate should be less than 1%
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
const CDN_URL = __ENV.CDN_URL || 'https://cdn.example.com';

export default function () {
  // 1. Visit Home Page
  const homeRes = http.get(`${BASE_URL}/`);
  check(homeRes, { 'home status was 200': (r) => r.status === 200 });
  sleep(Math.random() * 2 + 1); // 1-3s delay

  // 2. Navigate 2 pages of products
  const page1Res = http.get(`${BASE_URL}/api/products?page=1`);
  check(page1Res, { 'api page 1 status was 200': (r) => r.status === 200 });
  const products = page1Res.json();
  
  sleep(Math.random() * 2 + 1);

  const page2Res = http.get(`${BASE_URL}/api/products?page=2`);
  check(page2Res, { 'api page 2 status was 200': (r) => r.status === 200 });
  
  sleep(Math.random() * 2 + 1);

  // 3. Open 20 product details (simulate 20 clicks)
  // To keep the test efficient, we'll pick 20 random products from the first two pages
  if (products && products.length > 0) {
    for (let i = 0; i < 20; i++) {
      const product = randomItem(products);
      const detailRes = http.get(`${BASE_URL}/product/${product.id}`);
      check(detailRes, { 'product detail status was 200': (r) => r.status === 200 });
      
      // Simulate image requests (from CDN)
      if (product.product_images && product.product_images.length > 0) {
        product.product_images.forEach(img => {
          // Rewrite URL to CDN
          const cdnUrl = img.url.replace(/https:\/\/.*\.supabase\.co\/storage\/v1\/object\/public\//, `${CDN_URL}/`);
          const imgRes = http.get(cdnUrl);
          check(imgRes, { 'image status was 200': (r) => r.status === 200 });
        });
      }
      
      sleep(Math.random() * 1 + 0.5); // Faster clicks between products
    }
  }

  sleep(Math.random() * 5 + 5); // End of session wait
}
