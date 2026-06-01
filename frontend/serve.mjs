import { join } from "path";
import ssrHandler from "./dist/server/server.js";

const clientDir = join(import.meta.dir, "dist/client");

Bun.serve({
  port: 3000,
  async fetch(req) {
    const url = new URL(req.url);
    const filePath = join(clientDir, url.pathname);
    const file = Bun.file(filePath);
    if (await file.exists()) return new Response(file);
    return ssrHandler.fetch(req);
  },
});

console.log("Frontend running on port 3000");
