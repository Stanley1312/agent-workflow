# Rule: Testing Conventions

## Test File Naming
- File name must reflect the **domain being tested**
- File name must NEVER contain "wave", "wave1", "wave2", or any wave number — in any format or language
- If a wave adds tests to an existing domain → append to that file, do not create a new one

**Good:** `test_stream.py`, `test_admin.py`, `auth.test.ts`, `dashboard.test.ts`
**Bad:** `test_wave1.py`, `test_ui_wave2.py`, `wave3.test.ts`

## Test Naming
```
describe("[domain / feature name]")
it("should [expected behavior] when [condition]")
```
- Test name must map directly to an acceptance criterion in SPEC.md
- Use domain language, not implementation details

**Good:** `it("should reject login when password is incorrect")`
**Bad:** `it("should return 401 from /api/auth/login POST handler")`

## Coverage per wave
For each acceptance criterion:
- [ ] Happy path test
- [ ] At least one edge case from the SPEC edge case table
- [ ] Invalid / unauthorized input test
- [ ] Boundary conditions
