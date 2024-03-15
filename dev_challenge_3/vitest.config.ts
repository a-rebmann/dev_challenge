import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        environment: 'jsdom',
        setupFiles: ['tests/setupTests.ts'],
        coverage: {
            provider: 'v8', // or 'v8'
            reporter: ['text', 'json', 'html'],
            exclude: ['src/index.tsx', 'src/react-app-env.d.ts']
          },
          globals: true,
    }
})