# @notfounnd/ini-parser

<!-- TODO: Inserir badge de NPM version quando publicado -->
<!-- TODO: Inserir badge de NPM downloads quando publicado -->
<!-- TODO: Inserir badge de build status quando CI for configurado -->
<!-- TODO: Inserir badge de coverage quando CI for configurado -->
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org)

A professional INI file parser for Node.js with full CLI support. Parse INI configuration files into structured JavaScript objects with support for sections, multi-line values, comments, and global keys.

---

## ✨ TL;DR

**Library Usage** (JavaScript):
```javascript
const { parse } = require('@notfounnd/ini-parser');

const content = `
# Database configuration
[database]
host=localhost
port=5432
`;

const result = parse(content);
console.log(result); // { database: { host: ['localhost'], port: ['5432'] } }
```

**CLI Usage**:
```bash
ini-parser config.ini                    # Parse and output JSON
ini-parser config.ini --output data.json # Save to file
ini-parser config.ini --check            # Validate file
```

---

## 🚀 Features

- **📦 Library & CLI**: Use as a Node.js module or command-line tool
- **🔧 INI Standard Support**: Sections, key-value pairs, comments (`#` and `;`)
- **📝 Multi-line Values**: Indented continuation lines
- **🌍 Global Keys**: Keys outside of sections
- **🎯 Flexible Output**: Simplified or metadata format
- **✅ Validation**: File checking with statistics
- **🎨 Colored Output**: User-friendly CLI messages
- **⚡ Zero Config**: Works out of the box
- **🧪 Well Tested**: Comprehensive test suite

---

## 📦 Installation

### As a Library
```bash
npm install @notfounnd/ini-parser
```

### As a CLI Tool
```bash
npm install -g @notfounnd/ini-parser
```

### Install from GitHub
> **Note**: This package is not yet published on NPM. Install directly from GitHub:

```bash
# As a dependency
npm install github:notfounnd/ini-parser

# As a global CLI tool
npm install -g github:notfounnd/ini-parser
```

---

## 🏁 Quick Start

### As a Library

```javascript
const { parse } = require('@notfounnd/ini-parser');

// Example INI content
const content = `
# Database configuration
[database]
host=localhost
port=5432
name=myapp

[server]
port=3000
workers=4 8 16 32
`;

// Parse with simplified format (default)
const result = parse(content);
console.log(result);
// Output:
// {
//   database: {
//     host: ['localhost'],
//     port: ['5432'],
//     name: ['myapp']
//   },
//   server: {
//     port: ['3000'],
//     workers: ['4', '8', '16', '32']
//   }
// }

// Parse with metadata format
const metaResult = parse(content, { meta: true });
console.log(metaResult);
// Output includes type information:
// {
//   database: {
//     type: 'section',
//     content: {
//       host: { type: 'configuration', content: ['localhost'] },
//       port: { type: 'configuration', content: ['5432'] },
//       name: { type: 'configuration', content: ['myapp'] }
//     }
//   },
//   ...
// }
```

### As a CLI

```bash
# Parse INI file and output to stdout
ini-parser config.ini

# Save output to JSON file
ini-parser config.ini --output result.json

# Parse with metadata format
ini-parser config.ini --meta

# Validate file and show statistics
ini-parser config.ini --check

# Save to file without stdout (quiet mode)
ini-parser config.ini --output result.json --quiet

# Show version
ini-parser --version

# Show help
ini-parser --help
```

---

## 📚 Documentation

- **[API Reference](docs/API.md)** - Detailed library API documentation
- **[CLI Reference](docs/CLI.md)** - Complete CLI usage guide
- **[Parser Rules](docs/PARSER_RULES.md)** - INI parser behavior and rules

---

## 🔌 API Overview

### `parse(content, options)`

Parses INI file content into a structured JavaScript object.

**Parameters**:
- `content` (string): The INI file content as a string
- `options` (object, optional):
  - `meta` (boolean): If `true`, returns metadata format with type information; if `false`, returns simplified format (default: `false`)

**Returns**: `object` - Parsed INI data

**Output Formats**:

