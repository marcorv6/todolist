# Checkpoints — Workspace Evaluation

These are the objective criteria to verify if the sandbox project is in a healthy, complete state.

## C1 — Onboarding and Harness Structure
- [ ] Onboarding files exist under `.agent/` (`navigation.md`, `init.sh`, `feature_list.json`, `progress/current.md`).
- [ ] Documentation files exist under `.agent/docs/` (`architecture.md`, `conventions.md`, `verification.md`).
- [ ] `./.agent/init.sh` executes from the root and returns exit code 0.

## C2 — Development State
- [ ] At most one feature is `in_progress` in `.agent/feature_list.json`.
- [ ] Completed features have associated, passing tests.
- [ ] `.agent/progress/current.md` is clean or only details the active session.

## C3 — API Routing and Integration Contracts
- [ ] `getApiBaseUrl()` (CLI commands) aims to the public API (`getNexusApiOrigin()`).
- [ ] `/pf` requests (`getLoanOperationsBaseUrl()`, `getApplicantSeedsBaseUrl()`, etc.) aim to the private API (`resolveBaseDomain()`).
- [ ] No browser CORS/proxy hacks are active in the codebase; real API endpoints are targetable.
- [ ] Custom headers required by the keys contract (`x-user-token`, `x-platform`, `x-trace-id`) are correctly defined in requests to private `/keys`.
- [ ] Downstream propagation of `x-access-id` is fully supported.

## C4 — Test & Type Validation
- [ ] `npm test` runs and passes all 545+ test assertions cleanly.
- [ ] `npx tsc --noEmit` runs successfully with no TypeScript compilation errors.
