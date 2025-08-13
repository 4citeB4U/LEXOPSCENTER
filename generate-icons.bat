@echo off
echo.
echo ========================================
echo    LEX PWA Icon Generator
echo ========================================
echo.
echo This script will help you generate PNG icons for your PWA
echo.

REM Create icons directory
if not exist "public\icons" (
    mkdir "public\icons"
    echo Created icons directory: public\icons
) else (
    echo Icons directory already exists
)

echo.
echo Required icon sizes:
echo   - 72x72px   (Android small)
echo   - 96x96px   (Android medium)
echo   - 128x128px (Windows small)
echo   - 144x144px (Android large)
echo   - 152x152px (iOS touch icon)
echo   - 192x192px (Android home screen)
echo   - 384x384px (Android splash)
echo   - 512x512px (Android splash large)
echo.

echo To generate these icons, you have several options:
echo.
echo 1. ONLINE CONVERTERS (Recommended for beginners):
echo    - Go to: https://convertio.co/svg-png/
echo    - Upload your LEX.svg file
echo    - Convert to PNG at each size
echo    - Save as: icon-72x72.png, icon-96x96.png, etc.
echo.
echo 2. COMMAND LINE (Advanced users):
echo    - Install ImageMagick: https://imagemagick.org/
echo    - Use: magick LEX.svg -resize 192x192 icon-192x192.png
echo.
echo 3. DESIGN SOFTWARE:
echo    - Adobe Illustrator, Figma, or Sketch
echo    - Export SVG at each size as PNG
echo.

echo After generating icons:
echo 1. Place all PNG files in: public\icons\
echo 2. Make sure names match: icon-72x72.png, icon-96x96.png, etc.
echo 3. Your PWA will then have a proper install button!
echo.
echo Press any key to open the icons folder...
pause >nul

REM Open the icons folder
explorer "public\icons"

echo.
echo Icons folder opened! Generate your PNG icons and place them here.
echo.
pause
