import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = fs.existsSync(path.join(__dirname, 'dist'))
  ? path.join(__dirname, 'dist')
  : path.join(__dirname, 'dist-web');
const rootDir = path.join(__dirname, '..');
const apkPath = path.join(rootDir, 'mealmentor-ai.apk');
const PORT = 3000;
const CLOUD_APK_URL = 'https://expo.dev/artifacts/eas/Ajg4qwZFK2ehCV_Fw0_uzd8e8UxkJ2Atw3-8k59vZeA.apk';
const EAS_BUILD_URL = 'https://expo.dev/accounts/irfanpathan21/projects/mealmentor-ai/builds/7acd5489-ed7e-4225-8ee4-4eab2f3db65b';

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml',
  '.ttf': 'font/ttf',
  '.apk': 'application/vnd.android.package-archive',
};

function renderDownloadHtml(host) {
  const localApkUrl = `http://${host}/download-apk`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(localApkUrl)}&bgcolor=FFFFFF&color=1B5E20`;
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Download MealMentor AI - Latest Android APK (v1.0.3)</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    body { background: #0E1D13; color: #F0FDF4; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24px; }
    .card { background: #162B1D; border: 1px solid rgba(74, 222, 128, 0.2); border-radius: 24px; max-width: 480px; width: 100%; padding: 32px 24px; text-align: center; box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
    .badge { display: inline-block; background: rgba(34, 197, 94, 0.15); color: #4ADE80; font-size: 12px; font-weight: 700; text-transform: uppercase; padding: 6px 14px; border-radius: 20px; margin-bottom: 16px; border: 1px solid rgba(74, 222, 128, 0.3); }
    h1 { font-size: 28px; font-weight: 800; color: #FFFFFF; margin-bottom: 8px; letter-spacing: -0.5px; }
    p.sub { font-size: 15px; color: #94A3B8; margin-bottom: 24px; line-height: 1.5; }
    .btn-primary { display: flex; align-items: center; justify-content: center; gap: 10px; background: linear-gradient(135deg, #16A34A 0%, #15803D 100%); color: #FFFFFF; text-decoration: none; font-size: 17px; font-weight: 700; padding: 16px 24px; border-radius: 16px; margin-bottom: 12px; box-shadow: 0 8px 24px rgba(22, 163, 74, 0.4); transition: transform 0.2s; }
    .btn-primary:active { transform: scale(0.98); }
    .btn-secondary { display: flex; align-items: center; justify-content: center; gap: 8px; background: #203A29; color: #86EFAC; text-decoration: none; font-size: 14px; font-weight: 600; padding: 12px 20px; border-radius: 14px; margin-bottom: 24px; border: 1px solid rgba(74, 222, 128, 0.25); }
    .qr-box { background: #FFFFFF; padding: 14px; border-radius: 18px; display: inline-block; margin-bottom: 20px; box-shadow: 0 4px 16px rgba(0,0,0,0.3); }
    .qr-box img { display: block; border-radius: 8px; }
    .features { text-align: left; background: #0E1D13; border-radius: 16px; padding: 16px; margin-bottom: 20px; border: 1px solid #1E3A26; }
    .features h3 { font-size: 13px; color: #86EFAC; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px; }
    .features ul { list-style: none; }
    .features li { font-size: 13px; color: #CBD5E1; margin-bottom: 8px; display: flex; align-items: flex-start; gap: 8px; }
    .features li::before { content: "✓"; color: #4ADE80; font-weight: bold; }
    .info-footer { font-size: 12px; color: #64748B; line-height: 1.4; }
    .web-link { margin-top: 18px; display: block; color: #4ADE80; font-size: 13px; text-decoration: none; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">Latest Release • v1.0.2 (Build 3)</div>
    <h1>MealMentor AI</h1>
    <p class="sub">Clinical Nutrition & Metabolic Wellness Companion</p>
    
    <a href="/download-apk" class="btn-primary" download>
      <span>⬇️ Download Latest APK (83.6 MB)</span>
    </a>
    
    <a href="${CLOUD_APK_URL}" class="btn-secondary" target="_blank">
      <span>☁️ Cloud Mirror (Expo High-Speed CDN)</span>
    </a>

    <div class="qr-box">
      <img src="${qrUrl}" alt="Scan QR to Download APK" width="180" height="180" />
    </div>
    <div style="font-size: 12px; color: #94A3B8; margin-bottom: 18px;">
      📱 Scan with phone camera to download directly
    </div>

    <div class="features">
      <h3>What's New in v1.0.2</h3>
      <ul>
        <li><strong>Real Typeable Inputs:</strong> Age, Height, and Weight inputs with active cursor and numeric keyboard.</li>
        <li><strong>Dedicated 11th Screen:</strong> Real single PDF lab report upload via system document picker.</li>
        <li><strong>Aesthetic Progress Slides:</strong> Instagram/Healthify-style progress capsules without raw numbers.</li>
        <li><strong>Real Camera & Gallery:</strong> Real camera viewfinder and photo gallery image picker for meal scanning.</li>
        <li><strong>Android Navigation Bar Insets:</strong> Ample bottom clearance on large screens and 3-button navigation.</li>
        <li><strong>Grey Border Elimination:</strong> Clean, borderless AMOLED buttons.</li>
      </ul>
    </div>

    <div class="info-footer">
      Compatible with Android 8.0+. If prompted by Android, tap "Allow from this source" to install.
    </div>

    <a href="/" class="web-link">← Open Web App Preview</a>
  </div>
</body>
</html>`;
}

