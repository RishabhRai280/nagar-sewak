const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Icon sizes needed for PWA
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Create icons directory if it doesn't exist
const iconsDir = path.join(__dirname, 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Create SVG icon
const createSVG = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#2563eb;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:1" />
    </linearGradient>
  </defs>
  <circle cx="256" cy="256" r="256" fill="url(#grad)"/>
  <path d="M256 120C220.7 120 192 148.7 192 184C192 219.3 256 320 256 320S320 219.3 320 184C320 148.7 291.3 120 256 120ZM256 208C243.3 208 232 196.7 232 184C232 171.3 243.3 160 256 160C268.7 160 280 171.3 280 184C280 196.7 268.7 208 256 208Z" fill="white"/>
  <rect x="180" y="280" width="20" height="60" fill="white" opacity="0.9"/>
  <rect x="210" y="260" width="25" height="80" fill="white" opacity="0.9"/>
  <rect x="245" y="270" width="22" height="70" fill="white" opacity="0.9"/>
  <rect x="277" y="250" width="28" height="90" fill="white" opacity="0.9"/>
  <rect x="315" y="275" width="18" height="65" fill="white" opacity="0.9"/>
  <text x="256" y="390" font-family="Arial, sans-serif" font-size="48" font-weight="bold" text-anchor="middle" fill="white">NS</text>
</svg>
`;

async function generateIcons() {
  console.log('🎨 Generating PWA icons...\n');

  for (const size of sizes) {
    try {
      const svg = createSVG(size);
      const filename = `icon-${size}x${size}.png`;
      const filepath = path.join(iconsDir, filename);

      await sharp(Buffer.from(svg))
        .resize(size, size)
        .png()
        .toFile(filepath);

      console.log(`✅ Generated ${filename}`);
    } catch (error) {
      console.error(`❌ Failed to generate icon-${size}x${size}.png:`, error.message);
    }
  }

  // Generate favicon
  try {
    const svg = createSVG(32);
    await sharp(Buffer.from(svg))
      .resize(32, 32)
      .png()
      .toFile(path.join(__dirname, 'public', 'favicon.png'));
    console.log('✅ Generated favicon.png');
  } catch (error) {
    console.error('❌ Failed to generate favicon:', error.message);
  }

  console.log('\n🎉 All PWA icons generated successfully!');
  console.log('📁 Icons location:', iconsDir);
}

generateIcons().catch(console.error);
