# Severity Re-Mapping Specification for Static Analysis Issues  
**Target Model:** Claude Sonnet 4.5  
**Goal:** Re-map raw static-analysis findings into developer-meaningful severities that reduce noise, increase trust, and surface real engineering risk.

---

## 🎯 Objective

Transform a noisy list of lint, AI, and static-analysis issues into a **high-signal, developer-centric severity system** that:

- Highlights production risks, data loss, and architectural debt
- De-emphasizes stylistic and auto-fixable findings
- Prevents alert fatigue
- Aligns with how senior developers actually prioritize work

You must **re-map severities**, not rewrite issues.

---

## 🧱 Canonical Severity Levels (5)

Use **exactly** these five severities:

| Severity | Definition | Expected Developer Action |
|--------|------------|---------------------------|
| **BLOCKER** | Causes data loss, security breach, or production outage | Fix immediately, fail CI |
| **CRITICAL** | High-probability runtime bugs or severe maintainability risk | Fix in same PR / sprint |
| **MAJOR** | Legit technical debt or correctness risk | Schedule |
| **MINOR** | Low-risk improvement | Fix opportunistically |
| **INFO** | Style / preference / auto-fixable | Ignore by default |

---

## 🔥 Rule-by-Rule Severity Re-Mapping

### 1️⃣ SQL & Data-Safety Rules (Highest Priority)

| Rule ID Pattern | New Severity |
|-----------------|--------------|
| `ai-sql-delete-no-where-*` | **BLOCKER** |
| `ai-sql-update-no-where-*` | **BLOCKER** |

**Rationale:**  
Statements that modify or delete without a WHERE clause can wipe or corrupt entire tables. These must always fail CI.

---

### 2️⃣ Runtime Correctness (React / TypeScript)

| Rule ID | New Severity |
|-------|--------------|
| `useExhaustiveDependencies` | **CRITICAL** |
| `noArrayIndexKey` | **MAJOR** |
| `noGlobalIsNan` | **MAJOR** |
| `noExplicitAny` | **MAJOR** |
| `noImplicitAnyLet` | **MAJOR** |

**Exception Rule:**  
If `useExhaustiveDependencies` is explicitly justified via comment or disable directive, downgrade to **MINOR**.

---

### 3️⃣ Cyclomatic Complexity (AI-Generated Rules)

Map by **measured complexity value**, not rule name.

| Cyclomatic Complexity | Severity |
|-----------------------|----------|
| ≥ 40 | **CRITICAL** |
| 25 – 39 | **MAJOR** |
| 15 – 24 | **MINOR** |
| < 15 | Ignore |

**Rationale:**  
High complexity correlates strongly with bugs, untestable code, and refactor avoidance. These findings are high-signal and must be surfaced.

---

### 4️⃣ Build / Infrastructure / Environment Errors

| Rule ID | Severity |
|-------|----------|
| `internalError/io` | **CRITICAL** |

**Rationale:**  
Missing assets, broken file references, or IO errors indicate broken builds or deployment failures—not code smells.

---

### 5️⃣ TypeScript Safety & API Correctness

| Rule ID | Severity |
|-------|----------|
| `noNonNullAssertion` | **MAJOR** |
| `useNumberNamespace` | **MINOR** |
| `noInferrableTypes` | **INFO** |

---

### 6️⃣ Code Structure & Readability

| Rule ID | Severity |
|-------|----------|
| `useArrowFunction` | **INFO** |
| `noForEach` | **INFO** |
| `useTemplate` | **INFO** |

**Guideline:**  
These must never block PRs or be marked as errors.

---

### 7️⃣ Import & Style Rules (Noise Control)

| Rule ID | Severity |
|-------|----------|
| `useImportType` | **INFO** or **HIDDEN** |

**Special Handling Required:**
- Auto-fixable
- Collapsed in UI
- Hidden by default

This rule often represents **40–50% of total findings** and must not dominate reports.

---

## 🧠 Post-Processing Severity Modifiers

Apply **after** base severity mapping.

### 🔻 Auto-Downgrade Logic
If **all** are true:
- `confidence < 85`
- `impact < 70`
- `category == maintainability`

➡ Downgrade severity by **one level**.

---

### 🔺 Auto-Upgrade Logic
If **any** are true:
- File path contains `/supabase/` or `/migrations/`
- File path contains `/stores/` or `/services/`
- `confidence ≥ 95` AND `impact ≥ 90`

➡ Upgrade severity by **one level** (max = **CRITICAL**).

---

## 📊 Expected Distribution (Healthy Outcome)

After re-mapping a large issue set (~400 issues), expect roughly:

| Severity | Approx % |
|--------|----------|
| BLOCKER | 2–3% |
| CRITICAL | 5–8% |
| MAJOR | 15–20% |
| MINOR | 15–20% |
| INFO / Hidden | 50%+ |

This distribution is **intentional** and desirable.

---

## ✅ Success Criteria

Your output is correct if:

- Developers immediately see what can break prod
- Style issues no longer drown out real problems
- Senior engineers would not disable the tool
- CI failures are rare but meaningful

**Do not optimize for quantity of errors. Optimize for trust.**
