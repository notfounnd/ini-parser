# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

---

## [1.0.0] - 2025-01-06

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
  - End-to-end testing script for CLI (`test/bin/e2e-test.sh`)

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

---

## Version Links

[Unreleased]: https://github.com/notfounnd/ini-parser/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/notfounnd/ini-parser/releases/tag/v1.0.0
