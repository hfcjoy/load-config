import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['./src/index.ts'],
  splitting: false,
  sourcemap: true,
  clean: true,
  minify: true,
  dts: true,
  external: ['esbuild'],
  format: ['cjs', 'esm'],
  platform: 'node'
})
