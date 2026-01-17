
import { Jimp } from 'jimp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '../public');
const sourceImage = path.join(publicDir, 'pwa-512x512.png');

async function generateIcons() {
    try {
        console.log('Loading source image...');
        const image = await Jimp.read(sourceImage);

        console.log('Generating pwa-192x192.png...');
        await image.clone().resize({ w: 192, h: 192 }).write(path.join(publicDir, 'pwa-192x192.png'));

        console.log('Generating pwa-64x64.png...');
        await image.clone().resize({ w: 64, h: 64 }).write(path.join(publicDir, 'pwa-64x64.png'));

        console.log('Generating maskable-icon-512x512.png (same as 512 for now)...');
        // For a true maskable icon, we usually need safe zones, but for this quick gen we'll copy the 512
        // Assuming the generated icon has enough padding.
        await image.clone().write(path.join(publicDir, 'maskable-icon-512x512.png'));

        console.log('All icons generated successfully!');
    } catch (error) {
        console.error('Error generating icons:', error);
        process.exit(1);
    }
}

generateIcons();
