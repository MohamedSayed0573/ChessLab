import { defineConfig, loadEnv } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), "");
	const target = env.VITE_API_PROXY_TARGET ?? "http://localhost:3000";
	const proxy = {
		"/api": {
			target,
			rewrite: (path: string) => path.replace(/^\/api/, ""),
		},
		"/socket.io": {
			target,
			ws: true,
		},
	};

	return {
		plugins: [react(), babel({ presets: [reactCompilerPreset()] }), tailwindcss()],
		server: { proxy },
		preview: { proxy },
		build: {
			sourcemap: true,
		},
	};
});
