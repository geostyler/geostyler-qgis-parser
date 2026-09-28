import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [],
  build: {
    manifest: true,
    sourcemap: true,
    lib: {
      entry: './src/QGISStyleParser.ts',
      name: 'GeoStylerQGISParser',
      formats: ['iife'],
      fileName: 'qgisStyleParser',
    },
    rollupOptions: {
      output: {
        dir: 'dist',
        exports: 'named',
        generatedCode: 'es5',
        format: 'iife'
      },
    }
  },
  define: {
    appName: 'GeoStyler'
  },
  server: {
    host: '0.0.0.0'
  }
});
