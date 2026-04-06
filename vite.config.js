import { defineConfig } from 'vite';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import sitemap from 'vite-plugin-sitemap';
import { resolve } from 'path';

export default defineConfig({
  root: 'src',
  // On GitHub Actions the env var is automatically 'true'; locally stays '/'
  base: process.env.GITHUB_ACTIONS === 'true' ? '/paste-studio/' : '/',

  plugins: [
    ViteImageOptimizer({
      jpg:  { quality: 80 },
      jpeg: { quality: 80 },
      png:  { quality: 90 },
      webp: { lossless: false, quality: 80 },
    }),
    // Routes auto-discovered from rollupOptions.input; 404 excluded from sitemap
    sitemap({
      hostname: 'https://pastedseries.com',
      exclude: ['/404'],
      readable: true,
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
    target: 'es2018',
    reportCompressedSize: false,
    chunkSizeWarningLimit: 200,
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
        // Readable asset filenames: [name]-[hash][ext]
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
  },

  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});
