
import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                miradas: resolve(__dirname, 'miradas-complices.html'),
            },
        },
    },
})
