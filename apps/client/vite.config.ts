import path from "node:path";
import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), babel({ presets: [reactCompilerPreset()] }), tailwindcss()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
			"@assets": path.resolve(__dirname, "./src/assets"),
			"@components": path.resolve(__dirname, "./src/components"),
			"@contexts": path.resolve(__dirname, "./src/contexts"),
			"@hooks": path.resolve(__dirname, "./src/hooks"),
			"@icons": path.resolve(__dirname, "./src/icons"),
			"@layouts": path.resolve(__dirname, "./src/layouts"),
			"@pages": path.resolve(__dirname, "./src/pages"),
			"@stockfish": path.resolve(__dirname, "./src/stockfish"),
			"@app-types": path.resolve(__dirname, "./src/types"),
			"@utils": path.resolve(__dirname, "./src/utils"),
			"@services": path.resolve(__dirname, "./src/services"),
			"@constants": path.resolve(__dirname, "./src/constants"),
		},
	},
	server: {
		port: 4173,
	},
	build: {
		sourcemap: true,
	},
});
