<!--
- [INPUT]: 依赖 app/CLAUDE.md 的模块定位
- [OUTPUT]: 本文档描述 app/components/ 的成员清单
- [POS]: app/components/ 的 L2 模块地图
- [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# components/

> L2 | 父级: [app/CLAUDE.md](../CLAUDE.md)

## 模块功能综述

- 主要功能：目录「components/」接收页面渲染与用户交互事件，围绕 `auth/` 组织状态更新并输出可复用 UI 组件；输入是 props、上下文状态与键盘/点击事件，输出是组件树与交互回调；本目录不负责后端持久化与领域编排。
- 核心文件：`auth/`（子模块边界）、`compose/`（子模块边界）、`hotkeys/`（子模块边界）、`modal-engine/`（子模块边界）
- 实现原理：以 `auth/` 作为交互入口，按组件依赖关系联动同级文件完成渲染；样式通过 CSS 模块在组件 import 时注入；失败路径采用空状态/禁用态等前端降级策略。
- 相关文件：上游规范 [app/CLAUDE.md](../CLAUDE.md)；同级协作文件见“成员清单”；下游依赖包括 `auth/`、`compose/`、`hotkeys/`。
- 调用链路：`目录入口` -> 输出

## 成员清单

- [auth/CLAUDE.md](./auth/CLAUDE.md): 认证交互模块地图（登录/退出入口）
- [compose/CLAUDE.md](./compose/CLAUDE.md): 发帖弹窗模块地图（表单输入与流式发起）
- [hotkeys/CLAUDE.md](./hotkeys/CLAUDE.md): 快捷键模块地图（全局热键 + 帮助弹窗）
- [search/CLAUDE.md](./search/CLAUDE.md): 搜索模块地图（触发器 + 搜索弹窗）
- [theme/CLAUDE.md](./theme/CLAUDE.md): 主题模块地图（三态切换）
- [trigger/CLAUDE.md](./trigger/CLAUDE.md): 发帖触发模块地图（按钮 + StreamCard）
- [modal-engine/CLAUDE.md](./modal-engine/CLAUDE.md): 弹窗引擎模块地图（单实例状态机 + 统一渲染）
