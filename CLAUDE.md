# CLAUDE.md - AI Assistant Guide for rebuild-web

Last Updated: 2025-11-19

## Repository Overview

**Project Name:** rebuild-web
**Repository Status:** Newly initialized (no source code yet)
**Purpose:** Web application development project

This repository is currently in its initial state. This document serves as a living guide that should be updated as the codebase evolves.

---

## Current Repository State

### Structure
```
rebuild-web/
├── .git/              # Git repository metadata
├── README.md          # Project readme
└── CLAUDE.md          # This file - AI assistant guide
```

### Key Facts
- **No dependencies yet:** No package.json, requirements.txt, or other dependency files
- **No source code:** No application code has been added
- **Clean slate:** Ready for initial project setup

---

## AI Assistant Guidelines

### 1. Development Philosophy

When working on this project, AI assistants should:

- **Ask before assuming:** Since the tech stack isn't defined, always confirm technology choices with the user
- **Be proactive about structure:** Suggest industry-standard project structures for the chosen tech stack
- **Document decisions:** Update this CLAUDE.md file as architectural decisions are made
- **Follow conventions:** Once conventions are established, maintain consistency

### 2. Code Quality Standards

Apply these general principles (update with project-specific standards as they emerge):

- **Readability:** Write clear, self-documenting code with meaningful variable names
- **Modularity:** Keep functions/components small and focused on a single responsibility
- **Testing:** Write tests for new functionality (update with testing framework once chosen)
- **Security:** Never commit secrets, API keys, or sensitive data
- **Performance:** Consider performance implications, especially for web applications

### 3. Git Workflow

**Branch Strategy:**
- Development branches follow the pattern: `claude/claude-md-<session-id>`
- Current branch: `claude/claude-md-mi5u3uziicamhr5e-018Jdo9dkmw5dCioVSnZokYA`

**Commit Practices:**
- Write clear, descriptive commit messages
- Use conventional commits format when possible (e.g., `feat:`, `fix:`, `docs:`, `refactor:`)
- Commit related changes together
- Never force push without explicit permission

**Push Commands:**
```bash
# Always use -u flag for new branches
git push -u origin <branch-name>

# Retry on network failures (up to 4 times with exponential backoff)
```

### 4. File Organization

As the project grows, establish and document:

- **Source code location:** (e.g., `src/`, `app/`, `lib/`)
- **Test location:** (e.g., `__tests__/`, `tests/`, `spec/`)
- **Configuration files:** (e.g., `config/`, root-level configs)
- **Documentation:** (e.g., `docs/`, inline comments)
- **Build artifacts:** (e.g., `dist/`, `build/`, `.next/`)

### 5. Common Tasks

#### Setting Up a New Web Project

When the user requests project initialization, consider:

1. **Choose a framework/stack:**
   - React (with Vite, Next.js, Create React App)
   - Vue.js (with Vite, Nuxt)
   - Angular
   - Svelte/SvelteKit
   - Vanilla HTML/CSS/JS
   - Server-side: Node.js (Express, Fastify), Python (Flask, Django), etc.

2. **Initialize package manager:**
   - npm, yarn, pnpm for Node.js projects
   - pip/poetry for Python projects
   - cargo for Rust projects

3. **Set up essential tooling:**
   - Linter (ESLint, Pylint, etc.)
   - Formatter (Prettier, Black, etc.)
   - Type checker (TypeScript, mypy, etc.)
   - Testing framework (Jest, Vitest, pytest, etc.)

4. **Configure Git:**
   - Create `.gitignore` for the chosen tech stack
   - Set up pre-commit hooks if needed

5. **Update this document:**
   - Document the chosen tech stack
   - Add specific conventions and patterns
   - Include setup instructions

#### Adding Features

When implementing new features:

1. **Understand the requirement:** Ask clarifying questions if needed
2. **Plan the approach:** Use TodoWrite to break down complex tasks
3. **Follow existing patterns:** Maintain consistency with established code
4. **Write tests:** Add appropriate test coverage
5. **Update documentation:** Keep README and CLAUDE.md current

#### Debugging

When fixing bugs:

