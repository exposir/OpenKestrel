<!--
- [INPUT]: 依赖 theme-motion 包的 core/react/css 导出能力
- [OUTPUT]: 提供 theme-motion 的安装与使用说明
- [POS]: theme-motion 对外文档入口
- [PROTOCOL]: 变更时更新此头部，然后检查 ./CLAUDE.md
-->

# @openkestrel/theme-motion

Minimal theme transition toolkit based on View Transition API.

## Install

```bash
pnpm add @openkestrel/theme-motion
```

## Usage

### 1) Import CSS preset

```ts
import "@openkestrel/theme-motion/style.css";
```

### 2) Use core API

```ts
import { setThemeWithMotion, toggleLightDarkWithMotion } from "@openkestrel/theme-motion/core";

setThemeWithMotion("dark");
toggleLightDarkWithMotion();
```

### 3) Use React helper

```tsx
import { useThemeMotion, getElementCenterOrigin } from "@openkestrel/theme-motion/react";

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

## Exports

- `@openkestrel/theme-motion` -> core exports
- `@openkestrel/theme-motion/core` -> core only
- `@openkestrel/theme-motion/react` -> react helpers
- `@openkestrel/theme-motion/style.css` -> animation preset
