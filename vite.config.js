import { defineConfig } from 'vite';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import sitemap from 'vite-plugin-sitemap';
import { resolve } from 'path';

export default defineConfig({
  root: 'src',
  base: '/',

  plugins: [
    ViteImageOptimizer({
      jpg:  { quality: 80 },
      jpeg: { quality: 80 },
      png:  { quality: 90 },
      webp: { lossless: false, quality: 80 },
    }),
    sitemap({
      hostname: 'https://pastedstudio.com',
      dynamicRoutes: ['/', '/film', '/shorts'],
    }),
  ],

  css: {
    devSourcemap: true,
    postcss: './postcss.config.js',
  },

  build: {
    outDir: '../dist',
    emptyOutDir: true,
    cssCodeSplit: false,
    rollupOptions: {
      input: {
        main:   resolve(__dirname, 'src/index.html'),
        film:   resolve(__dirname, 'src/film.html'),
        shorts: resolve(__dirname, 'src/shorts.html'),
      },
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/gsap')) {
            return 'vendor-gsap';
          }
        },
      },
    },
  },

  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});
