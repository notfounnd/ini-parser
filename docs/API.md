# API Reference

Complete API documentation for `@notfounnd/ini-parser` - a professional INI file parser for Node.js.

---

## Table of Contents

1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Quick Start](#quick-start)
4. [API Reference](#api-reference)
   - [parse(content, options)](#parsecontent-options)
   - [Parameters](#parameters)
   - [Return Value](#return-value)
   - [Output Formats](#output-formats)
5. [Usage Examples](#usage-examples)
   - [Basic Parsing](#basic-parsing)
   - [Parsing with Metadata Format](#parsing-with-metadata-format)
   - [Reading from File](#reading-from-file)
   - [Error Handling and Validation](#error-handling-and-validation)
6. [Advanced Usage](#advanced-usage)
   - [JavaScript Integration](#javascript-integration)
   - [TypeScript Compatibility](#typescript-compatibility)
7. [Error Handling Best Practices](#error-handling-best-practices)
8. [TypeScript Support](#typescript-support)
9. [See Also](#see-also)

---

## Introduction

The `@notfounnd/ini-parser` library provides a simple, powerful API for parsing INI configuration files into JavaScript objects. The library exports a single function (`parse`) that handles all parsing operations.

**What it does:**
- Converts INI file content (as a string) into structured JavaScript objects
- Supports sections, key-value pairs, multi-line values, comments, and global keys
- Provides two output formats: simplified (default) and metadata (with type information)
- Handles invalid input gracefully by returning empty objects

---

## Installation

Install the package as a library dependency:

```bash
npm install @notfounnd/ini-parser
```

---

## Quick Start

Here's the fastest way to get started:

```javascript
const { parse } = require('@notfounnd/ini-parser');

const content = `
[database]
host=localhost
port=5432
`;

const result = parse(content);
console.log(result);
// Output: { database: { host: ['localhost'], port: ['5432'] } }
```

---

## API Reference

### `parse(content, options)`

Parses INI file content into a structured JavaScript object.

#### Parameters

##### `content` (string, required)

The INI file content as a string.

**Type:** `string`

**Validation:**
- Must be a non-empty string
- Must be of type `string` (not `null`, `undefined`, or other types)
- Invalid input returns an empty object `{}`

**Example:**
```javascript
const content = `
[section]
key=value
`;

const result = parse(content);
```

##### `options` (object, optional)

Configuration options for parsing behavior.

**Type:** `object`

**Default:** `{ meta: false }`

**Properties:**

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `meta` | `boolean` | `false` | Output format control |

###### `meta` option

Controls the output format of the parsed data.

**When to use each format:**

- **`meta: false` (Simplified Format)**
  - For most use cases
  - When you need clean, minimal output
  - When working with simple configuration files
  - When you don't need type information
  - Default and recommended for general use

- **`meta: true` (Metadata Format)**
  - When you need to distinguish between sections and keys programmatically
  - When building tools that process INI structure (editors, validators, converters)
  - When you need to preserve type information for reconstruction
  - For advanced use cases requiring structural metadata

#### Return Value

**Type:** `object`

Returns a JavaScript object representing the parsed INI data. The structure depends on the `meta` option:

**Simplified Format** (`meta: false`):
```javascript
{
  globalKey: ['value'],
  section: {
    key: ['value1', 'value2']
  }
}
```

**Metadata Format** (`meta: true`):
```javascript
{
  globalKey: {
    type: 'configuration',
    content: ['value']
  },
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

**Special cases:**
- Empty file: `{}`
- Invalid input (`null`, `undefined`, non-string): `{}`
- Empty string: `{}`
- Comment-only file: `{}`

#### Output Formats

##### Simplified Format (Default)

The default format provides a clean, minimal structure:

**Structure:**
- Global keys: `{ key: ['value1', 'value2'] }`
- Sections: `{ section: { key: ['value1', 'value2'] } }`
- All values are arrays (even single values)

**Example:**
```javascript
const content = `
[db]
host=localhost
port=5432
`;

const ini = parse(content);
// {
//   db: {
//     host: ['localhost'],
//     port: ['5432']
//   }
// }
```

**When to use:**
- Default for most applications
- Reading configuration files
- Simple data extraction
- Clean JSON output

##### Metadata Format

The metadata format includes type information for each element:

**Structure:**
- Global keys: `{ key: { type: 'configuration', content: [...] } }`
- Sections: `{ section: { type: 'section', content: {...} } }`
- Type information allows programmatic distinction

**Example:**
```javascript
const content = `
[db]
host=localhost
`;

const ini = parse(content, { meta: true });
// {
//   db: {
//     type: 'section',
//     content: {
//       host: {
//         type: 'configuration',
//         content: ['localhost']
//       }
//     }
//   }
// }
```

**When to use:**
- Building INI editors or validators
- Converting between formats
- Reconstructing INI files from parsed data
- Advanced structural analysis

---

## Usage Examples

### Basic Parsing

Parse a simple INI file with sections and key-value pairs:

```javascript
const { parse } = require('@notfounnd/ini-parser');

const content = `
# Application configuration
[server]
host=0.0.0.0
port=8080

[database]
host=localhost
port=5432
name=myapp
`;

const config = parse(content);
console.log(config);
// {
//   server: {
//     host: ['0.0.0.0'],
//     port: ['8080']
//   },
//   database: {
//     host: ['localhost'],
//     port: ['5432'],
//     name: ['myapp']
//   }
// }

// Access values
const dbHost = config.database.host[0]; // 'localhost'
const serverPort = config.server.port[0]; // '8080'
```

### Parsing with Metadata Format

Use the metadata format for advanced processing:

```javascript
const { parse } = require('@notfounnd/ini-parser');

const content = `
debug=true

[features]
auth=enabled
api=enabled
`;

const config = parse(content, { meta: true });
console.log(JSON.stringify(config, null, 2));
// {
//   "debug": {
//     "type": "configuration",
//     "content": ["true"]
//   },
//   "features": {
//     "type": "section",
//     "content": {
//       "auth": {
//         "type": "configuration",
//         "content": ["enabled"]
//       },
//       "api": {
//         "type": "configuration",
//         "content": ["enabled"]
//       }
//     }
//   }
// }

// Check if entry is a section
if (config.features.type === 'section') {
  console.log('Features is a section');
  const keys = Object.keys(config.features.content);
  console.log('Features keys:', keys); // ['auth', 'api']
}
```

### Reading from File

Integrate with Node.js `fs` module to parse files:

```javascript
const { parse } = require('@notfounnd/ini-parser');
const fs = require('fs');

// Synchronous file reading
try {
  const content = fs.readFileSync('./config.ini', 'utf8');
  const config = parse(content);
  console.log('Configuration loaded:', config);
} catch (error) {
  console.error('Error reading config file:', error.message);
}
```

### Error Handling and Validation

Handle invalid input and validate parsed data:

```javascript
const { parse } = require('@notfounnd/ini-parser');

// Function to safely parse INI content
function safeParseINI(content) {
  // Validate input type
  if (typeof content !== 'string') {
    console.warn('Invalid input: content must be a string');
    return {};
  }

  // Validate input is not empty
  if (content.trim() === '') {
    console.warn('Empty INI content provided');
    return {};
  }

  // Parse content
  const result = parse(content);

  // Check if parsing returned empty object
  if (Object.keys(result).length === 0) {
    console.warn('Parsing resulted in empty configuration');
  }

  return result;
}

// Example: validate required sections exist
function validateConfig(config) {
  const requiredSections = ['database', 'server'];
  const missingSections = requiredSections.filter(
    section => !config[section]
  );

  if (missingSections.length > 0) {
    throw new Error(
      `Missing required sections: ${missingSections.join(', ')}`
    );
  }

  return true;
}

// Usage
const fs = require('fs');

const content = fs.readFileSync('./config.ini', 'utf8');
const config = safeParseINI(content);

try {
  validateConfig(config);
  console.log('Configuration is valid');
} catch (error) {
  console.error('Configuration validation failed:', error.message);
}
```

---

## Advanced Usage

### JavaScript Integration

Complete real-world example of configuration management:

```javascript
const { parse } = require('@notfounnd/ini-parser');
const fs = require('fs');
const path = require('path');

/**
 * Configuration manager with INI file support
 */
class ConfigManager {
  constructor(configPath) {
    this.configPath = configPath;
    this.config = {};
  }

  /**
   * Load configuration from INI file
   */
  load() {
    try {
      const content = fs.readFileSync(this.configPath, 'utf8');
      this.config = parse(content);

      // Validate configuration
      this.validate();

      return this.config;
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new Error(`Config file not found: ${this.configPath}`);
      }
      throw new Error(`Failed to load config: ${error.message}`);
    }
  }

  /**
   * Validate required configuration sections
   */
  validate() {
    const required = ['database', 'server'];
    const missing = required.filter(section => !this.config[section]);

    if (missing.length > 0) {
      throw new Error(`Missing required sections: ${missing.join(', ')}`);
    }
  }

  /**
   * Get configuration value with default fallback
   */
  get(section, key, defaultValue = null) {
    if (!this.config[section]) {
      return defaultValue;
    }

    const value = this.config[section][key];
    if (!value || value.length === 0) {
      return defaultValue;
    }

    // Return first value for single values
    return value.length === 1 ? value[0] : value;
  }

  /**
   * Get configuration value as number
   */
  getNumber(section, key, defaultValue = 0) {
    const value = this.get(section, key);
    if (value === null) {
      return defaultValue;
    }

    const parsed = Number(value);
    return isNaN(parsed) ? defaultValue : parsed;
  }

  /**
   * Get configuration value as boolean
   */
  getBoolean(section, key, defaultValue = false) {
    const value = this.get(section, key);
    if (value === null) {
      return defaultValue;
    }

    return value.toLowerCase() === 'true' || value === '1';
  }

  /**
   * Get all values for a key (array)
   */
  getArray(section, key, defaultValue = []) {
    if (!this.config[section]) {
      return defaultValue;
    }

    return this.config[section][key] || defaultValue;
  }
}

// Usage example
function main() {
  const configPath = path.join(__dirname, 'app.ini');
  const manager = new ConfigManager(configPath);

  try {
    manager.load();

    // Get configuration values with proper types
    const dbHost = manager.get('database', 'host', 'localhost');
    const dbPort = manager.getNumber('database', 'port', 5432);
    const debugMode = manager.getBoolean('app', 'debug', false);
    const allowedHosts = manager.getArray('server', 'allowed_hosts', []);

    console.log('Database:', { host: dbHost, port: dbPort });
    console.log('Debug mode:', debugMode);
    console.log('Allowed hosts:', allowedHosts);

  } catch (error) {
    console.error('Configuration error:', error.message);
    process.exit(1);
  }
}

main();
```

### TypeScript Compatibility

The library is JavaScript-based but provides JSDoc type annotations for TypeScript compatibility:

```typescript
// TypeScript will infer types from JSDoc comments
import { parse } from '@notfounnd/ini-parser';

const content = `
[database]
host=localhost
port=5432
`;

// TypeScript knows this returns an object
const config = parse(content);

// Type inference works for options parameter
const metaConfig = parse(content, { meta: true });

// You can define your own types for better type safety
interface SimplifiedConfig {
  [key: string]: string[] | {
    [key: string]: string[];
  };
}

interface MetaConfig {
  [key: string]: {
    type: 'configuration' | 'section';
    content: any;
  };
}

// Use type assertions for specific structures
const typedConfig = parse(content) as SimplifiedConfig;
const typedMetaConfig = parse(content, { meta: true }) as MetaConfig;

// Example: Type-safe configuration interface
interface DatabaseConfig {
  database: {
    host: string[];
    port: string[];
    name: string[];
  };
}

function loadDatabaseConfig(iniContent: string): DatabaseConfig {
  const config = parse(iniContent) as DatabaseConfig;

  // Validate structure
  if (!config.database) {
    throw new Error('Missing database section');
  }

  return config;
}

const dbConfig = loadDatabaseConfig(content);
console.log(dbConfig.database.host[0]); // TypeScript knows this is a string
```

---

## Error Handling Best Practices

### Input Validation

The parser handles invalid input gracefully, but you should validate input in your application:

```javascript
const { parse } = require('@notfounnd/ini-parser');

/**
 * Validates and parses INI content with detailed error reporting
 */
function parseWithValidation(content, source = 'unknown') {
  // Check if content is provided
  if (content === null || content === undefined) {
    throw new TypeError(
      `Invalid input: content is ${content === null ? 'null' : 'undefined'} (source: ${source})`
    );
  }

  // Check if content is a string
  if (typeof content !== 'string') {
    throw new TypeError(
      `Invalid input: expected string, got ${typeof content} (source: ${source})`
    );
  }

  // Check if content is empty
  if (content.trim() === '') {
    console.warn(`Warning: Empty INI content (source: ${source})`);
    return {};
  }

  // Parse content
  const result = parse(content);

  // Check if result is empty (could indicate malformed content)
  if (Object.keys(result).length === 0) {
    console.warn(`Warning: Parsing resulted in empty object (source: ${source})`);
  }

  return result;
}

// Usage
try {
  const config = parseWithValidation(fileContent, 'app.ini');
  console.log('Parsed config:', config);
} catch (error) {
  console.error('Validation error:', error.message);
}
```

### Behavior with Invalid Input

The `parse` function returns an empty object `{}` for invalid input:

| Input | Return Value | Reason |
|-------|--------------|--------|
| `null` | `{}` | Not a string |
| `undefined` | `{}` | Not a string |
| `123` | `{}` | Not a string |
| `''` (empty string) | `{}` | Empty input |
| `'   '` (whitespace) | `{}` | No valid content |
| `'# comment only'` | `{}` | No configuration data |

**Example:**
```javascript
const { parse } = require('@notfounnd/ini-parser');

console.log(parse(null));        // {}
console.log(parse(undefined));   // {}
console.log(parse(''));          // {}
console.log(parse(123));         // {}
console.log(parse('# comment')); // {}
```

### Best Practices for Robust Code

1. **Always validate file content before parsing:**
```javascript
const fs = require('fs');

function loadConfig(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');

    if (!content || content.trim() === '') {
      console.warn('Configuration file is empty');
      return getDefaultConfig();
    }

    return parse(content);
  } catch (error) {
    console.error('Error loading config:', error.message);
    return getDefaultConfig();
  }
}
```

2. **Provide default values for missing keys:**
```javascript
function getConfigValue(config, section, key, defaultValue) {
  if (!config[section] || !config[section][key]) {
    return defaultValue;
  }

  const value = config[section][key];
  return value.length > 0 ? value[0] : defaultValue;
}

const host = getConfigValue(config, 'database', 'host', 'localhost');
```

3. **Validate required configuration exists:**
```javascript
function validateRequiredConfig(config) {
  const required = {
    database: ['host', 'port', 'name'],
    server: ['port']
  };

  for (const [section, keys] of Object.entries(required)) {
    if (!config[section]) {
      throw new Error(`Missing required section: ${section}`);
    }

    for (const key of keys) {
      if (!config[section][key] || config[section][key].length === 0) {
        throw new Error(`Missing required key: ${section}.${key}`);
      }
    }
  }
}

try {
  validateRequiredConfig(config);
} catch (error) {
  console.error('Configuration validation failed:', error.message);
  process.exit(1);
}
```

4. **Handle type conversions safely:**
```javascript
function safeParseNumber(value, defaultValue = 0) {
  const parsed = Number(value);
  return isNaN(parsed) ? defaultValue : parsed;
}

function safeParseBoolean(value, defaultValue = false) {
  if (typeof value !== 'string') {
    return defaultValue;
  }

  const normalized = value.toLowerCase();
  return normalized === 'true' || normalized === '1' || normalized === 'yes';
}

const port = safeParseNumber(config.server.port[0], 3000);
const debug = safeParseBoolean(config.app.debug?.[0], false);
```

---

## TypeScript Support

While `@notfounnd/ini-parser` is a JavaScript library, it provides excellent TypeScript compatibility through JSDoc type annotations.

### IDE Type Inference

Modern IDEs (VS Code, WebStorm, etc.) can infer types from JSDoc comments:

```javascript
const { parse } = require('@notfounnd/ini-parser');

// IDE will show:
// function parse(content: string, options?: { meta?: boolean }): object
const content = `
[section]
key=value
`;

const config = parse(content);
```

### Type Definitions

The library does not include `.d.ts` files, but IDEs will generate types from JSDoc:

**Inferred signature:**
```typescript
function parse(
  content: string,
  options?: { meta?: boolean }
): object
```

### Using with TypeScript Projects

You can use the library in TypeScript projects without additional configuration:

```typescript
import { parse } from '@notfounnd/ini-parser';

const content: string = `
[db]
host=localhost
`;

const config = parse(content);
// config is inferred as 'object'
```

### Custom Type Definitions

For better type safety, define your own types based on your INI structure:

```typescript
interface AppConfig {
  database?: {
    host?: string[];
    port?: string[];
    name?: string[];
  };
  server?: {
    port?: string[];
    host?: string[];
  };
}

const config = parse(content) as AppConfig;
// Now you have full type safety for your specific structure
```

---

## See Also

- **[Parser Rules](./PARSER_RULES.md)** - Detailed documentation on how the parser interprets INI files.
- **[CLI Reference](./CLI.md)** - Complete guide for using the command-line interface.

---

**Made with ❤️ by Júnior Sbrissa | Errør 404 | NotFounnd**