const server = http.createServer((req, res) => {
  const reqUrl = new URL(req.url, `http://${req.headers.host || 'localhost:3000'}`);
  let reqPath = reqUrl.pathname;
  const host = req.headers.host || `localhost:${PORT}`;

  // 1. Download landing page
  if (reqPath === '/download' || reqPath === '/get-app') {
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
    });
    res.end(renderDownloadHtml(host));
    return;
  }

  // 2. Direct APK Download Binary Streams
  if (reqPath === '/download-apk' || reqPath === '/mealmentor-ai.apk' || reqPath === '/app.apk') {
    fs.stat(apkPath, (err, stats) => {
      if (err || !stats.isFile()) {
        // Fallback: Redirect to Cloud Expo CDN if local APK missing
        res.writeHead(302, { Location: CLOUD_APK_URL });
        res.end();
        return;
      }

      res.writeHead(200, {
        'Content-Type': 'application/vnd.android.package-archive',
        'Content-Disposition': 'attachment; filename="mealmentor-ai-v1.0.1.apk"',
        'Content-Length': stats.size,
        'Accept-Ranges': 'bytes',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache',
      });

      if (req.method === 'HEAD') {
        res.end();
        return;
      }

      const readStream = fs.createReadStream(apkPath);
      readStream.pipe(res);
    });
    return;
  }

  // 3. Static Web Bundle
  if (reqPath === '/') reqPath = '/index.html';

  let filePath = path.join(distDir, reqPath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Fallback to index.html for SPA routing
      filePath = path.join(distDir, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500);
        res.end('Server Error');
        return;
      }

      // Inject floating download banner into HTML for immediate visibility
      if (ext === '.html') {
        let htmlStr = content.toString('utf8');
        const bannerHtml = `
<div id="latest-apk-banner" style="position:fixed;top:0;left:0;right:0;z-index:999999;background:#14532D;color:#FFFFFF;padding:10px 16px;display:flex;align-items:center;justify-content:space-between;box-shadow:0 4px 12px rgba(0,0,0,0.3);font-family:sans-serif;font-size:13px;">
  <div style="display:flex;align-items:center;gap:8px;">
    <span style="background:#22C55E;color:#052E16;padding:2px 8px;border-radius:10px;font-weight:bold;font-size:11px;">NEW</span>
    <span><strong>MealMentor AI Android App (v1.0.3)</strong> is available!</span>
  </div>
  <div style="display:flex;align-items:center;gap:8px;">
    <a href="/download-apk" style="background:#22C55E;color:#052E16;text-decoration:none;font-weight:bold;padding:6px 14px;border-radius:8px;font-size:12px;">⬇️ Download APK</a>
    <a href="/download" style="color:#86EFAC;text-decoration:underline;font-size:12px;">View Details / QR</a>
  </div>
</div>
<style>
  body { padding-top: 46px !important; }
</style>
`;
        if (htmlStr.includes('<body>')) {
          htmlStr = htmlStr.replace('<body>', `<body>${bannerHtml}`);
        } else {
          htmlStr = bannerHtml + htmlStr;
        }
        res.writeHead(200, {
          'Content-Type': 'text/html; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
        });
        res.end(htmlStr);
        return;
      }

      res.writeHead(200, {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
      });
      res.end(content);
    });
  });
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use.`);
  } else {
    console.error('Server error:', err);
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`MealMentor AI running at http://localhost:${PORT}`);
  console.log(`Download Hub: http://localhost:${PORT}/download`);
  console.log(`Direct APK: http://localhost:${PORT}/download-apk`);
});

