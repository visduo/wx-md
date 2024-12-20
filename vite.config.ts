import path from 'node:path'
import process from 'node:process'

import vue from '@vitejs/plugin-vue'
import { visualizer } from 'rollup-plugin-visualizer'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default defineConfig({
        base: `/`,
        define: {
            process,
        },
        plugins: [
            vue(),
            UnoCSS(),
            vueDevTools(),
            nodePolyfills({
                include: [`path`, `util`, `timers`, `stream`, `fs`],
                overrides: {
                    // Since `fs` is not supported in browsers, we can use the `memfs` package to polyfill it.
                    // fs: 'memfs',
                },
            }),
            process.env.ANALYZE === `true` && visualizer({
                emitFile: true,
                filename: `stats.html`,
            }),
            AutoImport({
                resolvers: [],
            }),
            Components({
                resolvers: [],
            }),
        ],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, `./src`),
            },
        },
        css: {
            devSourcemap: true,
        },
    },
)
