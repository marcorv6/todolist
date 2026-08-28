# TodoList Multi-Agent Development Harness

Welcome to the **TodoList** repository. This document serves as the master operating manual and coordination harness for AI agents collaborating on the project.

---

## 🏗️ 4-Agent Team Architecture

Our development workflow is divided into four explicit, specialized agent roles:

```
                      +-------------------+
                      |   ORCHESTRATOR    |
                      | (Planner & Lead)  |
                      +---------+---------+
                                |
             +------------------+------------------+
             |                                     |
             v                                     v
     +---------------+                     +---------------+
     |    BUILDER    |                     |    TESTER     |
     | (Code & UI)   |                     | (QA & Validation)
     +-------+-------+                     +-------+-------+
             |                                     |
             +------------------+------------------+
                                |
                                v
                      +-------------------+
                      |    COMMITTER      |
                      | (Verify & Push)   |
                      +-------------------+
```

---

### 1. 🎯 Orchestrator Agent (`.agent/roles/orchestrator.md`)
- **Primary Responsibility**: Goal planning, feature breakdown, backlog tracking, and architecture compliance.
- **Key Artifacts**: `.agent/feature_list.json`, `.agent/progress/current.md`.

### 2. ⚡ Builder Agent (`.agent/roles/builder.md`)
- **Primary Responsibility**: Feature development across components (`components/`), Next.js App Router (`app/`), database queries (`lib/db/`), and state handlers.
- **Guidelines**: Maintains Tailwind styling standards, Framer Motion animations, and React 19 purity rules.

### 3. 🧪 Tester Agent (`.agent/roles/tester.md`)
- **Primary Responsibility**: Quality assurance, API route validation, component prop verification, and edge-case testing.

### 4. 🚀 Committer Agent (`.agent/roles/committer.md`)
- **Primary Responsibility**: Verification gate execution (`npm run verify`), git diff auditing, conventional commit formatting, and remote repository pushes.

---

## 🛠️ Verification & Pipeline Commands

```bash
# Run ESLint check
npm run lint

# Run Next.js production build
npm run build

# Master Verification Gate (MANDATORY BEFORE PUSH)
npm run verify
```
