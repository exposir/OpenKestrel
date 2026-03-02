<!--
- [INPUT]: 依赖 ../CLAUDE.md 的模块定位与 theme-motion 适配能力
- [OUTPUT]: 本文档提供 theme/ 成员清单与职责边界
- [POS]: app/components/theme/ 的 L2 模块地图
- [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# theme/
> L2 | 父级: [../CLAUDE.md](../CLAUDE.md)


## 模块功能综述

- 主要功能：围绕「theme/」实现具体业务能力，当前重点是 React 组件实现文件，负责界面与交互逻辑。
- 核心文件：`ThemeToggle.tsx`。
- 实现原理：由单一核心文件直接承载功能实现，对外暴露稳定调用入口。
- 相关文件：上游规范 [../CLAUDE.md](./../CLAUDE.md)；下游模块 无子模块；相关实现见本文件“成员清单”。
## 成员清单

- [`ThemeToggle.tsx`](./ThemeToggle.tsx)：React 组件实现文件，负责界面与交互逻辑

