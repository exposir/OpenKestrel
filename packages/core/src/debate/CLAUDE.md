<!--
- [INPUT]: 依赖 ../CLAUDE.md 的模块定位与边界约束
- [OUTPUT]: 本文档提供本目录成员清单与职责边界
- [POS]: debate/ 的 L2 模块地图
- [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->

# debate/

> L2 | 父级: [../CLAUDE.md](../CLAUDE.md)

## 模块功能综述

- 主要功能：目录「debate/」接收上游模块调用并围绕 `application/` 组织业务处理链路，输出可复用的函数、类型或端口能力；输入是业务参数、依赖注入对象或环境上下文，输出是确定性处理结果；本目录不负责页面展示层。
- 核心文件：`application/`（子模块边界）、`domain/`（子模块边界）、`infrastructure-ports/`（子模块边界）
- 实现原理：由 `application/` 作为导入入口，按同级依赖完成处理并向上层返回结果；失败路径通过显式异常或错误对象上抛给调用方统一处置。
- 相关文件：上游规范 [../CLAUDE.md](../CLAUDE.md)；同级协作文件见“成员清单”；下游依赖包括 `application/`、`domain/`、`infrastructure-ports/`。
- 调用链路：`目录入口` -> 输出

## 成员清单

- [`application/`](./application)：子模块目录，承载该子域实现
- [`domain/`](./domain)：子模块目录，承载该子域实现
- [`infrastructure-ports/`](./infrastructure-ports)：子模块目录，承载该子域实现
