/**
 * - [INPUT]: 依赖 next-auth 与 GitHub/Google OAuth 环境变量（AUTH_SECRET / AUTH_GITHUB_ID / AUTH_GITHUB_SECRET / AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET）
 * - [OUTPUT]: 导出 auth/handlers/signIn/signOut，供 API 路由与页面鉴权调用
 * - [POS]: 项目根目录的认证入口，统一管理登录会话策略
 * - [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

export const { auth, handlers, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID ?? "",
      clientSecret: process.env.AUTH_GITHUB_SECRET ?? "",
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID ?? "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET ?? "",
    }),
  ],
});
