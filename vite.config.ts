import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
    base: "/strategy-guide/",
    plugins: [
        VitePWA({
            registerType: "autoUpdate",
            // add this to cache all the imports
            workbox: {
                globPatterns: ["**/*"],
            },
            // add this to cache all the
            // static assets in the public folder
            includeAssets: ["**/*"],
            manifest: {
                name: "Navigace",
                short_name: "Navigace",
                display: "standalone",
                scope: "/strategy-guide/",
                start_url: "/strategy-guide/",
                description: "Navigace pomocí patrolovací strategie",
                theme_color: "#ffffff",
                icons: [
                    {
                        src: "/strategy-guide/web-app-manifest-192x192.png",
                        sizes: "192x192",
                        type: "image/png",
                        purpose: "maskable",
                    },
                    {
                        src: "/strategy-guide/web-app-manifest-512x512.png",
                        sizes: "512x512",
                        type: "image/png",
                        purpose: "maskable",
                    },
                ],
            },
        }),
        react(),
    ],
});
