Review all changes against origin/main.

Do not modify anything.

First understand the surrounding implementation, callers, state flow,
types, APIs and existing conventions.

Look specifically for:

1. Incorrect logic
2. Edge cases
3. Race conditions
4. State synchronization bugs
5. React rendering/state issues
6. TypeScript problems hidden by casting
7. Missing error handling
8. Security issues
9. Performance regressions
10. Breaking API/data-model changes
11. Backward compatibility issues
12. Missing tests
13. Duplicate/unnecessary implementation
14. Existing utilities/components/hooks that should have been reused
15. Violations of repository architecture/conventions

Do not report formatting or subjective style issues unless they create
a real maintenance problem.

For every finding provide:

Severity: P0 / P1 / P2 / P3
File and line
Problem
Why it can fail
Example failure scenario
Recommended fix

Return findings only. Do not change the code.