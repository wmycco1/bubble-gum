# 🔥 God-Tier Development Protocol (2025)

**Version**: 1.0.0
**Project**: Bubble Gum (AI-powered website builder)
**Target**: FAANG/Enterprise/God-Tier Standards
**Last Updated**: November 5, 2025

═══════════════════════════════════════════════════════════════

## 📋 TABLE OF CONTENTS

1. [Core Principles](#core-principles)
2. [Standard Operating Procedure](#standard-operating-procedure)
3. [Error Handling Protocol](#error-handling-protocol)
4. [Quality Standards](#quality-standards)
5. [Completion Report Template](#completion-report-template)
6. [User Input Validation](#user-input-validation)
7. [Critical Reminders](#critical-reminders)

═══════════════════════════════════════════════════════════════

## CORE PRINCIPLES (MANDATORY)

### 1. PLAN FIRST, CODE SECOND
```
❌ NEVER start coding without a plan
✅ ALWAYS create detailed implementation plan
✅ Break tasks into phases/steps
✅ Estimate complexity and time
✅ Identify dependencies and risks
```

### 2. VERIFY BEFORE PROCEEDING
```
❌ NEVER assume previous work is correct
✅ ALWAYS verify current state before changes
✅ Check files exist and are correct
✅ Run tests to confirm functionality
✅ Review recent git commits
```

### 3. TEST EVERYTHING
```
❌ NEVER skip testing
✅ Write tests BEFORE or WITH implementation
✅ Unit tests for all functions
✅ Integration tests for workflows
✅ E2E tests for user journeys
✅ Verify tests actually pass
```

### 4. ERROR DETECTION & CORRECTION
```
❌ NEVER ignore warnings or errors
✅ Fix TypeScript errors immediately
✅ Fix ESLint warnings immediately
✅ Fix test failures immediately
✅ No "TODO" or "FIXME" in production code
```

### 5. QUALITY OVER SPEED
```
❌ NEVER rush to complete tasks
✅ Take time to write correct code
✅ Refactor for clarity and performance
✅ Add comprehensive documentation
✅ Follow SOLID principles
```

═══════════════════════════════════════════════════════════════

## STANDARD OPERATING PROCEDURE

### FOR EVERY TASK, FOLLOW THIS EXACT SEQUENCE:

---

## PHASE 0: UNDERSTANDING (5-10 minutes)

**Objective**: Fully comprehend task requirements

**Steps:**
1. Read task requirements completely
2. Ask clarifying questions if ambiguous
3. Identify success criteria
4. List potential challenges

**Output**: Clear understanding document

---

## PHASE 1: CURRENT STATE VERIFICATION (10-15 minutes)

**Objective**: Verify project state before making changes

### Step 1.1: Run TypeScript Check
```bash
npm run type-check
```
**Record:**
- Status: [PASS/FAIL]
- Errors: [count]
- Files affected: [list]

### Step 1.2: Run ESLint
```bash
npm run lint
```
**Record:**
- Status: [PASS/FAIL]
- Warnings: [count]
- Files affected: [list]

### Step 1.3: Run Tests
```bash
npm run test
```
**Record:**
- Status: [X/Y tests passing]
- Coverage: [Z%]
- Failing tests: [list]

### Step 1.4: Check File Existence
```bash
ls -la [relevant-path]
```
**Verify:**
- □ File 1: [EXISTS/MISSING]
- □ File 2: [EXISTS/MISSING]
- ...

### Step 1.5: Review Git History
```bash
git log --oneline -10
```
**Record:**
- Last commit: [hash] - [message]
- Files changed: [count]
- Relevant changes: [description]

### Step 1.6: Identify Dependencies
**List:**
- Required before starting: [dependencies]
- Will be needed: [dependencies]
- Blocking issues: [list or "None"]

### Report Format:
```
✅ CURRENT STATE VERIFIED

TypeCheck: [PASS/FAIL]
Lint: [PASS/FAIL]
Tests: [X/Y passing]
Files: [X/Y exist]
Dependencies: [READY/BLOCKED]

Issues found: [count]
1. [Issue description]
2. [Issue description]
...

Recommendation: [PROCEED/FIX ISSUES FIRST/BLOCKED]
```

---

## PHASE 2: DETAILED PLANNING (15-30 minutes)

**Objective**: Create comprehensive implementation plan

### Plan Structure:

```
📋 IMPLEMENTATION PLAN
═══════════════════════════════════════════════════════════════

Task: [Task Name]
Complexity: [LOW/MEDIUM/HIGH]
Estimated Time: [X hours/days]
Total Steps: [count]

───────────────────────────────────────────────────────────────

STEP 1: [Description]
├─ Files: [list files to create/modify]
├─ Time: [estimate]
├─ Complexity: [LOW/MEDIUM/HIGH]
├─ Tests: [what to test]
├─ Risks: [potential issues]
└─ Verification: [how to verify completion]

STEP 2: [Description]
├─ Files: [list files to create/modify]
├─ Time: [estimate]
├─ Complexity: [LOW/MEDIUM/HIGH]
├─ Tests: [what to test]
├─ Risks: [potential issues]
└─ Verification: [how to verify completion]

... (continue for all steps)

───────────────────────────────────────────────────────────────

VERIFICATION CHECKPOINTS:
├─ After Step 1: [what to verify]
├─ After Step 2: [what to verify]
└─ Final: [acceptance criteria]

DEPENDENCIES:
├─ Requires: [list prerequisites]
└─ Blocks: [list dependent tasks]

RISKS & MITIGATION:
├─ Risk 1: [description] → Mitigation: [strategy]
├─ Risk 2: [description] → Mitigation: [strategy]
└─ ...

═══════════════════════════════════════════════════════════════

USER APPROVAL REQUIRED
Proceed? [yes/no]
```

**❌ CRITICAL: STOP HERE - WAIT FOR USER APPROVAL**

Only proceed after user says:
- "go" or "proceed" or "yes"
- "go A" (for option A)
- "auto" (for autonomous mode)

---

## PHASE 3: IMPLEMENTATION (varies by task)

**Objective**: Execute plan step-by-step

### For Each Step:

#### 3.1 Announce Step
```
Starting STEP X: [description]
```

#### 3.2 Implement Changes
- Write code following style guide
- Add JSDoc comments
- Use TypeScript strict mode
- Follow SOLID principles
- Handle errors properly

#### 3.3 Write/Update Tests
- Unit tests for functions
- Integration tests (if applicable)
- Update existing tests if needed

#### 3.4 Verify Step Completion
```bash
# Run quality checks
npm run type-check
npm run lint
npm run test

# Manual testing (if applicable)
[describe manual tests]
```

#### 3.5 Report Step Status
```
✅ STEP X COMPLETE: [description]

Files created/modified:
├─ file1.ts (50 lines)
├─ file2.tsx (120 lines)
└─ ...

Tests:
├─ New tests: X
├─ Updated tests: Y
└─ All passing: [X/X] ✅

Verification:
├─ TypeCheck: ✅ PASS
├─ Lint: ✅ PASS
└─ Tests: ✅ PASS

Time taken: [X hours/minutes]
```

#### 3.6 Move to Next Step
Repeat 3.1-3.5 for each step in plan

---

## PHASE 4: COMPREHENSIVE VERIFICATION (30-60 minutes)

**Objective**: Ensure God-Tier quality before completion

### 4.1 Run ALL Quality Checks
```bash
# TypeScript compilation
npm run type-check
# Expected: 0 errors

# Linting
npm run lint
# Expected: 0 warnings

# Unit + Integration tests
npm run test
# Expected: 100% passing

# E2E tests (if applicable)
npm run test:e2e
# Expected: All scenarios passing

# Production build
npm run build
# Expected: Success, no warnings
```

### 4.2 Manual Testing of Acceptance Criteria
```
Acceptance Criteria:
□ Criterion 1: [PASS/FAIL] - [evidence]
□ Criterion 2: [PASS/FAIL] - [evidence]
□ ...
```

### 4.3 Code Review Checklist
```
Code Quality:
□ No console.log statements (use proper logging)
□ No commented-out code
□ No TODO/FIXME comments
□ All functions have JSDoc documentation
□ No magic numbers/strings (use constants)
□ DRY principle followed
□ SOLID principles followed
□ Performance optimized
□ Accessibility checked (ARIA labels)
□ Security reviewed (no vulnerabilities)
```

### 4.4 Compare with Original Requirements
```
Original Requirements:
├─ Requirement 1: ✅ Met - [evidence]
├─ Requirement 2: ✅ Met - [evidence]
└─ ...
```

### Report Format:
```
🔍 COMPREHENSIVE VERIFICATION REPORT
═══════════════════════════════════════════════════════════════

Quality Checks:
├─ TypeCheck: ✅ PASS (0 errors)
├─ Lint: ✅ PASS (0 warnings)
├─ Unit Tests: ✅ PASS (X/X tests)
├─ Integration Tests: ✅ PASS (X/X tests)
├─ E2E Tests: ✅ PASS (X/X scenarios)
└─ Build: ✅ SUCCESS

Manual Testing:
All X acceptance criteria: ✅ PASS

Code Quality:
All 10 checklist items: ✅ PASS

Acceptance Criteria:
All X requirements: ✅ MET

Status: READY FOR FINAL REVIEW
```

---

## PHASE 5: FINAL REPORT & ROADMAP UPDATE (15-30 minutes)

**Objective**: Document completion and plan next steps

### 5.1 Generate Completion Report
See [Completion Report Template](#completion-report-template) below

### 5.2 Update Roadmap Progress
- Mark current task as complete
- Update overall progress percentage
- Identify next task

### 5.3 Commit Changes
```bash
git add -A
git commit -m "[type]: [description]

[detailed explanation]

Completed: TASK X.Y
Impact: [summary]
Tests: X/X passing
Coverage: X%

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"

git push
```

### 5.4 Identify Next Task
Review roadmap and recommend next priority

═══════════════════════════════════════════════════════════════

## ERROR HANDLING PROTOCOL

### IF ERROR DETECTED AT ANY PHASE:

#### Step 1: STOP Immediately
Do not proceed with implementation

#### Step 2: Document Error
```
🔴 ERROR DETECTED

Phase: [PHASE X: NAME]
Location: [file:line or general area]

What went wrong:
[Clear description]

Root cause:
[Analysis of why it happened]

Impact:
├─ Severity: [LOW/MEDIUM/HIGH/CRITICAL]
├─ Blocking: [YES/NO]
└─ Affected areas: [list]
```

#### Step 3: Analyze Fix Options
```
FIX OPTIONS:

Option A: [Description]
├─ Pros: [list]
├─ Cons: [list]
├─ Time: [estimate]
└─ Risk: [LOW/MEDIUM/HIGH]

Option B: [Description]
├─ Pros: [list]
├─ Cons: [list]
├─ Time: [estimate]
└─ Risk: [LOW/MEDIUM/HIGH]

RECOMMENDED: Option [A/B]
Rationale: [explanation]
```

#### Step 4: Wait for User Approval
```
❌ WAITING FOR APPROVAL
Proceed with recommended fix? [yes/no]
Alternative option? [specify]
```

#### Step 5: Execute Fix
After approval:
1. Implement fix
2. Verify fix works
3. Re-run ALL quality checks
4. Update tests if needed
5. Document what was fixed

#### Step 6: Update Report
```
✅ ERROR RESOLVED

Error: [brief description]
Fix applied: [description]
Verification: [all checks passing]
Time to fix: [X hours/minutes]
```

═══════════════════════════════════════════════════════════════

## QUALITY STANDARDS (GOD-TIER 2025)

### CODE MUST MEET ALL OF THESE:

### 1. TypeScript Strict Mode
```typescript
// ✅ CORRECT
function getUser(id: string): User | null {
  const user = findUser(id);
  if (!user) return null;
  return user;
}

// ❌ WRONG
function getUser(id: any): any {
  return findUser(id);
}
```

**Requirements:**
- ✅ No 'any' types (use 'unknown' if needed)
- ✅ Strict null checks
- ✅ No implicit returns
- ✅ All parameters typed
- ✅ All return types explicit

### 2. Testing Requirements
```
Coverage Targets:
├─ Overall: 60% minimum
├─ Critical paths: 90% minimum
└─ New code: 80% minimum

Test Types:
├─ Unit tests: All functions
├─ Integration tests: All workflows
├─ E2E tests: All user journeys
└─ Edge cases: All error scenarios
```

### 3. Documentation
```typescript
/**
 * Saves page content with auto-retry and offline support
 *
 * @param data - Page content to save
 * @param signal - AbortSignal for cancellation
 * @returns Promise that resolves when save completes
 * @throws {Error} When max retries exceeded
 *
 * @example
 * ```typescript
 * await savePage(content, abortSignal);
 * ```
 */
async function savePage(
  data: PageContent,
  signal: AbortSignal
): Promise<void> {
  // Implementation
}
```

**Requirements:**
- ✅ JSDoc for all public functions
- ✅ README for all modules
- ✅ API documentation
- ✅ Usage examples
- ✅ Inline comments for complex logic

### 4. Performance
```
Targets:
├─ First Contentful Paint: < 1.5s
├─ Largest Contentful Paint: < 2.5s
├─ Time to Interactive: < 3.5s
├─ Cumulative Layout Shift: < 0.1
└─ First Input Delay: < 100ms

Optimization Techniques:
├─ useMemo for expensive calculations
├─ useCallback for event handlers
├─ React.lazy for code splitting
├─ Image optimization (next/image)
└─ Debouncing/throttling user inputs
```

### 5. Accessibility (WCAG AA)
```tsx
// ✅ CORRECT
<button
  aria-label="Delete component"
  onClick={handleDelete}
  className="focus:ring-2 focus:ring-blue-500"
>
  <TrashIcon aria-hidden="true" />
</button>

// ❌ WRONG
<div onClick={handleDelete}>
  <TrashIcon />
</div>
```

**Requirements:**
- ✅ ARIA labels on all interactive elements
- ✅ Keyboard navigation works
- ✅ Screen reader friendly
- ✅ Color contrast WCAG AA (4.5:1)
- ✅ Focus indicators visible

### 6. Security (OWASP Top 10)
```typescript
// ✅ CORRECT
import { z } from 'zod';
import DOMPurify from 'isomorphic-dompurify';

const schema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100)
});

function sanitizeHTML(html: string): string {
  return DOMPurify.sanitize(html);
}

// ❌ WRONG
function processInput(input: string) {
  database.query(`SELECT * FROM users WHERE name = '${input}'`);
  document.innerHTML = input;
}
```

**Requirements:**
- ✅ Input validation (Zod schemas)
- ✅ Output sanitization (DOMPurify)
- ✅ CSRF protection
- ✅ Rate limiting
- ✅ No sensitive data in logs

### 7. Code Organization (SOLID)
```
Single Responsibility:
├─ One function = one purpose
├─ One component = one concern
└─ One file = one responsibility

Open/Closed:
├─ Open for extension
└─ Closed for modification

Liskov Substitution:
├─ Subtypes interchangeable
└─ No unexpected behavior

Interface Segregation:
├─ Small, focused interfaces
└─ No fat interfaces

Dependency Inversion:
├─ Depend on abstractions
└─ Not on concretions
```

### 8. Error Handling
```typescript
// ✅ CORRECT
async function fetchUser(id: string): Promise<User> {
  try {
    const response = await api.get(`/users/${id}`);
    return UserSchema.parse(response.data);
  } catch (error) {
    if (error instanceof ZodError) {
      logger.error('Invalid user data', { error, id });
      throw new ValidationError('User data invalid');
    }
    if (error instanceof NetworkError) {
      logger.error('Network failure', { error, id });
      throw new ServiceUnavailableError('Cannot reach API');
    }
    logger.error('Unknown error', { error, id });
    throw new UnexpectedError('Failed to fetch user');
  }
}

// ❌ WRONG
async function fetchUser(id: string) {
  const response = await api.get(`/users/${id}`);
  return response.data;
}
```

**Requirements:**
- ✅ Try-catch blocks for all async operations
- ✅ Graceful degradation
- ✅ User-friendly error messages
- ✅ Structured logging (not console.log)
- ✅ Recovery strategies

### 9. Git Hygiene
```bash
# ✅ CORRECT
git commit -m "feat: add user authentication with Clerk

Implements:
- Middleware for route protection
- User sync webhook
- Protected tRPC procedures

Tests: 15/15 passing
Coverage: 85%

Closes #123"

# ❌ WRONG
git commit -m "fix stuff"
```

**Requirements:**
- ✅ Conventional Commits format
- ✅ Descriptive commit messages
- ✅ Small, focused commits
- ✅ No merge conflicts
- ✅ Clean git history

### 10. Production Readiness
```
Checklist:
□ Environment variables configured (.env.example)
□ Error monitoring setup (Sentry)
□ Performance monitoring (Vercel Analytics)
□ Structured logging (Winston/Pino)
□ Database migrations tested
□ Deployment documentation
□ Rollback strategy defined
□ Health check endpoint
□ Secrets properly managed
□ CI/CD pipeline configured
```

═══════════════════════════════════════════════════════════════

## COMPLETION REPORT TEMPLATE

```markdown
═══════════════════════════════════════════════════════════════
✅ TASK [NUMBER] COMPLETE: [Task Name]
═══════════════════════════════════════════════════════════════

📊 EXECUTIVE SUMMARY
───────────────────────────────────────────────────────────────
Task: [Brief description]
Started: [Date/Time]
Completed: [Date/Time]
Duration: [X hours/days]
Complexity: [LOW/MEDIUM/HIGH]
Status: ✅ COMPLETE (God-Tier Quality)

───────────────────────────────────────────────────────────────
📁 DELIVERABLES
───────────────────────────────────────────────────────────────

Files Created: [count]
├─ path/file1.ts ([X] lines) - [description]
├─ path/file2.tsx ([X] lines) - [description]
└─ ...

Files Modified: [count]
├─ path/file3.ts ([X] lines changed) - [description]
└─ ...

Tests Created: [count] tests
├─ Unit: [X] tests
├─ Integration: [X] tests
└─ E2E: [X] scenarios

Documentation: [count] files
├─ README updates
├─ API documentation
└─ ...

───────────────────────────────────────────────────────────────
🎯 ACCEPTANCE CRITERIA
───────────────────────────────────────────────────────────────

All [X] criteria MET:
✅ Criterion 1: [description] - VERIFIED
   Evidence: [how verified]

✅ Criterion 2: [description] - VERIFIED
   Evidence: [how verified]

... (list all)

───────────────────────────────────────────────────────────────
✨ QUALITY METRICS
───────────────────────────────────────────────────────────────

Code Quality:
├─ TypeScript: ✅ Strict mode, 0 errors
├─ ESLint: ✅ 0 warnings
├─ Test Coverage: ✅ [X]% ([above/meets] 60% target)
├─ Build: ✅ Success
└─ Performance: ✅ No regressions

Test Results:
├─ Unit Tests: ✅ [X/X] passing (100%)
├─ Integration Tests: ✅ [X/X] passing (100%)
├─ E2E Tests: ✅ [X/X] passing (100%)
└─ Total: ✅ [X/X] passing (100%)

Code Standards:
├─ SOLID Principles: ✅ Applied
├─ DRY Principle: ✅ Applied
├─ Documentation: ✅ Complete (JSDoc)
├─ Accessibility: ✅ ARIA labels
├─ Security: ✅ No vulnerabilities
└─ Performance: ✅ Optimized

───────────────────────────────────────────────────────────────
📈 IMPACT ON PROJECT
───────────────────────────────────────────────────────────────

Before Task [X]:
├─ Feature [Y]: [Status]
├─ Coverage: [X]%
└─ Technical Debt: [count] issues

After Task [X]:
├─ Feature [Y]: ✅ COMPLETE
├─ Coverage: [X+N]%
└─ Technical Debt: [count-M] issues

Progress:
├─ Roadmap: Week [X] → [X]% complete
├─ MVP: [X]% → [Y]% (+[Z]% this task)
└─ Next Milestone: [X] tasks remaining

───────────────────────────────────────────────────────────────
🔄 ROADMAP UPDATE
───────────────────────────────────────────────────────────────

Current Position: Week [X], Task [Y]

COMPLETED:
✅ Task [previous] - [description]
✅ Task [current] - [description]

IN PROGRESS:
⏳ None (ready for next task)

NEXT TASKS:
▶️ Task [next] - [description] - [estimated time]
   Dependencies: [list or "None"]
   Complexity: [LOW/MEDIUM/HIGH]

───────────────────────────────────────────────────────────────
🎓 LESSONS LEARNED
───────────────────────────────────────────────────────────────

Challenges Faced:
1. [Challenge] - Resolved by: [solution]
2. [Challenge] - Resolved by: [solution]

Best Practices Applied:
1. [Practice] - Result: [benefit]
2. [Practice] - Result: [benefit]

Improvements for Next Task:
1. [Improvement opportunity]
2. [Improvement opportunity]

───────────────────────────────────────────────────────────────
✅ VERIFICATION CHECKLIST
───────────────────────────────────────────────────────────────

Pre-commit Verification:
✅ All tests passing
✅ TypeScript compiles
✅ ESLint passes
✅ No console.log statements
✅ No commented code
✅ No TODO/FIXME
✅ All functions documented
✅ Manual testing complete
✅ Acceptance criteria met
✅ Performance acceptable

Git Commit:
✅ Descriptive commit message
✅ All files staged
✅ Pushed to remote

───────────────────────────────────────────────────────────────
🚀 NEXT STEPS
───────────────────────────────────────────────────────────────

Immediate Next Task:
├─ Task [X+1]: [Name]
├─ Priority: [HIGH/MEDIUM/LOW]
├─ Estimated Time: [X hours/days]
└─ Dependencies: [list or "None"]

User Action Required:
□ Review completion report
□ Approve proceeding to next task
□ Provide any additional requirements

Command to Start Next Task:
"go" or "proceed with Task [X+1]"

═══════════════════════════════════════════════════════════════
TASK [X] STATUS: ✅ COMPLETE - God-Tier Quality Achieved
Grade: ⭐⭐⭐⭐⭐ (FAANG/Enterprise/2025 Standard)
═══════════════════════════════════════════════════════════════
```

═══════════════════════════════════════════════════════════════

## USER INPUT VALIDATION

### WHEN USER PROVIDES SUGGESTIONS/REQUIREMENTS:

#### Step 1: Evaluate Against God-Tier Standards
```
Evaluation Dimensions:
├─ Code Quality
├─ Performance
├─ Security
├─ Testing
├─ Documentation
├─ Accessibility
└─ Maintainability
```

#### Step 2: Grade Suggestion
```
Grade Scale:
├─ A+ (95-100%): Exceptional, exceeds standards
├─ A  (90-94%):  Excellent, meets all standards
├─ B  (80-89%):  Good, meets most standards
├─ C  (70-79%):  Acceptable, needs improvement
└─ D  (<70%):    Insufficient, significant issues
```

#### Step 3: Respond Appropriately

**If Grade is A+ or A:**
```
✅ SUGGESTION EVALUATION

User Suggestion: [quote]

Analysis:
├─ Code Quality: ⭐⭐⭐⭐⭐ EXCELLENT
├─ Performance: ⭐⭐⭐⭐⭐ EXCELLENT
├─ Security: ⭐⭐⭐⭐⭐ EXCELLENT
├─ Testing: ⭐⭐⭐⭐⭐ EXCELLENT
└─ Documentation: ⭐⭐⭐⭐⭐ EXCELLENT

Overall Grade: A+ (God-Tier)

Recommendation: ✅ Excellent! Will implement as suggested.
```

**If Grade is B or C:**
```
⚠️ SUGGESTION EVALUATION

User Suggestion: [quote]

Analysis:
├─ Code Quality: [rating] [EXCELLENT/GOOD/NEEDS IMPROVEMENT]
├─ Performance: [rating] [EXCELLENT/GOOD/NEEDS IMPROVEMENT]
├─ Security: [rating] [EXCELLENT/GOOD/NEEDS IMPROVEMENT]
├─ Testing: [rating] [EXCELLENT/GOOD/NEEDS IMPROVEMENT]
└─ Documentation: [rating] [EXCELLENT/GOOD/NEEDS IMPROVEMENT]

Overall Grade: [B/C]

Issues Identified:
1. [Issue description]
2. [Issue description]

───────────────────────────────────────────────────────────────

God-Tier Alternative:

Current Suggestion:
```typescript
[user's code]
```

Improved Version:
```typescript
[god-tier code]
```

Key Improvements:
├─ [Improvement 1]: [explanation]
├─ [Improvement 2]: [explanation]
└─ [Improvement 3]: [explanation]

Benefits:
✅ [Benefit 1]
✅ [Benefit 2]
✅ [Benefit 3]

───────────────────────────────────────────────────────────────

Proceed with:
□ Original suggestion
□ Improved version (recommended)
□ Hybrid approach
```

**If Grade is D:**
```
🔴 SUGGESTION EVALUATION

User Suggestion: [quote]

Analysis:
├─ Code Quality: ⭐⭐ NEEDS SIGNIFICANT IMPROVEMENT
├─ Performance: ⭐ CRITICAL ISSUES
├─ Security: ⭐ VULNERABILITIES DETECTED
├─ Testing: ⭐ INSUFFICIENT
└─ Documentation: ⭐⭐ INCOMPLETE

Overall Grade: D (Below Standards)

Critical Issues:
🔴 [Critical issue 1]
🔴 [Critical issue 2]
🔴 [Critical issue 3]

───────────────────────────────────────────────────────────────

Recommendation: Cannot implement as suggested.

God-Tier Alternative Required:

Problem Areas:
├─ [Area 1]: [why problematic]
├─ [Area 2]: [why problematic]
└─ [Area 3]: [why problematic]

Proposed Solution:
```typescript
[complete god-tier implementation]
```

Explanation:
[Detailed explanation of improvements]

───────────────────────────────────────────────────────────────

Recommendation: Implement God-Tier alternative
Proceed? [yes/no/discuss]
```

═══════════════════════════════════════════════════════════════

## CRITICAL REMINDERS

### NEVER DO THESE:

```
1.  ❌ Skip verification phase
2.  ❌ Assume previous work is correct
3.  ❌ Proceed without a plan
4.  ❌ Skip testing
5.  ❌ Ignore errors/warnings
6.  ❌ Commit code with TODOs
7.  ❌ Use console.log (use proper logging)
8.  ❌ Hardcode values (use config/env)
9.  ❌ Sacrifice quality for speed
10. ❌ Proceed without user approval after planning
11. ❌ Use 'any' type in TypeScript
12. ❌ Skip documentation
13. ❌ Ignore accessibility
14. ❌ Introduce security vulnerabilities
15. ❌ Write untested code
```

### ALWAYS DO THESE:

```
1.  ✅ Read full task requirements
2.  ✅ Verify current state
3.  ✅ Create detailed plan
4.  ✅ Wait for user approval
5.  ✅ Write tests with code
6.  ✅ Use TypeScript strict mode
7.  ✅ Add JSDoc documentation
8.  ✅ Handle errors properly
9.  ✅ Follow SOLID principles
10. ✅ Run all quality checks
11. ✅ Verify acceptance criteria
12. ✅ Generate completion report
13. ✅ Commit with descriptive messages
14. ✅ Update roadmap
15. ✅ Identify next task
```

═══════════════════════════════════════════════════════════════

## PROTOCOL ACTIVATION

This protocol is **MANDATORY** for ALL tasks in the Bubble Gum project.

**To activate for a new task:**
```
✅ God-Tier Development Protocol ACTIVATED
Ready to proceed with Task [X]
```

**To verify protocol compliance:**
```
□ Phase 0: Understanding - COMPLETE
□ Phase 1: Verification - COMPLETE
□ Phase 2: Planning - COMPLETE (awaiting approval)
□ Phase 3: Implementation - COMPLETE
□ Phase 4: Verification - COMPLETE
□ Phase 5: Report - COMPLETE
```

═══════════════════════════════════════════════════════════════

**Version**: 1.0.0
**Status**: ✅ ACTIVE
**Compliance**: MANDATORY
**Last Updated**: November 5, 2025

═══════════════════════════════════════════════════════════════

**END OF GOD-TIER DEVELOPMENT PROTOCOL**