1. **Reproduce the issue:** Understand the problem fully
2. **Find root cause:** Don't just treat symptoms
3. **Consider edge cases:** Ensure the fix handles all scenarios
4. **Add regression tests:** Prevent the bug from returning
5. **Document if needed:** Note any quirks or important context

### 6. Technology-Specific Guidelines

**This section should be populated once the tech stack is chosen.**

Example structure for when technologies are selected:

```markdown
#### Frontend Framework: [Framework Name]
- Component structure: [pattern to follow]
- State management: [approach/library]
- Styling approach: [CSS modules/Tailwind/CSS-in-JS/etc.]
- Routing: [library/approach]

#### Backend Framework: [Framework Name]
- API structure: [REST/GraphQL/etc.]
- Database: [type and ORM if applicable]
- Authentication: [approach/library]
- Error handling: [pattern to follow]

#### Build & Development
- Development server: [command]
- Build command: [command]
- Test command: [command]
- Lint command: [command]
```

### 7. Dependencies & Package Management

**This section should be updated when dependencies are added.**

Document:
- How to install dependencies
- How to add new dependencies
- Version pinning strategy
- License requirements/restrictions

### 8. Environment & Configuration

**This section should be updated when environment configuration is needed.**

Document:
- Environment variables and their purpose
- How to set up local development environment
- Configuration file locations and formats
- Secrets management approach

### 9. Testing Strategy

**This section should be updated when testing is set up.**

Document:
- Testing framework(s) used
- Test organization and naming conventions
- How to run tests (unit, integration, e2e)
- Coverage requirements
- Mocking strategies

### 10. Deployment

**This section should be updated when deployment is configured.**

Document:
- Hosting platform(s)
- Deployment process
- CI/CD pipeline
- Environment-specific configurations

---

## Decision Log

Track important architectural and technical decisions here:

### 2025-11-19: Repository Initialized
- Created initial repository structure
- Created CLAUDE.md template for future documentation

---

## AI Assistant Dos and Don'ts

### DO:
✅ Ask clarifying questions before making assumptions
✅ Use TodoWrite for complex multi-step tasks
✅ Read existing files before editing them
✅ Follow established patterns in the codebase
✅ Write clear commit messages
✅ Update documentation when making significant changes
✅ Consider security implications (XSS, injection attacks, etc.)
✅ Test changes before committing
✅ Use meaningful variable and function names

### DON'T:
❌ Commit secrets, API keys, or credentials
❌ Force push without explicit permission
❌ Skip reading files before editing them
❌ Create unnecessary files (prefer editing existing ones)
❌ Use emojis unless explicitly requested
❌ Make breaking changes without discussion
❌ Ignore errors or warnings
❌ Leave TODO comments without tracking them
❌ Assume the user's tech stack preferences

---

## Quick Reference

### Essential Commands (to be updated based on tech stack)

```bash
# Development
# [To be added once project is set up]

# Testing
# [To be added once testing is configured]

# Building
# [To be added once build process is established]

# Linting/Formatting
# [To be added once tooling is configured]
```

### Useful File Paths

```
# [To be added as project structure develops]
```

---

## Updating This Document

This CLAUDE.md file should be treated as a living document:

- **When to update:** After major architectural decisions, when new conventions are established, when new tools are added
- **How to update:** Edit this file directly, commit with message like `docs: update CLAUDE.md with [changes]`
- **Who updates:** Any AI assistant or developer working on the project should keep this current

---

## Resources & References

### General Best Practices
- [Google Engineering Practices](https://google.github.io/eng-practices/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/) - Security considerations
- [Conventional Commits](https://www.conventionalcommits.org/) - Commit message format

### Technology-Specific Resources
*To be added as technologies are chosen*

---

## Questions or Unclear About Something?

If you're an AI assistant and encounter something unclear:

1. Check if there's relevant context in recent commits
2. Search the codebase for similar patterns
3. Ask the user for clarification
4. Document the answer in this file for future reference

---

**Note:** This is a template structure. As the `rebuild-web` project develops, this document should be updated with specific information about the chosen technologies, established patterns, and project-specific conventions.
