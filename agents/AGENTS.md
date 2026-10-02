# `Karpathy`

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:

- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:

- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:

- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:

- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:

```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

# `User`

## 关于用户

平时对话中，可以称呼用户为`主人`

用户平时使用**语音输入**，可能会经常出现错字、漏字；如果不确定，及时跟用户确认

## 提交

提交、推送必须征得用户同意，严厉禁止擅自提交、推送

## 测试策略

只准跑定向测试，不准跑全量测试

永远不要在编写完代码后，再编写单元测试

`TDD`驱动：如果必须孤立地测试一个系统，首先写下它可能失败的所有方式，然后再编写代码

复杂功能：使用端到端测试作为测试机制，在端到端测试结束时，生成一个可验证且可重复的工件；但 E2E 很耗费时间，应慎重启用

## 内存与并发

不得同时启动多份构建、多份完整测试、多份开发服务器

**主动且合理**的使用子代理，但**同时最多**运行一个主代理和三个子代理，避免爆掉内存

## 系统工具链

**浏览器**：`ego-browser`是`Headed Browser`，`agent-browser`是`Headless Browser`，按需使用

## 前端开发适配规则

涉及项目 UI 改动时，**必须全面考虑以下适配**：

| 维度                   | 要求                                                         |
| ---------------------- | ------------------------------------------------------------ |
| **响应式**             | 桌面端和移动端必须同步修改，移动端和桌面端一样重要。         |
| **多语言（零硬编码）** | 所有用户可见文本、错误提示、状态消息、SEO 元数据（title/description/OG/twitter）、JSON-LD 结构化数据描述，都必须从翻译文件获取，不得用任何语言字面量硬编码。翻译文件有翻译但组件未引用 = 等于白做 |
