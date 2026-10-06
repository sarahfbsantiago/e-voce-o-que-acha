import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    env: { DATA_SOURCE: "static" },
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
});
