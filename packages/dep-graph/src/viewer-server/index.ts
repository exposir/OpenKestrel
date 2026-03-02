/**
 * - [INPUT]: 依赖分析报告数据与本地静态资源目录
 * - [OUTPUT]: 导出 startViewer 以启动本地 WebGL 可视化服务
 * - [POS]: viewer-server 运行时入口，桥接 CLI 与浏览器端
 * - [PROTOCOL]: 变更时更新此头部，然后检查 ../../CLAUDE.md
 */

import fs from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

import open from "open";

import type { AnalysisReport, ViewerHandle, ViewerOptions } from "../types.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const VIEWER_DIR = path.resolve(__dirname, "../viewer-app");

export async function startViewer(
  reportOrPath: AnalysisReport | string,
  options: ViewerOptions = {}
): Promise<ViewerHandle> {
  const host = options.host ?? "127.0.0.1";
  const port = options.port ?? 4711;

  const report = typeof reportOrPath === "string" ? await loadReport(reportOrPath) : reportOrPath;
  const payload = JSON.stringify(report);

  const server = http.createServer(async (req, res) => {
    const method = req.method ?? "GET";
    const pathname = (req.url ?? "/").split("?")[0] ?? "/";

    if (method !== "GET") {
      res.statusCode = 405;
      res.end("Method Not Allowed");
      return;
    }

    if (pathname === "/api/report") {
      res.setHeader("content-type", "application/json; charset=utf-8");
      res.end(payload);
      return;
    }

    const filePath = resolveStaticPath(pathname);
    if (!filePath) {
      res.statusCode = 404;
      res.end("Not Found");
      return;
    }

    try {
      const content = await fs.readFile(filePath);
      res.setHeader("content-type", mimeByPath(filePath));
      res.end(content);
    } catch {
      res.statusCode = 404;
      res.end("Not Found");
    }
  });

  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, host, () => resolve());
  });

  const url = `http://${host}:${port}`;

  if (options.openBrowser) {
    await open(url);
  }

  return {
    url,
    close: async () => {
      await new Promise<void>((resolve, reject) => {
        server.close((error) => {
          if (error) {
            reject(error);
            return;
          }
          resolve();
        });
      });
    }
  };
}

async function loadReport(reportPath: string): Promise<AnalysisReport> {
  const content = await fs.readFile(path.resolve(reportPath), "utf8");
  return JSON.parse(content) as AnalysisReport;
}

function resolveStaticPath(requestPath: string): string | null {
  const normalized = requestPath === "/" ? "/index.html" : requestPath;
  const resolved = path.resolve(VIEWER_DIR, `.${normalized}`);
  if (!resolved.startsWith(VIEWER_DIR)) {
    return null;
  }
  return resolved;
}

function mimeByPath(filePath: string): string {
  if (filePath.endsWith(".html")) {
    return "text/html; charset=utf-8";
  }
  if (filePath.endsWith(".css")) {
    return "text/css; charset=utf-8";
  }
  if (filePath.endsWith(".js")) {
    return "application/javascript; charset=utf-8";
  }
  if (filePath.endsWith(".json")) {
    return "application/json; charset=utf-8";
  }
  return "application/octet-stream";
}
