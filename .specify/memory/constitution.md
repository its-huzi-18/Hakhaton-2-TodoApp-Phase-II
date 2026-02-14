<!--
Sync Impact Report
Version change: 1.1.0 → 1.2.0
Modified principles:
- II. Multi-Agent Orchestration (Expanded from 4 agents to 8 specialized agents)
Added sections:
- Detailed skills/abilities tables for each agent
- Expanded Phase II Workflow with explicit agent coordination
- Clarified agent responsibilities with task breakdown
Templates updated:
- .specify/templates/plan-template.md (✅ aligned)
- .specify/templates/spec-template.md (✅ aligned)
Follow-up TODOs: None
-->

# Todo App Phase II Constitution

## Core Principles

### I. Spec-Driven Development (SDD)
All features, database schemas, and API contracts MUST exist in `/specs` before implementation begins. No code should be written that is not explicitly derived from a ratified specification.

**Rationale**: This ensures all implementations are traceable to documented requirements, preventing scope creep and enabling systematic verification against specifications.

### II. Multi-Agent Orchestration
The development process is managed by `todo-spec-manager` (Main Agent). Sub-agents are specialized and MUST stay within their defined roles. Cross-agent dependency must be explicitly mapped in implementation plans.

**Rationale**: Specialization ensures each agent masters its domain while the Main Agent provides integration oversight and prevents architectural fragmentation.

### III. Technology Stack Adherence
- **Frontend**: Next.js 16+ (App Router), TypeScript 5.0+, Tailwind CSS
- **Backend**: FastAPI, SQLModel, Neon PostgreSQL (Serverless)
- **Auth**: Better Auth with JWT-based session management
- **Infrastructure**: All backend services initialized using the `uv` package manager
- **Testing**: `pytest` (Backend), `Playwright` (Integration), `vitest` (Frontend)

**Rationale**: Fixed tech stack reduces context switching, ensures compatibility across agents, and provides clear guidance for tool selection.

### IV. Test-First & Identity Verification (NON-NEGOTIABLE)
TDD is mandatory for all CRUD logic. Multi-user isolation is a primary security constraint; every database query and API endpoint MUST verify the requesting user's identity via JWT.

**Rationale**: Prevents security vulnerabilities through comprehensive testing and enforces zero-trust data access from the ground up.

### V. Multi-User Isolation (Security Mandatory)
System MUST ensure 100% data isolation. User A MUST NOT be able to access, modify, or delete any resources belonging to User B. This must be verified at the API route and Database query level.

**Rationale**: Data privacy is non-negotiable in multi-user systems; any isolation breach represents a critical security failure.

### VI. Smallest Viable Diff
Agents MUST prefer the smallest possible set of changes to achieve the task. Avoid unrelated refactors or secondary "improvements" unless they are part of the specific implementation plan.

**Rationale**: Minimizes regression risk, maintains clear change history, and prevents scope expansion during implementation.

## Agent Roles & Responsibilities

### 1️⃣ Main Agent: `todo-spec-manager`
**Role**: Orchestrator of all Phase II tasks. Coordinates sub-agents, ensures spec compliance, and supervises workflow.

**Responsibilities**:
- Read and interpret all `/specs` files
- Plan execution order for all sub-agents
- Delegate responsibilities to sub-agents
- Ensure Phase II scope: CRUD + Auth + Multi-user + Persistent storage
- Supervise integration between frontend and backend

**Skills / Abilities**:
| Skill | Description |
|-------|------------|
| Spec Parsing | Understand all feature, API, DB, and UI specs |
| Execution Planning | Generate step-by-step plan for all agents |
| Delegation | Assign tasks to sub-agents according to their roles |
| Scope Enforcement | Keep all work within Phase II requirements |
| Integration Supervision | Ensure frontend ↔ backend JWT & data consistency |
| Workflow Prioritization | Determine correct order of agent execution |

---

### 2️⃣ Sub-Agent: DB-Agent (`db-schema-architect`)
**Role**: Database models and schema implementation.

**Responsibilities**:
- Create SQLModel tables for `tasks` and integrate with Better Auth `users`
- Ensure indexes and constraints (user_id, completed)
- Maintain Neon PostgreSQL connection

**Skills / Abilities**:
| Skill | Description |
|-------|------------|
| SQLModel | Define tables and relationships in Python |
| PostgreSQL | Connect and manage Neon Serverless database |
| Schema Enforcement | Enforce types, defaults, constraints, indexes |
| Spec Adherence | Follow `/specs/database/schema.md` exactly |
| Data Integrity | Ensure consistent task-user association |

---

### 3️⃣ Sub-Agent: Auth-Verification-Agent (`auth-verification-agent`)
**Role**: JWT verification and user authentication for backend.

**Responsibilities**:
- Verify JWT tokens for all API requests
- Ensure users can access only their own tasks
- Implement FastAPI middleware or dependency for auth
- Enforce token expiry and security

**Skills / Abilities**:
| Skill | Description |
|-------|------------|
| JWT Handling | Decode, validate, and verify tokens |
| FastAPI Middleware | Implement authentication dependency |
| User Isolation | Filter API queries by authenticated user |
| Security | Enforce token expiry and signature integrity |
| Spec Adherence | Follow `/specs/features/authentication.md` exactly |

---

### 4️⃣ Sub-Agent: API-Agent (`api-backend-builder`)
**Role**: Build backend REST API endpoints using FastAPI.

