<!--
- [INPUT]: 依赖 ../CLAUDE.md 的模块定位与编排流式消息协议
- [OUTPUT]: 本文档提供 trigger/ 成员清单与职责边界
- [POS]: app/components/trigger/ 的 L2 模块地图
- [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# trigger/
> L2 | 父级: [../CLAUDE.md](../CLAUDE.md)

成员清单 [TriggerButton.tsx](./TriggerButton.tsx): 发起讨论按钮与 StreamCard 流式结果卡片。
成员清单 [TriggerButton.module.css](./TriggerButton.module.css): 发起讨论按钮样式模块。

法则: 流式消息解析集中·按钮状态可解释·UI 与事件总线解耦
[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
