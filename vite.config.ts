
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode, command }) => {
  const isSSL = mode === "ssl";

  return {
    server: {
      host: "::",
      port: 8080,
      ...(isSSL && {
        https: {
          key: fs.readFileSync(path.resolve(__dirname, "certs/key.pem")),
          cert: fs.readFileSync(path.resolve(__dirname, "certs/cert.pem")),
        },
      }),
    },
    plugins: [react(), mode === "development" && componentTagger()].filter(
      Boolean
    ),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
