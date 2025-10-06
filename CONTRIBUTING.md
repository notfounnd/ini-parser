# Contributing to @notfounnd/ini-parser

First off, thank you for considering contributing to `@notfounnd/ini-parser`! It's people like you that make this project better for everyone.

This document provides guidelines for contributing to the project. Following these guidelines helps communicate that you respect the time of the developers managing and developing this open source project. In return, they should reciprocate that respect in addressing your issue, assessing changes, and helping you finalize your pull requests.

---

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [How Can I Contribute?](#how-can-i-contribute)
   - [Reporting Bugs](#reporting-bugs)
   - [Suggesting Features](#suggesting-features)
   - [Improving Documentation](#improving-documentation)
   - [Contributing Code](#contributing-code)
3. [Development Setup](#development-setup)
   - [Prerequisites](#prerequisites)
   - [Getting Started](#getting-started)
   - [Project Structure](#project-structure)
4. [Development Workflow](#development-workflow)
   - [Running Tests](#running-tests)
   - [Code Style](#code-style)
   - [Committing Changes](#committing-changes)
5. [Pull Request Process](#pull-request-process)
6. [Development Guidelines](#development-guidelines)
   - [Coding Conventions](#coding-conventions)
   - [Testing Guidelines](#testing-guidelines)
   - [Documentation Guidelines](#documentation-guidelines)

---

## Code of Conduct

This project and everyone participating in it is governed by respect, professionalism, and collaboration. By participating, you are expected to uphold these values. Please be respectful and constructive in all interactions.

**Our Standards:**
- **Be respectful**: Treat everyone with respect and kindness
- **Be constructive**: Provide helpful feedback and suggestions
- **Be collaborative**: Work together to solve problems
- **Be professional**: Maintain a professional tone in all communications

**Unacceptable Behavior:**
- Harassment, discrimination, or offensive comments
- Personal attacks or insults
- Trolling or deliberately disruptive behavior
- Publishing others' private information without permission

If you encounter unacceptable behavior, please report it by opening an issue or contacting the maintainers directly.

---

## How Can I Contribute?

### Reporting Bugs

Before creating a bug report, please check the [existing issues](https://github.com/notfounnd/ini-parser/issues) to avoid duplicates.

**When reporting a bug, please include:**

1. **Description**: Clear and concise description of what the bug is
2. **Steps to Reproduce**: Detailed steps to reproduce the behavior
3. **Expected Behavior**: What you expected to happen
4. **Actual Behavior**: What actually happened
5. **Environment**:
   - OS: (e.g., Windows 11, macOS 14, Ubuntu 22.04)
   - Node.js version: (run `node --version`)
   - Package version: (run `ini-parser --version` or check `package.json`)
6. **INI File Content**: Minimal INI file that reproduces the issue (if applicable)
7. **Output**: Actual output or error message received
8. **Additional Context**: Any other relevant information

**Bug Report Template:**

```markdown
**Description:**
A clear and concise description of what the bug is.

**Steps to Reproduce:**
1. Create a file named `test.ini` with the following content:
   ```ini
   [section]
   key=value
   ```
2. Run `ini-parser test.ini`
3. See error

**Expected Behavior:**
The parser should output...

**Actual Behavior:**
The parser outputs...

**Environment:**
- OS: Windows 11
- Node.js: v20.10.0
- Package version: 1.0.0

**INI File Content:**
```ini
[section]
key=value
```

**Output:**
```
Error: ...
```

**Additional Context:**
Any other relevant information...
```

### Suggesting Features

We welcome feature suggestions! Before creating a feature request, please:

1. **Check existing issues**: Search for similar feature requests
2. **Consider the scope**: Ensure the feature aligns with the project's goals
3. **Discuss first**: Open a discussion issue before implementing large features

**When suggesting a feature, please include:**

1. **Problem Statement**: What problem does this feature solve?
2. **Proposed Solution**: How should the feature work?
3. **Use Cases**: Real-world examples of when this would be useful
4. **Alternatives Considered**: Other solutions you've considered
5. **Additional Context**: Mockups, examples, or references

**Feature Request Template:**

```markdown
**Problem Statement:**
As a user, I want to... because...

**Proposed Solution:**
The feature should work like this:
1. ...
2. ...

**Use Cases:**
- Use case 1: ...
- Use case 2: ...

**Alternatives Considered:**
- Alternative 1: ...
- Alternative 2: ...

**Additional Context:**
Any mockups, examples, or references...
```

### Improving Documentation

Documentation improvements are always welcome! This includes:

- Fixing typos or grammatical errors
- Clarifying confusing sections
- Adding examples
- Improving code comments
- Translating documentation (contact maintainers first)

For documentation changes:
1. Follow the same Pull Request process as code changes
2. Ensure all examples are tested and working
3. Maintain consistency with existing documentation style
4. Use clear, concise language in US English

### Contributing Code

Code contributions should:
- Fix a bug
- Implement a feature
- Improve performance
- Refactor code for better maintainability

**Before writing code:**
1. Open an issue to discuss the change (for non-trivial changes)
2. Wait for maintainer feedback and approval
3. Follow the development guidelines below

---

## Development Setup

### Prerequisites

Ensure you have the following installed:

- **Node.js**: Version 18.0.0 or higher
  - Check version: `node --version`
  - Download: https://nodejs.org/
- **npm**: Version 9.0.0 or higher (comes with Node.js)
  - Check version: `npm --version`
- **Git**: For version control
  - Check version: `git --version`
  - Download: https://git-scm.com/

### Getting Started

1. **Fork the repository**

   Click the "Fork" button at the top right of the [repository page](https://github.com/notfounnd/ini-parser).

2. **Clone your fork**

   ```bash
   git clone https://github.com/YOUR-USERNAME/ini-parser.git
   cd ini-parser
   ```

3. **Add upstream remote**

   ```bash
   git remote add upstream https://github.com/notfounnd/ini-parser.git
   ```

4. **Install dependencies**

   ```bash
   npm install
   ```

5. **Verify setup**

   Run the test suite to ensure everything is working:

   ```bash
   npm test
   ```

   All tests should pass. If you encounter issues, please open an issue.

### Project Structure

```
ini-parser/
├── src/
│   ├── lib/
│   │   └── parser.js          # Core parser logic
│   └── cli/
│       └── index.js            # CLI implementation
├── bin/
│   └── ini-parser.js           # Executable entry point
├── test/
│   ├── lib/
│   │   └── parser.test.js     # Parser tests
│   ├── cli/
│   │   └── index.test.js      # CLI tests
│   └── __fixtures__/          # Test fixture files
├── docs/
│   ├── PARSER_RULES.md        # Parser behavior documentation
│   ├── API.md                  # API reference
│   └── CLI.md                  # CLI reference
├── .agents/                    # Internal development docs (pt-BR)
├── package.json
├── jest.config.js             # Jest configuration
├── eslint.config.mjs          # ESLint configuration
├── .prettierrc.json           # Prettier configuration
└── README.md
```

**Key Files:**

- **`src/lib/parser.js`**: Core INI parsing logic (library)
- **`src/cli/index.js`**: Command-line interface implementation
- **`bin/ini-parser.js`**: Executable wrapper for the CLI
- **`test/__fixtures__/`**: INI files used for testing

---

## Development Workflow

### Running Tests

The project uses [Jest](https://jestjs.io/) for testing.

**Run all tests:**
```bash
npm test
```

**Run tests in watch mode:**
```bash
npm run test:watch
```

**Run tests with coverage:**
```bash
npm run test:coverage
```

**Coverage targets:**
- Statements: > 90%
- Branches: > 85%
- Functions: 100%
- Lines: > 90%

**Running specific tests:**
```bash
# Run only library tests
npm test -- test/lib/parser.test.js

# Run only CLI tests
npm test -- test/cli/index.test.js

# Run tests matching a pattern
npm test -- --testNamePattern="should parse"
```

### Code Style

This project uses **ESLint** for linting and **Prettier** for code formatting.

**Check for linting errors:**
```bash
npm run lint:check
```

**Automatically fix linting errors:**
```bash
npm run lint:fix
```

**Check code formatting:**
```bash
npm run format:check
```

**Automatically format code:**
```bash
npm run format:fix
```

**Format and lint everything:**
```bash
npm run format
```

**Code Style Rules:**

1. **Naming Conventions:**
   - Variables and functions: `camelCase`
   - Private/helper functions: Prefix with `_` (e.g., `_isValidInput`)
   - Constants: `UPPER_SNAKE_CASE` (when appropriate)
   - Files: `kebab-case.js`

2. **Language:**
   - All code, comments, and documentation: **English (en-US)**
   - Internal development docs (`.agents/`): Portuguese (pt-BR)

3. **Functions:**
   - Use **Guard Clauses** (early returns) to avoid nested conditionals
   - Keep functions small and focused (Single Responsibility)
   - Document complex functions with JSDoc

4. **Code Organization:**
   - Prefer **Strategy Pattern** (object mapping) over if/else chains
   - Separate concerns: classification vs. execution
   - Keep cyclomatic complexity low

5. **Imports:**
   - Use CommonJS (`require`/`module.exports`)
   - Group imports logically: Node.js built-ins → external packages → local modules

6. **Comments:**
   - Write self-documenting code first
   - Add comments for complex logic or non-obvious decisions
   - Keep comments concise and up-to-date

### Committing Changes

**Commit Message Format:**

Use clear, descriptive commit messages in the imperative mood:

```
<type>: <subject>

<body> (optional)
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring (no behavior change)
- `test`: Adding or updating tests
- `chore`: Maintenance tasks (dependencies, config, etc.)

**Examples:**

```
feat: add support for multi-line values with custom delimiters

fix: correct parsing of empty sections

docs: update API.md with TypeScript examples

test: add edge case tests for comment handling

refactor: simplify line classification logic using strategy pattern
```

**Commit Best Practices:**
- Write in present tense ("add feature" not "added feature")
- Keep subject line under 72 characters
- Separate subject from body with a blank line
- Use the body to explain **what** and **why**, not **how**

---

## Pull Request Process

1. **Create a feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

   **Branch naming conventions:**
   - Feature: `feature/description`
   - Bug fix: `fix/description`
   - Documentation: `docs/description`
   - Refactor: `refactor/description`

2. **Make your changes**

   - Write clean, well-documented code
   - Follow the code style guidelines
   - Add tests for new functionality
   - Update documentation as needed

3. **Validate your changes**

   Run the full validation suite before committing:

   ```bash
   npm run validate
   ```

   This runs:
   - `npm run format` (lint fix + format fix)
   - `npm run lint:check` (verify no lint errors)
   - `npm run format:check` (verify formatting)
   - `npm test` (run all tests)

   **All checks must pass before submitting a PR.**

4. **Commit your changes**

   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Keep your fork updated**

   ```bash
   git fetch upstream
   git rebase upstream/master
   ```

6. **Push to your fork**

   ```bash
   git push origin feature/your-feature-name
   ```

7. **Open a Pull Request**

   - Go to the [repository](https://github.com/notfounnd/ini-parser)
   - Click "New Pull Request"
   - Select your branch
   - Fill out the PR template (see below)

**Pull Request Template:**

```markdown
## Description
Brief description of what this PR does.

## Motivation and Context
Why is this change needed? What problem does it solve?
If it fixes an open issue, please link to the issue here.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## How Has This Been Tested?
Describe the tests you ran to verify your changes.

- [ ] All existing tests pass
- [ ] Added new tests for new functionality
- [ ] Tested manually with the following INI files: ...

## Checklist
- [ ] My code follows the code style of this project
- [ ] I have run `npm run validate` and all checks pass
- [ ] I have updated the documentation accordingly
- [ ] I have added tests to cover my changes
- [ ] All new and existing tests pass
- [ ] My commit messages follow the convention
```

8. **Code Review**

   - Maintainers will review your PR
   - Address any feedback or requested changes
   - Be patient and respectful during the review process
   - Update your PR by pushing new commits to your branch

9. **Merge**

   Once approved, a maintainer will merge your PR. Congratulations! 🎉

---

## Development Guidelines

### Coding Conventions

1. **Library (`src/lib/parser.js`):**
   - **No I/O operations**: The library should only parse strings
   - **Pure functions**: Avoid side effects when possible
   - **Single responsibility**: Each function does one thing well
   - **Exports**: Only export the `parse` function

2. **CLI (`src/cli/index.js`):**
   - **Separation of concerns**: I/O operations belong here, not in the library
   - **Error handling**: Provide clear, actionable error messages
   - **Exit codes**: Use correct exit codes (0 = success, 1 = file errors, 2 = argument errors)
   - **Colored output**: Use Chalk for user-friendly messages

3. **Tests:**
   - **Use fixtures**: Reuse existing fixtures when possible
   - **Test behavior, not implementation**: Focus on inputs and outputs
   - **Descriptive test names**: Use `it('should...')` format
   - **Coverage**: Aim for high coverage, but prioritize meaningful tests

### Testing Guidelines

**Writing Good Tests:**

1. **Test structure (Triple A Pattern):**

   Follow the **AAA (Arrange-Act-Assert)** pattern for clear, readable tests:

   - **Arrange**: Set up test data and preconditions
   - **Act**: Execute the code under test
   - **Assert**: Verify the expected outcome

   ```javascript
   describe('Feature or Module', () => {
     describe('Specific functionality', () => {
       it('should do something specific', () => {
         // Arrange: Set up test data
         const input = '...';

         // Act: Execute the function
         const result = parse(input);

         // Assert: Verify the result
         expect(result).toEqual({...});
       });
     });
   });
   ```

2. **Test coverage:**
   - Test happy paths (normal, expected usage)
   - Test edge cases (empty input, unusual formatting)
   - Test error cases (invalid input, malformed data)
   - Test boundary conditions (very large files, special characters)

3. **Fixture usage:**
   - **Prefer fixtures over inline content** (avoid writing file content inline in tests)
   - Read from `test/__fixtures__/` directory instead of using template strings
   - Reuse existing fixtures when possible (8 fixtures available)
   - Create new fixtures only when necessary
   - Keep fixtures minimal and focused
   - Document fixture contents in test descriptions

4. **Assertions:**
   - Use specific matchers (`toEqual`, `toBe`, `toContain`, etc.)
   - Test both positive and negative cases
   - Avoid testing implementation details

**Example Test (Using Fixtures):**

```javascript
const fs = require('fs');
const path = require('path');
const { parse } = require('../../src/lib/parser');

describe('parse()', () => {
  describe('Multi-line values', () => {
    it('should parse indented continuation lines as array values', () => {
      // Read from fixture file instead of inline content
      const fixturePath = path.join(__dirname, '../__fixtures__/valid-multiline.ini');
      const content = fs.readFileSync(fixturePath, 'utf8');

      const result = parse(content);

      expect(result).toHaveProperty('pytest');
      expect(result.pytest.addopts).toEqual(['-rA', '--cov=package', '--cov-config=.coveragerc']);
    });
  });
});
```

**When inline content is acceptable:**

For very simple, focused unit tests that don't require a full fixture file:

```javascript
it('should return empty object for empty string', () => {
  const result = parse('');
  expect(result).toEqual({});
});

it('should return empty object for null input', () => {
  const result = parse(null);
  expect(result).toEqual({});
});
```

**Rule of thumb**: If the INI content is more than 2-3 lines, use a fixture file.

### Documentation Guidelines

**When updating documentation:**

1. **Consistency:**
   - Match the tone and style of existing documentation
   - Use US English spelling and grammar
   - Maintain consistent formatting (headings, code blocks, lists)

2. **Examples:**
   - All code examples must be tested and working
   - Use realistic, practical examples
   - Show both input and expected output
   - Use template strings for multi-line content (avoid inline `\n`)

3. **Cross-references:**
   - Link to related documentation
   - Keep "See Also" sections up-to-date
   - Use relative links for internal documentation

4. **Markdown:**
   - Use proper heading hierarchy (`#`, `##`, `###`)
   - Use code blocks with language specifiers (\```javascript, \```bash, \```ini)
   - Use tables for structured data
   - Keep lines under 120 characters when possible

**Documentation files:**
- `README.md`: Project overview, quick start, features
- `docs/API.md`: Complete API reference for the library
- `docs/CLI.md`: Complete CLI usage guide
- `docs/PARSER_RULES.md`: Technical reference for parser behavior
- `CONTRIBUTING.md`: This file
- `CHANGELOG.md`: Version history (maintained by maintainers)

---

## Questions?

If you have questions that aren't addressed in this guide:

1. Check the [existing issues](https://github.com/notfounnd/ini-parser/issues)
2. Check the [documentation](./docs/)
3. Open a new issue with the "question" label

---

## Thank You!

Thank you for contributing to `@notfounnd/ini-parser`! Your time and effort help make this project better for everyone.

---

**Made with ❤️ by Júnior Sbrissa | Errør 404 | NotFounnd**
