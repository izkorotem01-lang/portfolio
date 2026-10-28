import fs from "node:fs";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    {
      // Copy Overhaul (EN): emit dist/en.html with the new English title/social meta.
      // Cloudflare static assets serve /en from en.html; every other route (incl. /hb)
      // keeps index.html exactly as before.
      name: "rizz-en-head",
      apply: "build",
      enforce: "post",
      writeBundle(options) {
        const outDir = options.dir ?? "dist";
        const indexPath = path.join(outDir, "index.html");
        if (!fs.existsSync(indexPath)) return;
        const source = fs.readFileSync(indexPath, "utf8");
        const OLD_TITLE = "RIZZ Productions | We help brands & creators look undeniable on video";
        const NEW_TITLE = "RIZZ Productions | We turn your videos into clients";
        const html = source.split(OLD_TITLE).join(NEW_TITLE);
        if (html === source) {
          this.warn("rizz-en-head: old title not found in index.html; en.html not emitted");
          return;
        }
        fs.writeFileSync(path.join(outDir, "en.html"), html);
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  assetsInclude: ["**/*.JPG", "**/*.jpg", "**/*.jpeg", "**/*.JPEG"],
}));
