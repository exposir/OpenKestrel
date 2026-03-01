/**
 * - [INPUT]: 依赖 TypeScript 配置文件与模块解析能力
 * - [OUTPUT]: 提供 tsconfig 解析结果与模块解析上下文
 * - [POS]: analyzer 配置适配层，桥接项目配置与依赖解析
 * - [PROTOCOL]: 变更时更新此头部，然后检查 ../../CLAUDE.md
 */

import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

export interface TsContext {
  configPath?: string;
  options: ts.CompilerOptions;
  host: ts.ModuleResolutionHost;
}

export function createTsContext(root: string): TsContext {
  const configPath = ts.findConfigFile(root, ts.sys.fileExists, "tsconfig.json");
  const host: ts.ModuleResolutionHost = {
    fileExists: ts.sys.fileExists,
    readFile: ts.sys.readFile,
    directoryExists: ts.sys.directoryExists,
    realpath: ts.sys.realpath,
    getCurrentDirectory: () => root,
    getDirectories: ts.sys.getDirectories
  };

  if (!configPath) {
    return {
      options: {
        allowJs: true,
        moduleResolution: ts.ModuleResolutionKind.Bundler,
        module: ts.ModuleKind.ESNext,
        target: ts.ScriptTarget.ES2022,
        jsx: ts.JsxEmit.ReactJSX
      },
      host
    };
  }

  const configText = fs.readFileSync(configPath, "utf8");
  const parsedConfigFile = ts.parseConfigFileTextToJson(configPath, configText);
  const parsed = ts.parseJsonConfigFileContent(
    parsedConfigFile.config,
    ts.sys,
    path.dirname(configPath)
  );

  return {
    configPath,
    options: {
      allowJs: true,
      ...parsed.options
    },
    host
  };
}
