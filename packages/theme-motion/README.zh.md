<!--
- [INPUT]: 依赖 theme-motion 包的 core/react/css 导出能力
- [OUTPUT]: 提供 theme-motion 的中文安装与使用说明
- [POS]: theme-motion 对外中文文档入口
- [PROTOCOL]: 变更时更新此头部，然后检查 ./CLAUDE.md
-->

# @openkestrel/theme-motion

基于 View Transition API 的极简主题切换动画工具包。

## 安装

```bash
pnpm add @openkestrel/theme-motion
```

## 使用

### 1) 引入 CSS 预设

```ts
import "@openkestrel/theme-motion/style.css";
```

### 2) 使用 core API

```ts
import {
  setThemeWithMotion,
  toggleLightDarkWithMotion,
} from "@openkestrel/theme-motion/core";

setThemeWithMotion("dark");
toggleLightDarkWithMotion();
```

### 3) 使用 React 辅助 API

```tsx
import {
  useThemeMotion,
  getElementCenterOrigin,
} from "@openkestrel/theme-motion/react";

function ThemeButton() {
  const { theme, setTheme } = useThemeMotion();

  return (
    <button
      onClick={(event) => {
        const next = theme === "dark" ? "light" : "dark";
        setTheme(next, getElementCenterOrigin(event.currentTarget));
      }}
    >
      Toggle
    </button>
  );
}
```

## 导出

- `@openkestrel/theme-motion` -> core exports
- `@openkestrel/theme-motion/core` -> core only
- `@openkestrel/theme-motion/react` -> react helpers
- `@openkestrel/theme-motion/style.css` -> animation preset

英文版文档位于 `README.md`。
