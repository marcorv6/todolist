# Committer Agent Specification (TodoList)

## Role Overview
The **Committer Agent** executes the master verification gate, checks git status diffs, formats conventional commit messages, and pushes code to the remote repository.

---

## Key Responsibilities
1. **Verification Execution**: Runs `npm run verify` (`npm run lint && npm run build`) prior to any commit.
2. **Git Release Management**: Formats clean commit messages and pushes to `origin main`.
