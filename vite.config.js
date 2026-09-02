import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import createCashfreeOrderHandler from './api/create-cashfree-order.js';
import verifyCashfreeOrderHandler from './api/verify-cashfree-order.js';

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
            
            if (url.pathname === '/api/create-cashfree-order') {
              if (req.method === 'POST') {
                let bodyStr = '';
                req.on('data', chunk => { bodyStr += chunk; });
                req.on('end', async () => {
                  try {
                    req.body = bodyStr ? JSON.parse(bodyStr) : {};
                  } catch (e) {
                    req.body = {};
                  }
                  // Shim res.status and res.json for Express/Vercel format
                  const customRes = {
                    setHeader: (k, v) => res.setHeader(k, v),
                    status: (code) => {
                      res.statusCode = code;
                      return customRes;
                    },
                    json: (data) => {
                      res.setHeader('Content-Type', 'application/json');
                      res.end(JSON.stringify(data));
                    },
                    end: () => res.end()
                  };
                  await createCashfreeOrderHandler(req, customRes);
                });
                return;
              }
            }

            if (url.pathname === '/api/verify-cashfree-order') {
              const customRes = {
                setHeader: (k, v) => res.setHeader(k, v),
                status: (code) => {
                  res.statusCode = code;
                  return customRes;
                },
                json: (data) => {
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify(data));
                },
                end: () => res.end()
              };
              req.query = Object.fromEntries(url.searchParams.entries());
              await verifyCashfreeOrderHandler(req, customRes);
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
