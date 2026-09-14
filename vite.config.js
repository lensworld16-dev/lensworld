import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import createCashfreeOrderHandler from './api/create-cashfree-order.js';
import verifyCashfreeOrderHandler from './api/verify-cashfree-order.js';
import cashfreeWebhookHandler from './api/cashfree-webhook.js';
import productsHandler from './api/products.js';
import ordersHandler from './api/orders.js';
import couponsHandler from './api/coupons.js';
import lensPackagesHandler from './api/lens-packages.js';
import siteConfigHandler from './api/site-config.js';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  // Populate process.env so API handlers can access them
  Object.assign(process.env, env);

  return {
    plugins: [
      react(),
      {
        name: 'cashfree-dev-api-middleware',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            const url = new URL(req.url, `http://${req.headers.host || 'localhost:3000'}`);
            
            const createShimRes = () => ({
              setHeader: (k, v) => res.setHeader(k, v),
              status: (code) => {
                res.statusCode = code;
                return createShimRes();
              },
              json: (data) => {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(data));
              },
              end: () => res.end()
            });

            // Helper to parse body if present
            const handleWithBody = (handler) => {
              let bodyStr = '';
              req.on('data', chunk => { bodyStr += chunk; });
              req.on('end', async () => {
                try { req.body = bodyStr ? JSON.parse(bodyStr) : {}; } catch { req.body = {}; }
                req.query = Object.fromEntries(url.searchParams.entries());
                await handler(req, createShimRes());
              });
            };

            // Cashfree Endpoints
            if (url.pathname === '/api/create-cashfree-order') {
              return handleWithBody(createCashfreeOrderHandler);
            }

            if (url.pathname === '/api/verify-cashfree-order') {
              req.query = Object.fromEntries(url.searchParams.entries());
              await verifyCashfreeOrderHandler(req, createShimRes());
              return;
            }

            if (url.pathname === '/api/cashfree-webhook') {
              return handleWithBody(cashfreeWebhookHandler);
            }

            // Products (Consolidated + legacy aliases)
            if (['/api/products', '/api/get-products', '/api/save-product', '/api/delete-product'].includes(url.pathname)) {
              if (req.method === 'POST' || req.method === 'DELETE') {
                return handleWithBody(productsHandler);
              }
              req.query = Object.fromEntries(url.searchParams.entries());
              await productsHandler(req, createShimRes());
              return;
            }

            // Orders (Consolidated + legacy aliases)
            if (['/api/orders', '/api/get-orders', '/api/save-order'].includes(url.pathname)) {
              if (req.method === 'POST') {
                return handleWithBody(ordersHandler);
              }
              req.query = Object.fromEntries(url.searchParams.entries());
              await ordersHandler(req, createShimRes());
              return;
            }

            // Coupons (Consolidated + legacy aliases)
            if (['/api/coupons', '/api/get-coupons', '/api/save-coupon', '/api/delete-coupon'].includes(url.pathname)) {
              if (req.method === 'POST' || req.method === 'DELETE') {
                return handleWithBody(couponsHandler);
              }
              req.query = Object.fromEntries(url.searchParams.entries());
              await couponsHandler(req, createShimRes());
              return;
            }

            // Lens Packages (Consolidated + legacy aliases)
            if (['/api/lens-packages', '/api/get-lens-packages', '/api/save-lens-package', '/api/delete-lens-package'].includes(url.pathname)) {
              if (req.method === 'POST' || req.method === 'DELETE') {
                return handleWithBody(lensPackagesHandler);
              }
              req.query = Object.fromEntries(url.searchParams.entries());
              await lensPackagesHandler(req, createShimRes());
              return;
            }

            // Site Config (Consolidated + legacy aliases)
            if (['/api/site-config', '/api/get-site-config', '/api/save-site-config'].includes(url.pathname)) {
              if (req.method === 'POST') {
                return handleWithBody(siteConfigHandler);
              }
              req.query = Object.fromEntries(url.searchParams.entries());
              await siteConfigHandler(req, createShimRes());
              return;
            }

            next();
          });
        }
      }
    ],
    server: {
      port: 3000,
      open: false
    }
  };
});
