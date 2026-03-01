<!--
- [INPUT]: 依赖 apps/admin 的运行脚本与 OPENKESTREL_DATA_DIR 环境变量约定
- [OUTPUT]: 提供管理后台本地运行与部署配置说明
- [POS]: apps/admin 的使用文档入口
- [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# OpenKestrel Admin

管理后台用于查看审计日志与运营指标。默认端口 `3100`。

## 必填环境变量

- `OPENKESTREL_DATA_DIR`：web 与 admin 共享的数据目录（绝对路径）

示例：

```bash
OPENKESTREL_DATA_DIR=/var/openkestrel-data
```

## 存储驱动切换

- `STORAGE_DRIVER=local`（默认）：读本地共享目录
- `STORAGE_DRIVER=cf`：预留 Cloudflare 存储驱动（当前未接入，启用会显式报错）

## 可选环境变量（后台门禁）

- `ADMIN_BASIC_USER`
- `ADMIN_BASIC_PASS`

两项都设置后，后台会启用 HTTP Basic Auth。

## 本地启动

在仓库根目录执行：

```bash
pnpm dev:admin
```

## 构建

```bash
pnpm build:admin
```
