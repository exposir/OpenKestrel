import nextVitals from "eslint-config-next/core-web-vitals";

const nextConfigFiles = ["apps/web/**/*.{js,jsx,ts,tsx}", "apps/admin/**/*.{js,jsx,ts,tsx}"];

const scopedNextVitals = nextVitals.map((config) => ({
  ...config,
  files: nextConfigFiles,
}));

export default [
  {
    ignores: ["**/node_modules/**", "**/.next/**", "**/dist/**", "**/output/**", "pnpm-lock.yaml"],
  },
  ...scopedNextVitals,
  {
    files: nextConfigFiles,
    rules: {
      "comma-dangle": "off",
      indent: "off",
      quotes: "off",
      semi: "off",
      "object-curly-spacing": "off",
    },
  },
];