1. **Simplified Format** (default): Clean object structure with arrays of values
```javascript
{
  section: {
    key: ['value1', 'value2']
  }
}
```

2. **Metadata Format** (`meta: true`): Includes type information for advanced use cases
```javascript
{
  section: {
    type: 'section',
    content: {
      key: {
        type: 'configuration',
        content: ['value1', 'value2']
      }
    }
  }
}
```

**Supported Features**:
- ✅ Sections: `[section_name]`
- ✅ Key-value pairs: `key=value`
- ✅ Multi-line values (indented continuation)
- ✅ Global keys (outside of sections)
- ✅ Comments: `#` and `;` at line start
- ✅ Inline comments: `key=value # comment`
- ✅ Automatic value splitting by spaces
- ✅ Empty value handling

---

## 💻 CLI Overview

### Syntax
```bash
ini-parser <file> [options]
```

### Arguments
- `<file>`: Path to INI file (required)

### Options

| Flag | Alias | Description |
|------|-------|-------------|
| `--output <file>` | `-o` | Save output to JSON file |
| `--meta` | - | Return metadata format with type information |
| `--quiet` | `-q` | Suppress stdout output when saving to file |
| `--check` | - | Check INI file and display statistics without full output |
| `--version` | `-v` | Output the current version |
| `--help` | `-h` | Display help information |

### Exit Codes

- `0`: Success
- `1`: File error (not found, not readable, parse error)
- `2`: Argument error (invalid arguments, missing file)

### Examples

```bash
# Basic parsing
ini-parser config.ini

# Save to file
ini-parser config.ini -o output.json

# Validate file
ini-parser config.ini --check
# Output:
# [ SUCCESS ] File found: config.ini
# [ SUCCESS ] File readable: yes
# [ SUCCESS ] Parsed successfully: 3 sections, 12 keys

# Quiet mode (save without stdout)
ini-parser config.ini --output data.json --quiet

# Metadata format
ini-parser config.ini --meta --output meta.json
```

---

## 🧪 Examples

### Global Keys
```ini
# Global configuration
debug=true
log_level=info

[database]
host=localhost
```

Parsed result:
```javascript
{
  debug: ['true'],
  log_level: ['info'],
  database: {
    host: ['localhost']
  }
}
```

### Multi-line Values
```ini
[paths]
include=
  /usr/local/bin
  /usr/bin
  /bin
```

Parsed result:
```javascript
{
  paths: {
    include: ['/usr/local/bin', '/usr/bin', '/bin']
  }
}
```

### Space-separated Values
```ini
[server]
ports=8080 8081 8082
```

Parsed result:
```javascript
{
  server: {
    ports: ['8080', '8081', '8082']
  }
}
```

### Comments
```ini
# This is a comment
; This is also a comment

[section]
key=value # inline comment
```

Parsed result:
```javascript
{
  section: {
    key: ['value']
  }
}
```

---

## 🛠️ Development

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### Setup
```bash
# Clone repository
git clone https://github.com/notfounnd/ini-parser.git
cd ini-parser

# Install dependencies
npm install

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run linter
npm run lint:check

# Format code
npm run format
```

### Project Structure
```
ini-parser/
├── bin/               # CLI executable
├── src/
│   ├── lib/          # Library code (parser.js)
│   └── cli/          # CLI implementation
├── test/             # Test suites
├── docs/             # Documentation (future)
└── package.json
```

---

## 🤝 Contributing

Contributions are welcome! This project is actively maintained and we appreciate your help.

**How to contribute**:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

**Guidelines**:
- Follow existing code style (ESLint + Prettier configured)
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass (`npm test`)

For detailed contribution guidelines, see [CONTRIBUTING.md](CONTRIBUTING.md).

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🔗 Links

- **Repository**: [github.com/notfounnd/ini-parser](https://github.com/notfounnd/ini-parser)
- **Issues**: [github.com/notfounnd/ini-parser/issues](https://github.com/notfounnd/ini-parser/issues)
- **Changelog**: [CHANGELOG.md](CHANGELOG.md)
- **Author**: [Júnior Sbrissa](https://github.com/notfounnd)

---

**Made with ❤️ by Júnior Sbrissa | Errør 404 | NotFounnd**
