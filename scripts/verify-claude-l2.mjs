#!/usr/bin/env node
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = process.cwd();
const BANNED_MAIN = [
  "模块能力组织与对外暴露",
  "业务逻辑实现与依赖协作",
  "前端交互与状态驱动渲染",
  "文档规范沉淀与知识索引",
  "接口请求处理与响应编排",
];
const BANNED_IMPL = [
  "参数不合法或依赖缺失时立即中断并返回明确错误",
  "边界条件在文件内显式校验并快速失败",
  "异常路径在当前目录内兜底并向上抛出可诊断信息",
];
const FORBIDDEN_NODE =
  /(?:\.module\.css|\.css|package\.json|README(?:\.zh)?\.md|tsconfig(?:\.[^`\s]+)?\.json|\.md|index\.html)$/i;

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === ".next" || name === "dist" || name === ".git") continue;
    const abs = join(dir, name);
    const st = statSync(abs);
    if (st.isDirectory()) walk(abs, out);
    else if (name === "CLAUDE.md") out.push(abs);
  }
  return out;
}

function getField(text, field) {
  const m = text.match(new RegExp(`^- ${field}：(.*)$`, "m"));
  return m ? m[1].trim() : "";
}

function parseChainNodes(chain) {
  return chain
    .split("->")
    .map((s) => s.trim())
    .filter(Boolean)
    .filter((s) => s !== "输出" && s !== "`输出`")
    .map((s) => {
      const tick = s.match(/`([^`]+)`/);
      return tick ? tick[1].trim() : s;
    });
}

const files = walk(ROOT)
  .map((abs) => relative(ROOT, abs))
  .filter((p) => p !== "CLAUDE.md");

const errors = [];
for (const relPath of files) {
  const text = readFileSync(join(ROOT, relPath), "utf8");

  if (!text.includes("[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md")) {
    errors.push(`${relPath}: 缺少固定 PROTOCOL 语句`);
  }

  const main = getField(text, "主要功能");
  for (const phrase of BANNED_MAIN) {
    if (main.includes(phrase)) errors.push(`${relPath}: 主要功能仍包含模板化短语「${phrase}」`);
  }

  const impl = getField(text, "实现原理");
  for (const phrase of BANNED_IMPL) {
    if (impl.includes(phrase)) errors.push(`${relPath}: 实现原理仍包含模板化短语「${phrase}」`);
  }

  const chain = getField(text, "调用链路");
  if (chain && !chain.includes("->")) {
    errors.push(`${relPath}: 调用链路缺少 '->'`);
  }

  const isDocs = relPath.startsWith("docs/") || relPath.includes("/docs/");
  if (!isDocs && chain) {
    const nodes = parseChainNodes(chain);
    for (const node of nodes) {
      if (FORBIDDEN_NODE.test(node)) {
        errors.push(`${relPath}: 非 docs 调用链路包含禁止节点「${node}」`);
      }
    }
  }
}

if (errors.length > 0) {
  console.error("[verify-claude-l2] Failed:\n");
  for (const err of errors) console.error(`- ${err}`);
  process.exit(1);
}

console.log(`[verify-claude-l2] OK (${files.length} files checked)`);
