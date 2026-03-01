<!--
- [INPUT]: 依赖 src/CLAUDE.md 的模块索引，及 app/api/auth + app/api/orchestrate 的事件上下文
- [OUTPUT]: 提供 src/audit/ 的日志写入职责与接口约定
- [POS]: src/audit/ 的 L2 模块地图
- [PROTOCOL]: 变更时更新此头部，然后检查 src/CLAUDE.md
-->

# src/audit/
> L2 | 父级: [src/CLAUDE.md](../CLAUDE.md)

成员清单 [logger.ts](./logger.ts): 审计日志写入器，JSONL 落盘至 `OPENKESTREL_DATA_DIR/audit/YYYY-MM-DD.jsonl`，暴露 `logAuditEvent/getRequestContext`。

法则: 事件结构统一·写入失败不阻断主流程·按日切分日志文件·默认脱敏最小化
[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
