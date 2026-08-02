import { Agent } from "node:http";
import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(() => {
	const target = "http://127.0.0.1:3000";
	const agent = new Agent({ family: 4, keepAlive: true });
	const proxy = {
		"/api": {
			target,
			agent,
			changeOrigin: true,
			rewrite: (path: string) => path.replace(/^\/api/, ""),
		},
		"/socket.io": {
			target,
			agent,
			changeOrigin: true,
			ws: true,
		},
	};

	return {
		plugins: [react(), babel({ presets: [reactCompilerPreset()] }), tailwindcss()],
		server: { host: "0.0.0.0", proxy },
		preview: { host: "0.0.0.0", proxy },
		build: {
			sourcemap: true,
		},
	};
});
