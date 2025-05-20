
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
      port: 3001,
      ...(isSSL && {
        https: {
          key: fs.readFileSync(path.resolve(__dirname, "certs-old/localhost+3-key.pem")),
          cert: fs.readFileSync(path.resolve(__dirname, "certs-old/localhost+3.pem")),
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
