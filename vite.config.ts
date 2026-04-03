import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
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
