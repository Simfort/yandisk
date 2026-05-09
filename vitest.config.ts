import { defineConfig } from "vitest/config";
export default defineConfig({
  test: {
    environment: "node",
    env: {
      YANDEX_TOKEN: "y0__xCGrK2dBRjsuj8gyqm27xaZBYyKYvucnGZdrM-fulY3BnMt1g",
    },
  },
});
