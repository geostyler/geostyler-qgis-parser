import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    server: {
      deps: {
        inline: true
      }
    },
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'html', 'clover', 'json', 'lcov']
    },
    globals: true,
  },
  define: {
    window: {}
  }
});
