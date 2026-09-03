import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import createCashfreeOrderHandler from './api/create-cashfree-order.js';
import verifyCashfreeOrderHandler from './api/verify-cashfree-order.js';
import getOrdersHandler from './api/get-orders.js';
import saveOrderHandler from './api/save-order.js';
import cashfreeWebhookHandler from './api/cashfree-webhook.js';

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

            if (url.pathname === '/api/create-cashfree-order') {
              if (req.method === 'POST') {
                let bodyStr = '';
                req.on('data', chunk => { bodyStr += chunk; });
                req.on('end', async () => {
                  try { req.body = bodyStr ? JSON.parse(bodyStr) : {}; } catch { req.body = {}; }
                  await createCashfreeOrderHandler(req, createShimRes());
                });
                return;
              }
            }

            if (url.pathname === '/api/verify-cashfree-order') {
              req.query = Object.fromEntries(url.searchParams.entries());
              await verifyCashfreeOrderHandler(req, createShimRes());
              return;
            }

            if (url.pathname === '/api/get-orders') {
              await getOrdersHandler(req, createShimRes());
              return;
            }

            if (url.pathname === '/api/save-order') {
              let bodyStr = '';
              req.on('data', chunk => { bodyStr += chunk; });
              req.on('end', async () => {
                try { req.body = bodyStr ? JSON.parse(bodyStr) : {}; } catch { req.body = {}; }
                await saveOrderHandler(req, createShimRes());
              });
              return;
            }

            if (url.pathname === '/api/cashfree-webhook') {
              let bodyStr = '';
              req.on('data', chunk => { bodyStr += chunk; });
              req.on('end', async () => {
                try { req.body = bodyStr ? JSON.parse(bodyStr) : {}; } catch { req.body = {}; }
                await cashfreeWebhookHandler(req, createShimRes());
              });
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
