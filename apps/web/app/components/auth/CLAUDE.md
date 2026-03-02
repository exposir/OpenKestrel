<!--
- [INPUT]: 依赖 ../CLAUDE.md 的模块定位与认证交互边界
- [OUTPUT]: 本文档提供 auth/ 成员清单与职责边界
- [POS]: app/components/auth/ 的 L2 模块地图
- [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# auth/
> L2 | 父级: [../CLAUDE.md](../CLAUDE.md)

成员清单 [AuthButton.tsx](./AuthButton.tsx): 登录/退出入口，承载 OAuth/credentials 发起与状态展示。

法则: 认证交互单点入口·Provider 探测失败可降级·未登录状态可解释
[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