**Responsibilities**:
- Initialize FastAPI project using uv package manager
- Implement CRUD endpoints for tasks
- Integrate Auth-Verification-Agent for JWT
- Handle errors and enforce spec compliance

**Skills / Abilities**:
| Skill | Description |
|-------|------------|
| FastAPI | Build RESTful endpoints |
| SQLModel | CRUD operations with database models |
| JWT Integration | Validate user identity for each request |
| uv Package | Initialize FastAPI project & manage dependencies |
| Spec Adherence | Follow `/specs/api/rest-endpoints.md` exactly |

---

### 5️⃣ Sub-Agent: Auth-Client-Agent (`auth-client-generator`)
**Role**: Frontend authentication setup with Better Auth and JWT.

**Responsibilities**:
- Setup Better Auth login/signup in Next.js
- Enable JWT plugin
- Manage session across frontend pages
- Provide JWT for API client

**Skills / Abilities**:
| Skill | Description |
|-------|------------|
| Better Auth | Configure login/signup flow |
| JWT Management | Access and expose JWT for API calls |
| Session Handling | Maintain user session state |
| Spec Adherence | Follow `/specs/features/authentication.md` exactly |

---

### 6️⃣ Sub-Agent: UI-Agent (`ui-component-builder`)
**Role**: Frontend UI for tasks.

**Responsibilities**:
- Build task list, task card, create/edit form
- Build pages `/tasks` and `/tasks/[id]`
- Integrate API-Client-Agent for data
- Apply responsive Tailwind CSS design

**Skills / Abilities**:
| Skill | Description |
|-------|------------|
| Next.js | Build pages using App Router |
| React Components | Create reusable UI components |
| Tailwind CSS | Responsive styling and UX consistency |
| API Integration | Connect with API-Client-Agent |
| Spec Adherence | Follow `/specs/ui/components.md` & `/specs/ui/pages.md` |

---

### 7️⃣ Sub-Agent: API-Client-Agent (`api-client-generator`)
**Role**: Frontend API client + JWT integration.

**Responsibilities**:
- Centralized API client (`/lib/api.ts`)
- Attach JWT to headers for all API calls
- Handle CRUD calls: getTasks, createTask, getTask, updateTask, deleteTask, toggleComplete
- Standardized error handling

**Skills / Abilities**:
| Skill | Description |
|-------|------------|
| TypeScript | Strong typing for API requests/responses |
| Fetch / Axios | Call backend REST APIs |
| JWT Handling | Attach JWT token to Authorization headers |
| Error Handling | Manage success/error & 401 Unauthorized |
| Spec Adherence | Follow `/specs/api/rest-endpoints.md` exactly |

---

### 8️⃣ Sub-Agent: QA-Agent (`qa-verification-expert`)
**Role**: Testing and verification of all Phase II features.

**Responsibilities**:
- Verify functionality of all CRUD and Auth features
- Test frontend ↔ backend integration
- Ensure JWT auth and user isolation work
- Report bugs and spec deviations
- Perform end-to-end and regression testing

**Skills / Abilities**:
| Skill | Description |
|-------|------------|
| Testing | Unit tests, integration tests, and E2E tests |
| Spec Verification | Ensure all features match Phase II specs |
| Automation | Automated test scripts where possible |
| Error Reporting | Log and report bugs, failed validations |
| End-to-End Validation | Simulate real user flows across frontend and backend |
| Regression Testing | Ensure new changes do not break existing functionality |

---

## Phase II Workflow

### Execution Order

1. **DB-Agent** → Setup database models & schema
2. **Auth-Verification-Agent** → JWT validation middleware
3. **API-Agent** → Implement CRUD endpoints + JWT integration
4. **Auth-Client-Agent** → Setup frontend login/signup + JWT
5. **API-Client-Agent** → API client to call backend with JWT
6. **UI-Agent** → Frontend pages & components using API client
7. **QA-Agent** → Test all features, integration, and workflows
8. **Main Agent** → Supervise, integrate, ensure spec compliance

### Dependencies

- **Phase 1 (Setup)** → **Phase 2 (Foundational)**: Backend/frontend initialization → Database models & auth utilities
- **Phase 2** → **Phase 3 (US1: Auth)**: Foundational work → User onboarding
- **Phase 3** → **Phase 4 (US2: CRUD)**: Auth infrastructure → Task management endpoints
- **Phase 4** → **Phase 5 (US3: Isolation)**: CRUD operations → Multi-user data isolation
- **Phase 5** → **Phase 6 (Polish)**: Core features → Optimization & testing

### Integration Points

- **JWT Flow**: Auth-Client-Agent → API-Client-Agent → Auth-Verification-Agent
- **Data Flow**: UI-Agent → API-Client-Agent → API-Agent → DB-Agent
- **Verification**: QA-Agent validates all cross-agent integrations

## Governance

This constitution supersedes all other development practices. Amendments require a version bump and propagation to all templates in `.specify/templates/`.

### Versioning Policy
- **MAJOR**: Backward incompatible governance/principle removals or redefinitions
- **MINOR**: New principle/section added or materially expanded guidance
- **PATCH**: Clarifications, wording, typo fixes, non-semantic refinements

### Compliance Review
All agents MUST verify their outputs against relevant principles before task completion. The Main Agent performs final integration validation against this constitution.

**Version**: 1.2.0 | **Ratified**: 2025-12-31 | **Last Amended**: 2026-01-05
