import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
export default defineConfig({ plugins: [react(), tailwindcss()], resolve: { alias: { "@": path.resolve(__dirname, "./src") } }, build: { rollupOptions: { output: { manualChunks: { react: ["react", "react-dom", "react-router-dom"], query: ["@tanstack/react-query"], forms: ["react-hook-form", "@hookform/resolvers", "zod"], http: ["axios"], ui: ["@base-ui/react", "lucide-react", "sonner"] } } } } });
