const { getDefaultConfig } = require('expo/metro-config');
const https = require('https');

const config = getDefaultConfig(__dirname);

const TARGET_HOST = 'vpwebservices.testserver.envisage-workflow.in';

const originalEnhanceMiddleware = config.server?.enhanceMiddleware;

config.server = {
  ...config.server,
  enhanceMiddleware: (metroMiddleware, server) => {
    const appMiddleware = (req, res, next) => {
      // Intercept /api requests and proxy to backend to prevent CORS issues on web
      if (req.url && req.url.startsWith('/api')) {
        // Handle preflight OPTIONS
        if (req.method === 'OPTIONS') {
          res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
            'Access-Control-Allow-Headers': '*',
          });
          res.end();
          return;
        }

        const options = {
          hostname: TARGET_HOST,
          port: 443,
          path: req.url,
          method: req.method,
          headers: {
            ...req.headers,
            host: TARGET_HOST,
            origin: `https://${TARGET_HOST}`,
            referer: `https://${TARGET_HOST}/`,
          },
        };

        const proxyReq = https.request(options, (proxyRes) => {
          const responseHeaders = { ...proxyRes.headers };
          responseHeaders['access-control-allow-origin'] = '*';
          responseHeaders['access-control-allow-methods'] = 'GET, POST, PUT, DELETE, OPTIONS, PATCH';
          responseHeaders['access-control-allow-headers'] = '*';

          res.writeHead(proxyRes.statusCode || 200, responseHeaders);
          proxyRes.pipe(res, { end: true });
        });

        proxyReq.on('error', (err) => {
          console.error('[Metro Proxy Error]', err.message);
          if (!res.headersSent) {
            res.writeHead(502, {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            });
            res.end(JSON.stringify({ error: 'Proxy error', message: err.message }));
          }
        });

        req.pipe(proxyReq, { end: true });
        return;
      }

      return metroMiddleware(req, res, next);
    };

    if (originalEnhanceMiddleware) {
      return originalEnhanceMiddleware(appMiddleware, server);
    }
    return appMiddleware;
  },
};

module.exports = config;

