const fs = require('fs');
const path = require('path');

// This script generates PNG icons from the LEX.svg file
// You'll need to run this manually or use an online SVG to PNG converter

const iconSizes = [
  72, 96, 128, 144, 152, 192, 384, 512
];

const svgPath = path.join(__dirname, '../public/LEX.svg');
const iconsDir = path.join(__dirname, '../public/icons');

console.log('🎨 LEX PWA Icon Generator');
console.log('========================');
console.log();

// Check if SVG exists
if (!fs.existsSync(svgPath)) {
  console.error('❌ LEX.svg not found at:', svgPath);
  process.exit(1);
}

// Create icons directory if it doesn't exist
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
  console.log('📁 Created icons directory:', iconsDir);
}

console.log('📋 Required icon sizes:');
iconSizes.forEach(size => {
  console.log(`   - ${size}x${size}px`);
});

console.log();
console.log('🔧 To generate PNG icons, you can:');
console.log();
console.log('1. Use an online SVG to PNG converter:');
console.log('   - https://convertio.co/svg-png/');
console.log('   - https://cloudconvert.com/svg-to-png');
console.log('   - https://www.svgviewer.dev/');
console.log();
console.log('2. Use command line tools:');
console.log('   - Install ImageMagick: brew install imagemagick (macOS)');
console.log('   - Or use Inkscape: inkscape LEX.svg --export-filename=icon-192x192.png -w 192 -h 192');
console.log();
console.log('3. Use design software:');
console.log('   - Adobe Illustrator');
console.log('   - Figma (export as PNG)');
console.log('   - Sketch');
console.log();
console.log('📁 Place generated PNG files in:', iconsDir);
console.log('📝 Make sure to name them exactly as shown in the manifest.json');
console.log();
console.log('✅ After generating icons, your PWA will have a proper install button!');
