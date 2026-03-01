/**
 * - [INPUT]: 依赖 next-auth 与 OAuth/本地登录环境变量（AUTH_SECRET / AUTH_GITHUB_ID / AUTH_GITHUB_SECRET / AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET / AUTH_DEV_USER / AUTH_DEV_PASS / AUTH_DEV_LOGIN_ENABLED），以及 src/audit/logger.ts
 * - [OUTPUT]: 导出 auth/handlers/signIn/signOut，供 API 路由与页面鉴权调用
 * - [POS]: src/auth/ 的认证入口，统一管理登录会话策略
 * - [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { logAuditEvent } from "../audit/logger";
import { ensureEnvLoaded } from "../env/load";

ensureEnvLoaded();

function hasValue(value: string | undefined): boolean {
  return Boolean(value && value.trim());
}

const providers = [];

if (
  hasValue(process.env.AUTH_GITHUB_ID) &&
  hasValue(process.env.AUTH_GITHUB_SECRET)
) {
  providers.push(
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID ?? "",
      clientSecret: process.env.AUTH_GITHUB_SECRET ?? "",
    }),
  );
}

if (
  hasValue(process.env.AUTH_GOOGLE_ID) &&
  hasValue(process.env.AUTH_GOOGLE_SECRET)
) {
  providers.push(
    Google({
      clientId: process.env.AUTH_GOOGLE_ID ?? "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET ?? "",
    }),
  );
}

const enableDevLogin =
  process.env.AUTH_DEV_LOGIN_ENABLED === "true" ||
  process.env.NODE_ENV !== "production";

if (enableDevLogin) {
  const devUser = process.env.AUTH_DEV_USER?.trim() || "admin";
  const devPass = process.env.AUTH_DEV_PASS?.trim() || "admin123";
  providers.push(
    Credentials({
      id: "credentials",
      name: "本地账号",
      credentials: {
        username: { label: "用户名", type: "text" },
        password: { label: "密码", type: "password" },
      },
      async authorize(credentials) {
        const username =
          typeof credentials?.username === "string" ? credentials.username : "";
        const password =
          typeof credentials?.password === "string" ? credentials.password : "";
        if (username !== devUser || password !== devPass) {
          return null;
        }
        return {
          id: `local:${devUser}`,
          name: devUser,
          email: `${devUser}@local.openkestrel`,
        };
      },
    }),
  );
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  events: {
    async signIn({ user, account, isNewUser }) {
      await logAuditEvent({
        category: "auth",
        action: "sign_in",
        status: "success",
        actor: {
          name: user.name,
          email: user.email,
        },
        metadata: {
          provider: account?.provider ?? "unknown",
          is_new_user: isNewUser,
        },
      });
    },
    async signOut(message) {
      const sessionUserId =
        "session" in message ? (message.session?.userId ?? null) : null;
      const token = "token" in message ? message.token : undefined;
      await logAuditEvent({
        category: "auth",
        action: "sign_out",
        status: "success",
        actor: {
          id: sessionUserId,
          email: token?.email ?? null,
        },
        metadata: {
          session_present: Boolean(sessionUserId),
        },
      });
    },
  },
  providers,
});
