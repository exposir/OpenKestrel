<!--
- [INPUT]: 依赖 dep-graph 包的 CLI/SDK 导出能力
- [OUTPUT]: 提供 dep-graph 的安装与使用说明
- [POS]: dep-graph 对外文档入口
- [PROTOCOL]: 变更时更新此头部，然后检查 ./CLAUDE.md
-->

# @openkestrel/dep-graph

High-performance dependency graph analyzer for TS/JS projects.

## Features

- Detect file-level circular dependencies (SCC).
- Identify mesh dependency hotspots (high fan-in + high fan-out).
- Compute file size and deduplicated dependency-closure size.
- Start local WebGL viewer for aggregate graph and focused file subgraphs.
- Search nodes by file path.

## Usage

```bash
pnpm --filter @openkestrel/dep-graph build
pnpm --filter @openkestrel/dep-graph okdep analyze . --open
```

Analyze only and output report:

```bash
pnpm --filter @openkestrel/dep-graph okdep analyze . --out .okdep/report.json
```

Open viewer from existing report:

```bash
pnpm --filter @openkestrel/dep-graph okdep web --report .okdep/report.json --port 4711
```

Print cycles:

```bash
pnpm --filter @openkestrel/dep-graph okdep print-cycles .
```

Print mesh hotspots:

```bash
pnpm --filter @openkestrel/dep-graph okdep print-mesh .
```

## Notes

- Recommended to run on source directories.
- Running on built artifacts is supported but reflects artifact dependency graph only.
