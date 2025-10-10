# Changelog

## 1.8.0 (2025-10-10)

### Features

* fase_01 - add lib parser ([5a3d06b](https://github.com/notfounnd/ini-parser/commit/5a3d06bc91c6aa28e4efb012833f24e477cb101c))
* fase_02 - add cli tool ([c7e2d55](https://github.com/notfounnd/ini-parser/commit/c7e2d558db4227389c392b644db958cf19e3689c))

### Bug Fixes

* fase_04 - correct e2e test script execution path ([#2](https://github.com/notfounnd/ini-parser/issues/2)) ([fffcb0c](https://github.com/notfounnd/ini-parser/commit/fffcb0c5b254eb6297d114c55df0e7719b7833f2))
* meta option logic ([8788997](https://github.com/notfounnd/ini-parser/commit/87889971d287ab0c42a7970817e2540dc1ee84fe))

### Documentation

* fase_03 - add project docs ([6a78c81](https://github.com/notfounnd/ini-parser/commit/6a78c8116b7e272414a52908f415e376e8c77fa3))
* fase_04 - review readme and add pull request template ([#3](https://github.com/notfounnd/ini-parser/issues/3)) ([eb9c47b](https://github.com/notfounnd/ini-parser/commit/eb9c47bb1d008660b027639ebecbabb9759c1f9e))
* remove FASE_02.md in root project ([2f91218](https://github.com/notfounnd/ini-parser/commit/2f9121843257dfb1bb57f9b13858fc587598dc8f))
* update documentation guidelines in CONTRIBUTING.md ([d476efe](https://github.com/notfounnd/ini-parser/commit/d476efea1cb6a3424de31a7114e145f8c0f9a125))

### Misc

* bump package version ([97c5a32](https://github.com/notfounnd/ini-parser/commit/97c5a324841752a99b92d017c60fa5909868f48d))
* bump package version ([c4d4404](https://github.com/notfounnd/ini-parser/commit/c4d440486bb09441142a29bb2f73496fe14d7cdc))
* bump package version ([504fab1](https://github.com/notfounnd/ini-parser/commit/504fab1d2274eafca0f349bff081f4056ef77058))
* bump package version ([2e62227](https://github.com/notfounnd/ini-parser/commit/2e62227f6117203460ce0cb8d61c8708f414da3e))
* fase_04 - check setup github actions ([#1](https://github.com/notfounnd/ini-parser/issues/1)) ([a01b369](https://github.com/notfounnd/ini-parser/commit/a01b3690054e38521fc424118b9812452dbc1200))
* fase_04 - setup github actions ([1954913](https://github.com/notfounnd/ini-parser/commit/195491331a36c5275b6a93e0fa0d24508944b3fd))
* setup project ([e5c9a3a](https://github.com/notfounnd/ini-parser/commit/e5c9a3aeae43b9ed0d8484f0f1074d809f4d8673))
* update workflow config ([#4](https://github.com/notfounnd/ini-parser/issues/4)) ([edeee2e](https://github.com/notfounnd/ini-parser/commit/edeee2e6a49741eae9bc0559ce3719c09de33adc))

## 1.0.0 (2025-01-06) - Test Release

### Added
- **Core Parser Library** (`src/lib/parser.js`)
  - Full INI file parsing with support for sections, key-value pairs, and global keys
  - Multi-line value support with indented continuation lines
  - Comment handling (both `#` and `;` characters)
  - Inline comment removal
  - Automatic value splitting by whitespace
  - Two output formats: simplified (default) and metadata (with `meta: true` option)
  - Support for `.ini`, `.config`, and `.properties` file extensions
  - Guard Clauses and Strategy Pattern for clean, maintainable code
  - 95.86% library code coverage (statements), 100% function coverage

- **Command-Line Interface** (`src/cli/index.js`, `bin/ini-parser.js`)
  - Global CLI installation support via `npm install -g`
  - Parse INI files from command line with `ini-parser <file>`
  - `--output/-o <file>` flag to save JSON output to file
  - `--meta` flag to return metadata format with type information
  - `--quiet/-q` flag to suppress stdout when saving to file
  - `--check` flag to validate file and display statistics
  - `--version/-v` flag to display package version
  - `--help/-h` flag to display usage information
  - Colored terminal output using Chalk.js
  - Proper exit codes: 0 (success), 1 (file errors), 2 (argument errors)
  - Descriptive error messages for common issues

- **Testing Infrastructure**
  - 78 comprehensive tests (44 for library, 34 for CLI)
  - 8 optimized fixture files covering all parsing scenarios
  - Jest test framework with watch and coverage modes
  - 92.59% overall code coverage
  - End-to-end testing script for CLI (`test/bin/bin-test.sh`)

- **Code Quality Tools**
  - ESLint configuration (flat config format)
  - Prettier code formatting
  - `npm run validate` script for pre-commit checks
  - `npm run format` script for automatic formatting and linting

- **Documentation**
  - Comprehensive README.md with quick start guide and examples
  - API Reference (`docs/API.md`) with library usage documentation
  - CLI Reference (`docs/CLI.md`) with command-line usage guide
  - Parser Rules (`docs/PARSER_RULES.md`) with detailed parsing behavior
  - Contributing Guide (`CONTRIBUTING.md`) with development guidelines
  - MIT License (`LICENSE`)

- **Features**
  - Parse sections: `[section_name]`
  - Parse key-value pairs: `key=value`
  - Support global keys (keys outside of sections)
  - Handle multi-line values with indentation
  - Process comments (`#` and `;`) as line and inline comments
  - Automatic value splitting by spaces
  - Empty value handling (returns empty array)
  - Empty section handling (returns empty object)
  - Support for values with equals signs (e.g., `--cov-config=.coveragerc`)
  - Resilient parsing with best-effort approach for malformed content

### Changed
- Nothing (initial release)

### Deprecated
- Nothing (initial release)

### Removed
- Nothing (initial release)

### Fixed
- Nothing (initial release)

### Security
- Nothing (initial release)
