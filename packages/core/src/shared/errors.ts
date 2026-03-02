/**
 * - [INPUT]: 无外部依赖，使用原生 Error 作为基类
 * - [OUTPUT]: 导出 DomainError / ValidationError 领域错误类型
 * - [POS]: core 共享错误模型，供各域 value object 与 use case 统一抛错
 * - [PROTOCOL]: 变更时更新此头部，然后检查 packages/core/CLAUDE.md
 */
export class DomainError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = new.target.name;
  }
}

export class ValidationError extends DomainError {
  constructor(message?: string) {
    super(message);
    this.name = new.target.name;
  }
}
