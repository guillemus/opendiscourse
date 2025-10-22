// @ts-check

import 'dotenv/config'
import react from '@astrojs/react'
import vercel from '@astrojs/vercel'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import { defineConfig } from 'astro/config'

import tailwindcss from '@tailwindcss/vite'

// https://astro.build/config
export default defineConfig({
    output: 'server',
    integrations: [react()],
    devToolbar: { enabled: false },
    vite: {
        server: {
            allowedHosts: [process.env.PUBLIC_NGROK_URL ?? ''],
        },
        plugins: [
            // @ts-ignore
            tailwindcss(),

            // @ts-ignore
            tanstackRouter({
                target: 'react',
                autoCodeSplitting: true,
                routesDirectory: './src/routes',
                generatedRouteTree: './src/routeTree.gen.ts',
            }),
        ],
    },

    adapter: vercel(),
})
