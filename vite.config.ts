import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate', // 새 버전 생기면 자동 업데이트
        strategies: 'injectManifest',
        srcDir: 'public',
        filename: 'sw.js',             
        devOptions: {
          enabled: false, // 개발 중 SW 비활성화
        },
        includeAssets: [
          'favicons/favicon.ico',
          'favicons/apple-touch-icon.png',
          'favicons/favicon-96x96.png',
          'favicons/favicon.svg',
        ],
        manifest: {
          name: 'ZIGMA',
          short_name: 'ZIGMA',
          description: 'ZIGMA',
          theme_color: '#ffffff',
          background_color: '#ffffff',
          display: 'standalone',
          icons: [
            {
              src: 'favicons/web-app-manifest-192x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: 'favicons/web-app-manifest-512x512.png',
              sizes: '512x512',
              type: 'image/png',
            },
          ],
        },
      }),
    ],
    resolve: {
      alias: {
        '@': '/src',
        '@components': '/src/components',
        '@pages': '/src/pages',
        '@hooks': '/src/hooks',
        '@apis': '/src/apis',
        '@routes': '/src/routes',
        '@styles': '/src/styles',
        '@utils': '/src/utils',
        '@types': '/src/types',
        '@mocks': '/src/mocks',
        '@assets': '/src/assets',
        '@store': '/src/store',
        '@layouts': '/src/layouts',
      },
    },
  };
});
