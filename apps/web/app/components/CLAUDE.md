<!--
- [INPUT]: 依赖 app/CLAUDE.md 的模块定位
- [OUTPUT]: 本文档描述 app/components/ 的成员清单
- [POS]: app/components/ 的 L2 模块地图
- [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# components/

> L2 | 父级: [app/CLAUDE.md](../CLAUDE.md)

客户端交互组件集合，均为 `"use client"` 组件。

## 成员清单

- [auth/CLAUDE.md](./auth/CLAUDE.md): 认证交互模块地图（登录/退出入口）
- [compose/CLAUDE.md](./compose/CLAUDE.md): 发帖弹窗模块地图（表单输入与流式发起）
- [hotkeys/CLAUDE.md](./hotkeys/CLAUDE.md): 快捷键模块地图（全局热键 + 帮助弹窗）
- [search/CLAUDE.md](./search/CLAUDE.md): 搜索模块地图（触发器 + 搜索弹窗）
- [theme/CLAUDE.md](./theme/CLAUDE.md): 主题模块地图（三态切换）
- [trigger/CLAUDE.md](./trigger/CLAUDE.md): 发帖触发模块地图（按钮 + StreamCard）
- [modal-engine/CLAUDE.md](./modal-engine/CLAUDE.md): 弹窗引擎模块地图（单实例状态机 + 统一渲染）
