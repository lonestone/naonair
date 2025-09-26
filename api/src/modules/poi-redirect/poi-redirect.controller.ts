import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

@Controller()
export class PoiRedirectController {
  @Get('poi/:id')
  async redirectToPoi(
    @Param('id') poiId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const userAgent = req.headers['user-agent'] || '';

    // Detect device type
    const isIOS = /iPhone|iPad|iPod/i.test(userAgent);
    const isAndroid = /Android/i.test(userAgent);
    const isMobile = isIOS || isAndroid;

    if (isMobile) {
      // Mobile device - try deep link with fallback to store
      const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Ouverture Naonair...</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      text-align: center;
      padding: 40px 20px;
      background: #f5f5f5;
    }
    .container {
      max-width: 400px;
      margin: 0 auto;
      background: white;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.1);
    }
    .logo { font-size: 48px; margin-bottom: 20px; }
    h1 { color: #2196F3; margin-bottom: 20px; }
    .loading { margin: 20px 0; }
    .fallback { margin-top: 30px; }
    .store-btn {
      display: inline-block;
      padding: 12px 24px;
      background: #2196F3;
      color: white;
      text-decoration: none;
      border-radius: 8px;
      margin: 5px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">🌬️</div>
    <h1>Naonair</h1>
    <div class="loading">Ouverture en cours...</div>

    <div class="fallback">
      <p>L'application ne s'ouvre pas ?</p>
      ${isIOS ?
        '<a href="https://apps.apple.com/app/naonair/idXXXXXX" class="store-btn">Télécharger sur l\'App Store</a>' :
        '<a href="https://play.google.com/store/apps/details?id=com.aireal" class="store-btn">Télécharger sur Google Play</a>'
      }
    </div>
  </div>

  <script>
    // Try deep link immediately
    const deepLink = 'naonair://poi/${poiId}';
    window.location.href = deepLink;

    // Fallback after 2 seconds if app doesn't open
    setTimeout(() => {
      ${isIOS ?
        `window.location.href = 'https://apps.apple.com/app/naonair/idXXXXXX';` :
        `window.location.href = 'https://play.google.com/store/apps/details?id=com.aireal';`
      }
    }, 2000);
  </script>
</body>
</html>`;

      res.send(htmlContent);
    } else {
      // Desktop - show information page
      const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Naonair - Point d'intérêt</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      text-align: center;
      padding: 40px 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      min-height: 100vh;
      margin: 0;
    }
    .container {
      max-width: 500px;
      margin: 0 auto;
      background: white;
      color: #333;
      padding: 40px;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.2);
    }
    .logo { font-size: 64px; margin-bottom: 20px; }
    h1 { color: #2196F3; margin-bottom: 30px; }
    .qr-info {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
    }
    .store-links { margin-top: 30px; }
    .store-btn {
      display: inline-block;
      padding: 12px 24px;
      background: #2196F3;
      color: white;
      text-decoration: none;
      border-radius: 8px;
      margin: 10px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">🌬️</div>
    <h1>Naonair</h1>
    <h2>Qualité de l'air - Point d'intérêt</h2>

    <div class="qr-info">
      <p>Ce lien est destiné à être scanné depuis un appareil mobile avec l'application Naonair installée.</p>
      <p><strong>ID du point:</strong> ${poiId}</p>
    </div>

    <div class="store-links">
      <p>Téléchargez l'application mobile :</p>
      <a href="https://apps.apple.com/app/naonair/idXXXXXX" class="store-btn">App Store</a>
      <a href="https://play.google.com/store/apps/details?id=com.aireal" class="store-btn">Google Play</a>
    </div>
  </div>
</body>
</html>`;

      res.send(htmlContent);
    }
  }

  @Get('poi/:id/unavailable')
  unavailablePoi(@Param('id') poiId: string, @Res() res: Response) {
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Point d'intérêt non disponible</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      text-align: center;
      padding: 40px 20px;
      background: #f5f5f5;
    }
    .container {
      max-width: 400px;
      margin: 0 auto;
      background: white;
      padding: 40px;
      border-radius: 12px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.1);
    }
    .logo { font-size: 48px; margin-bottom: 20px; }
    h1 { color: #f44336; margin-bottom: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">❌</div>
    <h1>Point d'intérêt non disponible</h1>
    <p>Le point d'intérêt demandé n'est plus disponible ou a été supprimé.</p>
    <p><strong>ID:</strong> ${poiId}</p>
  </div>
</body>
</html>`;

    res.send(htmlContent);
  }
}