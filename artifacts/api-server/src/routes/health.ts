import { Router, type IRouter } from "express";
import { HealthCheckResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/healthz", (_req, res) => {
  const data = HealthCheckResponse.parse({ status: "ok" });
  res.json(data);
});

// Isotope health-check compatibility routes.
// pwa-local.js polls /api/version every 10 s to determine if the local server
// is running. In Replit, the proxy routes /api/* here before isotope sees it,
// so we return a minimal 200 response that satisfies the r.ok check.
router.get("/version", (_req, res) => {
  res.json({
    local_server: true,
    version: process.env["npm_package_version"] ?? "3.1.2",
    source: "api-server-proxy",
  });
});

router.get("/check-update", (_req, res) => {
  res.json({ update_available: false, source: "api-server-proxy" });
});

export default router;
