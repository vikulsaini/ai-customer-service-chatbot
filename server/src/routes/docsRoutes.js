import { Router } from "express";
import { openApiSpec } from "../docs/openapi.js";

const router = Router();

router.get("/openapi.json", (_req, res) => res.json(openApiSpec));

router.get("/docs", (_req, res) => {
  res.type("html").send(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>AI Customer Service Chatbot API Docs</title>
    <style>
      body{font-family:Inter,system-ui,sans-serif;margin:0;background:#f8fafc;color:#0f172a}
      main{max-width:980px;margin:auto;padding:32px}
      pre{background:#0f172a;color:#e2e8f0;padding:18px;border-radius:8px;overflow:auto}
      a{color:#0f766e}
    </style>
  </head>
  <body>
    <main>
      <h1>AI Customer Service Chatbot API</h1>
      <p>Free OpenAPI documentation for the MCA project backend.</p>
      <p><a href="/api/openapi.json">Open OpenAPI JSON</a></p>
      <pre>${JSON.stringify(openApiSpec, null, 2).replaceAll("<", "&lt;")}</pre>
    </main>
  </body>
</html>`);
});

export default router;
