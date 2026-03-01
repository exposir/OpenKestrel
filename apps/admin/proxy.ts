/**
 * - [INPUT]: 依赖 ADMIN_BASIC_USER/ADMIN_BASIC_PASS 环境变量与请求头
 * - [OUTPUT]: 导出 proxy，可选启用后台 Basic Auth 保护
 * - [POS]: apps/admin/ 的访问边界层
 * - [PROTOCOL]: 变更时更新此头部，然后检查 apps/admin/CLAUDE.md
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function decodeBasicAuth(value: string): { user: string; pass: string } | null {
  if (!value.startsWith("Basic ")) return null;
  const encoded = value.slice(6);
  try {
    const decoded = Buffer.from(encoded, "base64").toString("utf-8");
    const split = decoded.indexOf(":");
    if (split < 0) return null;
    return {
      user: decoded.slice(0, split),
      pass: decoded.slice(split + 1),
    };
  } catch {
    return null;
  }
}

export function proxy(req: NextRequest) {
  const adminUser = process.env.ADMIN_BASIC_USER;
  const adminPass = process.env.ADMIN_BASIC_PASS;
  if (!adminUser || !adminPass) {
    return NextResponse.next();
  }

  const parsed = decodeBasicAuth(req.headers.get("authorization") ?? "");
  if (parsed && parsed.user === adminUser && parsed.pass === adminPass) {
    return NextResponse.next();
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="OpenKestrel Admin", charset="UTF-8"',
    },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
