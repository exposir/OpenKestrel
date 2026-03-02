<!--
- [INPUT]: 依赖 app/CLAUDE.md 的模块定位
- [OUTPUT]: 本文档描述 app/components/ 的成员清单
- [POS]: app/components/ 的 L2 模块地图
- [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# components/

> L2 | 父级: [app/CLAUDE.md](../CLAUDE.md)


## 模块功能综述

- 主要功能：围绕「components/」实现具体业务能力，当前重点是 负责该目录的核心业务实现。
- 核心文件：以成员清单中的入口与实现文件为核心。
- 实现原理：由单一核心文件直接承载功能实现，对外暴露稳定调用入口。
- 相关文件：上游规范 [../CLAUDE.md](./../CLAUDE.md)；下游模块 无子模块；相关实现见本文件“成员清单”。
## 成员清单

- [auth/CLAUDE.md](./auth/CLAUDE.md): 认证交互模块地图（登录/退出入口）
- [compose/CLAUDE.md](./compose/CLAUDE.md): 发帖弹窗模块地图（表单输入与流式发起）
- [hotkeys/CLAUDE.md](./hotkeys/CLAUDE.md): 快捷键模块地图（全局热键 + 帮助弹窗）
- [search/CLAUDE.md](./search/CLAUDE.md): 搜索模块地图（触发器 + 搜索弹窗）
- [theme/CLAUDE.md](./theme/CLAUDE.md): 主题模块地图（三态切换）
- [trigger/CLAUDE.md](./trigger/CLAUDE.md): 发帖触发模块地图（按钮 + StreamCard）
- [modal-engine/CLAUDE.md](./modal-engine/CLAUDE.md): 弹窗引擎模块地图（单实例状态机 + 统一渲染）
