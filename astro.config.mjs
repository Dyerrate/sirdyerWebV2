// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  vite: {
    // Spark is only reached via a lazy import(), so the dev server would
    // otherwise discover it mid-visit and force a full page reload.
    optimizeDeps: { include: ['@sparkjsdev/spark'] },
  },
});
